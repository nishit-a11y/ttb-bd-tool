import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaRegStickyNote, FaImage } from "react-icons/fa";
import "./Notes.css";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fire from "./Firebase";
import { baseUrl } from "../pages/collection_config";

export default function Notes({ gamesList = [], onGamesListUpdate }) {
  const db = getFirestore(fire);
  const [notesState, setNotesState] = useState({});
  const [editorGameId, setEditorGameId] = useState(null);
  const [editorMode, setEditorMode] = useState("text"); // "text" | "image"
  const [editorText, setEditorText] = useState("");
  const [editorImage, setEditorImage] = useState(""); // full data URL after compression
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [showAiImagePopup, setShowAiImagePopup] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiImageLoading, setAiImageLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (gamesList.length > 0) {
      setNotesState((prev) => {
        const initial = {};
        gamesList.forEach((game) => {
          if (prev[game.id]) {
            initial[game.id] = prev[game.id];
          } else {
            const hasContent =
              (game.note && game.note.trim() !== "") || !!game.image;
            initial[game.id] = {
              status: hasContent ? "on" : "off",
              note: game.note || "",
              image: game.image || "",
            };
          }
        });
        return initial;
      });
      initializedRef.current = true;
    }
  }, [gamesList]);

  const triggerNotesChange = (state) => {
    const result = gamesList.map((game) => ({
      ...game,
      note: state[game.id]?.note || "",
      image: state[game.id]?.image || "",
    }));
    onGamesListUpdate?.(result);
  };

  const openEditor = (gameId) => {
    setEditorGameId(gameId);
    const existing = notesState[gameId];
    if (existing?.image) {
      setEditorMode("image");
      setEditorImage(existing.image);
      setEditorText("");
    } else {
      setEditorMode("text");
      setEditorText(existing?.note || "");
      setEditorImage("");
    }
  };

  const handleModeSwitch = (mode) => {
    if (mode === editorMode) return;
    if (editorMode === "text" && editorText.trim() !== "") {
      const ok = window.confirm(
        "Switching to image mode will clear the current text note. Continue?"
      );
      if (!ok) return;
    }
    if (editorMode === "image" && editorImage) {
      const ok = window.confirm(
        "Switching to text mode will clear the current image. Continue?"
      );
      if (!ok) return;
    }
    setEditorMode(mode);
    if (mode === "text") setEditorImage("");
    if (mode === "image") setEditorText("");
  };

  const handleSwitchChange = (gameId, checked) => {
    const existing = notesState[gameId];
    if (checked) {
      openEditor(gameId);
    } else {
      const hasContent =
        (existing?.note && existing.note.trim() !== "") || !!existing?.image;
      if (hasContent) {
        const confirmClear = window.confirm(
          "You have already entered a note/image. Turning off will clear it. Do you want to proceed?"
        );
        if (!confirmClear) return;
      }
      const newState = {
        ...notesState,
        [gameId]: { status: "off", note: "", image: "" },
      };
      setNotesState(newState);
      triggerNotesChange(newState);
    }
  };

  const saveNote = () => {
    let newState;
    if (editorMode === "text") {
      const trimmed = editorText.trim();
      newState = {
        ...notesState,
        [editorGameId]: {
          status: trimmed !== "" ? "on" : "off",
          note: trimmed,
          image: "",
        },
      };
    } else {
      newState = {
        ...notesState,
        [editorGameId]: {
          status: editorImage ? "on" : "off",
          note: "",
          image: editorImage,
        },
      };
    }
    setNotesState(newState);
    triggerNotesChange(newState);
    setEditorGameId(null);
    setEditorText("");
    setEditorImage("");
    setEditorMode("text");
  };

  const cancelNote = () => {
    const existing = notesState[editorGameId];
    const newState = {
      ...notesState,
      [editorGameId]: {
        status: (existing?.note?.trim() || existing?.image) ? "on" : "off",
        note: existing?.note || "",
        image: existing?.image || "",
      },
    };
    setNotesState(newState);
    triggerNotesChange(newState);
    setEditorGameId(null);
    setEditorText("");
    setEditorImage("");
    setEditorMode("text");
  };

  // ── Text AI generation ────────────────────────────────────────────────────

  const buildPrompt = (game) => {
    return `You are an expert in corporate team-building and employee engagement. Based on the client context and activity details below, write a short customization note explaining how this activity is relevant for this client.

Client Context: ${aiDescription}

Activity: ${game.name}
Objective: ${game.game_objective}
Key Details: ${game.key_title1}: ${game.key_description1}, ${game.key_title2}: ${game.key_description2}, ${game.key_title3}: ${game.key_description3}

OUTPUT REQUIREMENTS
1. Opening Paragraph (2-3 sentences) — MOST CRITICAL SECTION
Do NOT begin with generic framings like "This activity is perfect for...", "Just like in the business world...", or "In today's fast-paced environment...". These are weak and interchangeable.
Instead, the opening must follow this three-beat structure:

Beat 1 — Name the specific tension: Open by articulating the exact business reality, transition, or leadership inflection point this cohort is navigating (e.g., the shift from individual delivery to collective accountability when moving from Director to Partner). Be concrete about what changes for them.
Beat 2 — Name the capability gap: Explicitly identify the precise behavioral muscle this group must build or unlearn — not generic "teamwork" or "communication," but the sharp, specific skill the context demands (e.g., trusting peers with visibility on your work, leading without direct authority, balancing individual KPIs with shared P&L ownership).
Beat 3 — Bridge to the mechanic: In one line, show how the specific design of the activity (its unique constraints, rules, or tensions) creates a safe simulation of that exact dynamic.

The opener should read as if it could only have been written for this client — not copy-pasted to any firm.
2. Bullet Points (3-4 <li> items)
Each bullet must:

Lead with a bolded capability (e.g., Shared Goals, Collaboration, Communication).
State an operational detail of the activity (how it actually works on the ground).
Tie it to a specific example from the client's role, industry, or company context.
Close with a link to the activity debrief — what participants will reflect on afterward.

3. Conclusion (one line)
A single crisp sentence summarizing the outcome the client will walk away with — written as a concrete capability gain, not a motivational platitude.

FORMATTING RULES

No salutation, greeting, or sign-off (no "Dear Client", no "Regards").
Use default HTML icons/symbols to make the content visually appealing.
Apply <strong> for emphasis and <em> sparingly for nuance.
Return clean HTML using only <p>, <ul>, <li>, <strong>, and <em> tags.
No markdown, no headings, no tables, no inline CSS.


QUALITY CHECK BEFORE RETURNING OUTPUT
Silently verify:

Could the opener be copy-pasted to a different client and still make sense? If yes, rewrite it.
Does each bullet reference something concrete about this client's work, not generic corporate life?
Is the conclusion a specific capability gain, or a vague motivational line? If vague, sharpen it.

Return only the final HTML. No preamble, no explanation.`;
  };

  const generateNote = async () => {
    let game = gamesList.find((g) => g.id === editorGameId);
    if (!game.game_objective) {
      const docSnap = await getDoc(doc(db, "games", game.id));
      if (docSnap.exists()) game = { ...game, ...docSnap.data() };
    }
    setAiLoading(true);
    const token = await getAuth().currentUser.getIdToken();
    const response = await fetch(`${baseUrl}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: buildPrompt(game) }],
      }),
    });
    const data = await response.json();
    if (data.error) {
      const msg = typeof data.error === "string" ? data.error : data.error.message;
      alert(msg || "Something went wrong. Please try again.");
      setAiLoading(false);
      return;
    }
    setEditorText(data.choices[0].message.content);
    setAiLoading(false);
    setShowAiPopup(false);
  };

  // ── Image AI generation ───────────────────────────────────────────────────

  const buildImagePrompt = (game) => {
    const clientContext = aiDescription ? `\n\nClient brief: ${aiDescription}` : "";
    return `Activity: "${game.name}"
Theme: ${game.game_objective}
Key pillars: ${game.key_title1}, ${game.key_title2}, ${game.key_title3}${clientContext}

Image size: 1536x1024.`;
  };

  const compressBase64Image = (b64) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Scale down to fit within 900x600 (landscape-friendly) while preserving ratio
        const maxWidth = 1400;
        const maxHeight = 788;
        let { width, height } = img;
        const ratio = Math.max(width / maxWidth, height / maxHeight);
        if (ratio > 1) {
          width = Math.round(width / ratio);
          height = Math.round(height / ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.90));
      };
      img.src = `data:image/png;base64,${b64}`;
    });

  const generateImage = async () => {
    let game = gamesList.find((g) => g.id === editorGameId);
    if (!game.game_objective) {
      const docSnap = await getDoc(doc(db, "games", game.id));
      if (docSnap.exists()) game = { ...game, ...docSnap.data() };
    }
    setAiImageLoading(true);
    try {
      const token = await getAuth().currentUser.getIdToken();
      const response = await fetch(`${baseUrl}/api/ai/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: buildImagePrompt(game) }),
      });
      const data = await response.json();
      if (data.error) {
        const msg = typeof data.error === "string" ? data.error : data.error.message;
        alert(msg || "Image generation failed. Please try again.");
        setAiImageLoading(false);
        return;
      }
      const dataUrl = await compressBase64Image(data.b64_json);

      // Upload to Firebase Storage so Firestore document stays under 1MB limit
      const storage = getStorage(fire);
      const storageRef = ref(storage, `ai_images/${Date.now()}_${editorGameId}.jpg`);
      await uploadString(storageRef, dataUrl, "data_url");
      const storageUrl = await getDownloadURL(storageRef);

      setEditorImage(storageUrl);
      setAiImageLoading(false);
      setShowAiImagePopup(false);
    } catch (err) {
      alert("Image generation failed: " + err.message);
      setAiImageLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="notes table" className="table mt-4">
          <TableHead>
            <TableRow>
              <TableCell className="text-nowrap tab-width">Selected Activities</TableCell>
              <TableCell className="text-nowrap tab-width1">Enable Custom Content</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gamesList.map((game) => {
              const state = notesState[game.id] || { status: "off", note: "", image: "" };
              return (
                <TableRow key={game.id}>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={state.status === "on"}
                        onChange={(e) => handleSwitchChange(game.id, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </TableCell>
                  <TableCell>
                    {state.status === "on" && (state.note || state.image) && (
                      <span
                        className="note-icon"
                        onClick={() => openEditor(game.id)}
                        title="Click to edit"
                      >
                        {state.image ? <FaImage /> : <FaRegStickyNote />}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Editor popup ── */}
      {editorGameId !== null && (
        <div className="popup-overlay">
          <div className="editor-popup">
            <h4>
              Edit Content for{" "}
              {gamesList.find((g) => g.id === editorGameId)?.name}
            </h4>

            {/* Mode toggle */}
            <div className="mode-toggle">
              <button
                className={`mode-btn ${editorMode === "text" ? "mode-btn-active" : ""}`}
                onClick={() => handleModeSwitch("text")}
              >
                ✏️ Text Note
              </button>
              <button
                className={`mode-btn ${editorMode === "image" ? "mode-btn-active" : ""}`}
                onClick={() => handleModeSwitch("image")}
              >
                🖼 AI Image
              </button>
            </div>

            {editorMode === "text" ? (
              <>
                <ReactQuill
                  value={editorText}
                  onChange={setEditorText}
                  style={{ height: "300px", marginBottom: "50px" }}
                />
                <div className="popup-buttons">
                  <button onClick={() => setShowAiPopup(true)} className="ai-gen-btn">
                    AI Gen
                  </button>
                  <button onClick={saveNote} className="save-btn">
                    Save
                  </button>
                  <button onClick={cancelNote} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="image-preview-area">
                  {editorImage ? (
                    <img
                      src={editorImage}
                      alt="AI generated"
                      className="image-preview-img"
                    />
                  ) : (
                    <div className="image-preview-placeholder">
                      No image yet. Click <strong>Generate AI Image</strong> below.
                    </div>
                  )}
                </div>
                <div className="popup-buttons">
                  <button
                    onClick={() => setShowAiImagePopup(true)}
                    className="ai-gen-btn"
                  >
                    {editorImage ? "Re-generate" : "Generate AI Image"}
                  </button>
                  <button onClick={saveNote} className="save-btn" disabled={!editorImage}>
                    Save
                  </button>
                  <button onClick={cancelNote} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── AI text generation popup ── */}
      {showAiPopup && (
        <div className="popup-overlay ai-overlay">
          <div className="editor-popup ai-popup">
            <h4>Generate Note with AI</h4>
            <div className="ai-field">
              <label>Description / Program of Client</label>
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder={`A single paragraph that includes:\n  * Company background\n  * Industry\n  * Participant profile\n  * Context of the program\n  * Theme (if any)\n  * Expectations from the program`}
                rows={9}
              />
            </div>
            <div className="popup-buttons">
              <button className="save-btn" onClick={generateNote} disabled={aiLoading}>
                {aiLoading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Generating...
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
              <button className="cancel-btn" onClick={() => setShowAiPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI image generation popup ── */}
      {showAiImagePopup && (
        <div className="popup-overlay ai-overlay">
          <div className="editor-popup ai-popup">
            <h4>Generate AI Image</h4>
            <p style={{ fontSize: "13px", color: "#555", marginBottom: "10px" }}>
              Optionally describe the client context to make the image more tailored.
              Image generation takes ~15–20 seconds.
            </p>
            <div className="ai-field">
              <label>Description / Program of Client</label>
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder={`A single paragraph that includes:\n  * Company background\n  * Industry\n  * Participant profile\n  * Context of the program\n  * Theme (if any)\n  * Expectations from the program`}
                rows={7}
              />
            </div>
            <div className="popup-buttons">
              <button
                className="save-btn"
                onClick={generateImage}
                disabled={aiImageLoading}
              >
                {aiImageLoading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Generating image...
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowAiImagePopup(false)}
                disabled={aiImageLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
