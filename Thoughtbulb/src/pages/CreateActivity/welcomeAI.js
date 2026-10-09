// AI helpers for the Welcome slide section of Create/Edit Activity.
// Uses the existing protected backend endpoints (/api/ai/chat, /api/ai/image) — the OpenAI key stays on the server.
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fire from "../../components/Firebase";
import { baseUrl } from "../collection_config";

const EXAMPLES = [{"name": "Comic Strip Challenge", "tagline": "Unleash team superpowers", "welcome": "You'll become storytellers, turning your company's message into the next blockbuster comic strip.", "model_name": "Message to vision", "model_type": "wheel", "elements": [{"label": "Message", "line": "Pick the idea worth telling"}, {"label": "Values", "line": "Bring company values to life"}, {"label": "Story", "line": "Shape a memorable narrative"}, {"label": "Alignment", "line": "Rally everyone behind one vision"}], "scene": "colleagues gathered around a table joyfully drawing their own comic strip panels with colourful markers, while playful original cartoon superheroes of their own invention (simple rounded heroes with capes and eye masks) rise out of the paper with comic bursts, stars and motion lines; empty speech bubbles"}, {"name": "4 Roles of Creativity", "tagline": "Every team needs all four", "welcome": "You'll step into four creative roles and discover how great ideas travel from spark to success.", "model_name": "The four creative roles", "model_type": "quadrant", "elements": [{"label": "Explorer", "line": "Seek fresh ideas everywhere"}, {"label": "Artist", "line": "Turn ideas into something new"}, {"label": "Judge", "line": "Weigh what will really work"}, {"label": "Warrior", "line": "Champion the idea to the finish"}], "scene": "four colleagues each playfully embodying a creative role around one big glowing lightbulb: one explorer looking through binoculars with a compass, one artist painting on an easel, one judge thoughtfully inspecting with a magnifying glass, one warrior confidently planting a bright flag; connected by swirling idea lines"}, {"name": "The Throne Challenge", "tagline": "Build a throne fit for royalty", "welcome": "You'll design and build for the toughest customers in the kingdom, and they'll sit on the result.", "model_name": "The customer feedback loop", "model_type": "cycle", "elements": [{"label": "Listen", "line": "Uncover what the royals need"}, {"label": "Design", "line": "Sketch a plan that fits"}, {"label": "Build", "line": "Craft it sturdy and regal"}, {"label": "Refine", "line": "Adapt as needs change"}], "scene": "a team of colleagues building a grand, colourful throne from cardboard, wood and fabric, with tools, measuring tape and sketches around them, while two colleagues wearing playful paper crowns as the king and queen test-sit the throne and give an enthusiastic thumbs up"}];

// Same illustration recipe used for the 317 existing welcome illustrations
const IMAGE_STYLE =
  "Flat modern editorial illustration in portrait orientation. Show {scene}. " +
  "Any people are a diverse, international team of colleagues: a clear mix of ethnicities (for example East Asian, Black, white European, " +
  "South Asian, Latin American and Middle Eastern), a range of ages and genders, in smart-casual wear, with friendly happy expressions. " +
  "Bright, warm, optimistic pastel-rainbow palette (coral #FF6B6B, orange #FF8B37, sunny yellow #F8D665, green #22A26C, blue #1667E1, purple #7B6FD8) " +
  "on a soft light pastel background. Clean shapes, gentle soft shadows, lots of breathing room. " +
  "Original characters only; nothing resembling any existing franchise, brand, mascot, logo or real person. " +
  "Absolutely no text, letters, numbers or words anywhere, no signage text, no logos, no watermarks. " +
  "IMPORTANT: zero text of any kind - no clocks or timers with digits, no scoreboards, no numbered cards, no labels on jars, boxes or signs, " +
  "no captions, no writing on paper or screens; use simple shapes and icons instead.";

async function authHeaders() {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Please log in again to use AI features.");
  const token = await user.getIdToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// Everything we know about the activity from the form, so the AI writes for THIS activity
export function activityContext(s) {
  const titles = s.descriptionData?.title || [];
  const descs = s.descriptionData?.description || [];
  const lines = [
    `Activity name: ${s.game_name || "(not set)"}`,
    `Format: ${s.game_type === "Virtual" ? "Virtual" : "In-person"}${s.category ? ` (${s.category})` : ""}`,
    `Objective: ${s.objectiveData || "(not set)"}`,
  ];
  const pts = (s.objectivePoints || []).filter(Boolean).map((p) => p.replace(/\*\*/g, ""));
  if (pts.length) lines.push(`Slide bullets: ${pts.join(" | ")}`);
  const pillars = titles.map((t, i) => (t ? `${t.trim()}: ${(descs[i] || "").trim()}` : "")).filter(Boolean);
  if (pillars.length) lines.push(`Key pillars (shown on the next slide): ${pillars.join(" | ")}`);
  const outs = (s.outcomes || []).filter(Boolean);
  if (outs.length) lines.push(`Teams walk away with: ${outs.join(", ")}`);
  return lines.join("\n");
}

export function hasEnoughContext(s) {
  return Boolean(s.game_name && s.objectiveData && s.objectiveData.trim().length > 30);
}

function buildDraftMessages(s) {
  const system = `You write the "welcome slide" for a team-building activity in a B2B proposal read by HR / L&D buyers (The Thought Bulb).
Return ONLY a JSON object with these keys:
- tagline: punchy hook, 3-6 words, max 32 characters.
- welcome: one sentence to participants starting with "You'll", 12-18 words, ends with a full stop.
- model_name: 2-5 words naming the activity's OWN learning model (the thinking behind the activity, not logistics), sentence case.
  Never use the name of an established model (e.g. Kurt Lewin, Tuckman, Design Thinking) as model_name; mention it only in model_reference.
- model_type: one of "wheel" | "staircase" | "cycle" | "quadrant" | "clover" chosen by meaning: staircase = elements build in order;
  cycle = a repeating loop (feedback, learning, iteration); quadrant = four roles/styles/perspectives; clover = values, wellbeing, culture;
  wheel = complementary skills that sit side by side.
- elements: exactly 4 objects {"label","line"}; label = one word (max 11 characters), line = 3-6 words (max 30 characters), no full stop.
  The elements must be specific to THIS activity and complement (not copy) the key pillars.
- model_reference: the name of an established model ONLY if the objective explicitly names one (e.g. "Kurt Lewin's change model"), else "".
- scene: 1-2 sentences describing an illustration of the activity in action (objects, setting, mood). Do not describe people's ethnicity.
  No brands, logos, known characters, and no text, numbers, clocks, timers or scoreboards in the scene.
Rules: use only facts from the activity details; never invent durations, numbers, venues or client names. British/Indian English spelling.
No hype words, no emojis, no exclamation marks.
Approved examples (match this tone and quality):
${JSON.stringify(EXAMPLES)}`;
  return [
    { role: "system", content: system },
    { role: "user", content: `Write the welcome slide for this activity:\n${activityContext(s)}` },
  ];
}

function parseJson(text) {
  const m = String(text || "").match(/\{[\s\S]*\}/);
  if (!m) throw new Error("The AI reply was not in the expected format. Please try again.");
  return JSON.parse(m[0]);
}

const clip = (v, n) => String(v || "").trim().slice(0, n);
const TYPES = ["wheel", "staircase", "cycle", "quadrant", "clover"];

function problems(out) {
  const p = [];
  const els = Array.isArray(out.elements) ? out.elements : [];
  if (!out.tagline || out.tagline.length > 32) p.push("tagline must be 3-6 words and at most 32 characters");
  if (!/^You'll/.test(out.welcome || "")) p.push('welcome must start with "You\'ll"');
  if (!TYPES.includes(out.model_type)) p.push("model_type must be one of " + TYPES.join(", "));
  if (els.length !== 4) p.push("elements must have exactly 4 items");
  els.forEach((e, i) => {
    if (!e || !e.label || e.label.length > 11) p.push(`element ${i + 1} label "${e && e.label}" must be one word of at most 11 characters`);
    if (!e || !e.line || e.line.length > 30) p.push(`element ${i + 1} line "${e && e.line}" must be at most 30 characters`);
  });
  return p;
}

async function chat(headers, messages) {
  let data;
  for (const model of ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"]) {
    const res = await fetch(`${baseUrl}/api/ai/chat`, { method: "POST", headers, body: JSON.stringify({ model, messages }) });
    data = await res.json();
    if (!data.error) return data.choices?.[0]?.message?.content || "";
  }
  throw new Error(typeof data.error === "string" ? data.error : data.error.message || "AI draft failed");
}

export async function draftWelcome(s) {
  const headers = await authHeaders();
  const messages = buildDraftMessages(s);
  let reply = await chat(headers, messages);
  let out = parseJson(reply);
  const issues = problems(out);
  if (issues.length) {
    // one automatic correction round so the draft fits the slide
    reply = await chat(headers, [...messages, { role: "assistant", content: reply },
      { role: "user", content: "Fix these issues and return the full corrected JSON only: " + issues.join("; ") }]);
    try { out = parseJson(reply); } catch (e) { /* keep first draft */ }
  }
  const els = Array.isArray(out.elements) ? out.elements : [];
  return {
    tagline: clip(out.tagline, 60),
    welcome: clip(out.welcome, 160),
    model_name: clip(out.model_name, 40),
    model_type: TYPES.includes(out.model_type) ? out.model_type : "wheel",
    model_reference: clip(out.model_reference, 80),
    // not truncated: anything still over the limit shows red in the form and is caught on save
    elements: [0, 1, 2, 3].map((i) => ({ label: clip(els[i]?.label, 30), line: clip(els[i]?.line, 60) })),
    scene: clip(out.scene, 400),
  };
}

function compressPortrait(b64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxH = 1216, ratio = Math.max(1, img.height / maxH);
      const w = Math.round(img.width / ratio), h = Math.round(img.height / ratio);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("Could not read the generated image"));
    img.src = `data:image/png;base64,${b64}`;
  });
}

// Generates a portrait illustration and stores it in Firebase Storage. Returns the download URL.
export async function generateIllustration(s, scene) {
  const fallback = `colleagues taking part in a team activity called "${s.game_name}": ${String(s.objectiveData || "").slice(0, 300)}`;
  const prompt = IMAGE_STYLE.replace("{scene}", String(scene || fallback).trim().replace(/[. ]+$/, ""));
  const res = await fetch(`${baseUrl}/api/ai/image`, { method: "POST", headers: await authHeaders(), body: JSON.stringify({ prompt, size: "1024x1536" }) });
  const data = await res.json();
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : data.error.message || "Image generation failed");
  const dataUrl = await compressPortrait(data.b64_json);
  const storageRef = ref(getStorage(fire), `welcome_images/${Date.now()}_${(s.game_name || "activity").replace(/[^a-z0-9]+/gi, "_")}.jpg`);
  await uploadString(storageRef, dataUrl, "data_url");
  return getDownloadURL(storageRef);
}
