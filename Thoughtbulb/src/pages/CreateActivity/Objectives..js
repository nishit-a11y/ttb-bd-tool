import React, { useState, useEffect } from "react";
import { draftWelcome, generateIllustration, generateIcon, hasEnoughContext } from "./welcomeAI";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import "cropperjs/dist/cropper.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "react-tabs/style/react-tabs.css";
import {
  setObjectiveData,
  setObjectivePoints,
  setOutcomes,
  setWelcomeSlide,
} from "./CreateActivitySlice";

const MODEL_TYPES = [
  { value: "wheel", label: "Wheel — skills that sit side by side" },
  { value: "staircase", label: "Staircase — steps that build in order" },
  { value: "cycle", label: "Cycle — a repeating loop (feedback, learning)" },
  { value: "quadrant", label: "Quadrant — four roles, styles or perspectives" },
  { value: "clover", label: "Clover — values, wellbeing, culture" },
];
const LIMITS = { tagline: 32, welcome: 130, label: 11, line: 30 };

const POINT_MAX = 120;
const OUTCOME_MAX = 40;
const POINT_HINTS = [
  "What teams do — e.g. Teams build a **fully functional sewing machine** and pitch it",
  "The challenge / twist — e.g. **Requirements keep changing** as customers give feedback",
  "What it builds — e.g. Builds **customer focus** by turning feedback into a better product",
];
const OUTCOME_HINTS = ["e.g. Faster group decisions", "e.g. Stronger team bonds", "e.g. Creative confidence"];

// Shows **phrase** as bold, exactly like the proposal slide
const BoldPreview = ({ text }) =>
  text
    ? text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )
    : null;
const Objectives = ({
  completed,
  expanded,
  disabled,
  setComleted,
  setExpanded,
  setDisabled,
  handleContinue,
}) => {
  const { objectiveData, objectivePoints, outcomes, welcomeSlide } = useSelector(
    (state) => state.createActivity
  );
  const formState = useSelector((state) => state.createActivity);
  const [drafting, setDrafting] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatingIcon, setGeneratingIcon] = useState(false);
  const onGenerateIcon = async () => {
    if (!formState.game_name) { alert("Please fill the activity name (step 1) first."); return; }
    if (ws.icon && !window.confirm("Replace the current slide icon with a new AI icon? (about $0.04 per icon)")) return;
    setGeneratingIcon(true);
    try { const url = await generateIcon(formState, ws.icon_concept); setWS({ icon: url }); }
    catch (e) { alert(e.message || "Icon generation failed. Please try again."); }
    finally { setGeneratingIcon(false); }
  };
  const onIconUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setWS({ icon: reader.result });
    reader.readAsDataURL(file);
  };
  const ws = welcomeSlide ?? { elements: [{}, {}, {}, {}] };
  const onDraft = async () => {
    if (!hasEnoughContext(formState)) { alert("Please fill the activity name (step 1) and the Objective above first, so the AI has context."); return; }
    const filled = ws.tagline || ws.welcome || (ws.elements || []).some((e) => e.label || e.line);
    if (filled && !window.confirm("Replace the current welcome slide text with a new AI draft?")) return;
    setDrafting(true);
    try { const d = await draftWelcome(formState); setWS(d); }
    catch (e) { alert(e.message || "AI draft failed. Please try again."); }
    finally { setDrafting(false); }
  };
  const onGenerateImage = async () => {
    if (!formState.game_name) { alert("Please fill the activity name (step 1) first."); return; }
    if (ws.image && !window.confirm("Replace the current illustration with a new AI image? (about $0.20 per image)")) return;
    setGeneratingImg(true);
    try { const url = await generateIllustration(formState, ws.scene); setWS({ image: url }); }
    catch (e) { alert(e.message || "Image generation failed. Please try again."); }
    finally { setGeneratingImg(false); }
  };
  const setWS = (patch) => dispatch(setWelcomeSlide(patch));
  const setElement = (i, key, value) =>
    setWS({ elements: (ws.elements || []).map((e, k) => (k === i ? { ...e, [key]: value } : e)) });
  const onWelcomeImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setWS({ image: reader.result });
    reader.readAsDataURL(file);
  };
  const counter = (len, max) => (
    <span className="char-count" style={{ color: len > max ? "#d32f2f" : undefined }}>{len}/{max}</span>
  );
  const points = objectivePoints ?? ["", "", ""];
  const takeaways = outcomes ?? ["", "", ""];
  const updateAt = (arr, index, value) =>
    arr.map((v, i) => (i === index ? value : v));
  const dispatch = useDispatch();

  function validateObjective() {
    if (!objectiveData || objectiveData === "") {
      alert("Please enter the Objective of the activity ");
      return false;
    } else if (objectiveData.length > 380) {
      alert("Objective should be less than 380 characters");
      return false;
    } else if (points.some((p) => !p || p.trim().length < 10)) {
      alert("Please fill all 3 slide bullet points");
      return false;
    } else if (points.some((p) => p.length > POINT_MAX)) {
      alert(`Each slide bullet point should be under ${POINT_MAX} characters`);
      return false;
    } else if (points.some((p) => (p.match(/\*\*/g) || []).length % 2 !== 0)) {
      alert("A bold phrase is missing its closing ** in one of the bullet points");
      return false;
    } else if (takeaways.some((o) => !o || o.trim().length < 3)) {
      alert('Please fill all 3 "Teams walk away with" points');
      return false;
    } else if (takeaways.some((o) => o.length > OUTCOME_MAX)) {
      alert(`Each "Teams walk away with" point should be under ${OUTCOME_MAX} characters`);
      return false;
    } else if (ws.tagline && ws.tagline.trim()) {
      // Welcome slide is optional, but if a tagline is given the rest must be complete
      const els = ws.elements || [];
      if (ws.tagline.length > LIMITS.tagline) { alert(`Tagline should be under ${LIMITS.tagline} characters`); return false; }
      if (!ws.welcome || ws.welcome.trim().length < 10) { alert("Please add the welcome line for the welcome slide"); return false; }
      if (ws.welcome.length > LIMITS.welcome) { alert(`Welcome line should be under ${LIMITS.welcome} characters`); return false; }
      if (!ws.model_name || !ws.model_name.trim()) { alert("Please name the learning model"); return false; }
      if (els.length < 4 || els.some((e) => !e.label || !e.label.trim() || !e.line || !e.line.trim())) { alert("Please fill all 4 learning model elements (label and line)"); return false; }
      if (els.some((e) => e.label.length > LIMITS.label)) { alert(`Each model label should be under ${LIMITS.label} characters`); return false; }
      if (els.some((e) => e.line.length > LIMITS.line)) { alert(`Each model line should be under ${LIMITS.line} characters`); return false; }
      return true;
    } else {
      return true;
    }
  }
  return (
    <Accordion
      disabled={disabled}
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
    >
      <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
        <Typography fontSize={20} className="accordion-title">
          2. Objectives
        </Typography>
        {completed && (
          <img
            className="tick"
            src={require("../../assets/images/tick.png")}
            width={20}
            height={20}
          ></img>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <div class="form-group">
            <label for="formGroupExampleInput" className="labels">
              Objective *
            </label>
            <textarea
              class="form-control textarea"
              id="exampleFormControlTextarea1"
              rows="6"
              onChange={(e) => {
                dispatch(setObjectiveData(e.target.value));
              }}
              value={objectiveData}
            ></textarea>
          </div>
          <p className="objective-description char-count mb-3 mt-2">
            {objectiveData?.length}/380
          </p>
        </div>

        <div className="mt-4">
          <label className="labels">Objective — 3 slide bullet points *</label>
          <p className="objective-description mb-2">
            Shown as bullets on the proposal slide. Keep each to one line and wrap one key phrase in
            <strong> **double asterisks** </strong> to make it bold.
          </p>
          {points.map((point, index) => (
            <div className="form-group mb-3" key={`point-${index}`}>
              <input
                type="text"
                className="form-control"
                placeholder={POINT_HINTS[index]}
                value={point}
                onChange={(e) =>
                  dispatch(setObjectivePoints(updateAt(points, index, e.target.value)))
                }
              />
              <p className="objective-description mb-0 mt-1" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ color: "#002F59" }}>
                  {point ? <>Preview: <BoldPreview text={point} /></> : ""}
                </span>
                <span className="char-count" style={{ color: point.length > POINT_MAX ? "#d32f2f" : undefined }}>
                  {point.length}/{POINT_MAX}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="labels">Teams walk away with *</label>
          <p className="objective-description mb-2">
            3 short takeaways (2–4 words each), shown as pills at the bottom of the slide.
          </p>
          <div className="row">
            {takeaways.map((outcome, index) => (
              <div className="form-group col-md-4 mb-3" key={`outcome-${index}`}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={OUTCOME_HINTS[index]}
                  value={outcome}
                  onChange={(e) =>
                    dispatch(setOutcomes(updateAt(takeaways, index, e.target.value)))
                  }
                />
                <p className="objective-description char-count mb-0 mt-1" style={{ color: outcome.length > OUTCOME_MAX ? "#d32f2f" : undefined }}>
                  {outcome.length}/{OUTCOME_MAX}
                </p>
              </div>
            ))}
          </div>
        </div>


        <hr className="my-4" />
        <div>
          <label className="labels" style={{ fontSize: 18 }}>Welcome slide (first activity slide)</label>
          <p className="objective-description mb-3">
            Optional. When a tagline is filled in, proposals show the new welcome slide (tagline, welcome line, learning model and
            illustration) instead of the old cover image.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button type="button" className="btn btn-outline-primary" disabled={drafting} onClick={onDraft}>
              {drafting ? (<><span className="spinner-border spinner-border-sm mr-2" /> Drafting…</>) : "Draft with AI"}
            </button>
            <span className="objective-description">Uses the activity name, objective, slide bullets and key pillars. Review and edit before saving.</span>
          </div>
          <div className="row">
            <div className="form-group col-md-5 mb-3">
              <label className="labels">Tagline</label>
              <input type="text" className="form-control" placeholder="e.g. Unleash team superpowers" value={ws.tagline || ""}
                onChange={(e) => setWS({ tagline: e.target.value })} />
              <p className="objective-description mb-0 mt-1">{counter((ws.tagline || "").length, LIMITS.tagline)}</p>
            </div>
            <div className="form-group col-md-7 mb-3">
              <label className="labels">Welcome line (to participants)</label>
              <input type="text" className="form-control" placeholder="e.g. You'll become storytellers, turning your company's message into a comic strip."
                value={ws.welcome || ""} onChange={(e) => setWS({ welcome: e.target.value })} />
              <p className="objective-description mb-0 mt-1">{counter((ws.welcome || "").length, LIMITS.welcome)}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-5 mb-3">
              <label className="labels">Learning model name</label>
              <input type="text" className="form-control" placeholder="e.g. Message to vision" value={ws.model_name || ""}
                onChange={(e) => setWS({ model_name: e.target.value })} />
            </div>
            <div className="form-group col-md-7 mb-3">
              <label className="labels">Model layout</label>
              <select className="form-control" value={ws.model_type || "wheel"} onChange={(e) => setWS({ model_type: e.target.value })}>
                {MODEL_TYPES.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </div>
          </div>
          <label className="labels">Learning model — 4 elements</label>
          <p className="objective-description mb-2">A one-word label plus a short line for each. The activity name sits in the centre.</p>
          {(ws.elements || []).slice(0, 4).map((el, i) => (
            <div className="row" key={`el-${i}`}>
              <div className="form-group col-md-4 mb-2">
                <input type="text" className="form-control" placeholder={`Element ${i + 1} label, e.g. ${["Message", "Values", "Story", "Alignment"][i]}`}
                  value={el.label || ""} onChange={(e) => setElement(i, "label", e.target.value)} />
                <p className="objective-description mb-0 mt-1">{counter((el.label || "").length, LIMITS.label)}</p>
              </div>
              <div className="form-group col-md-8 mb-2">
                <input type="text" className="form-control" placeholder={["Pick the idea worth telling", "Bring company values to life", "Shape a memorable narrative", "Rally everyone behind one vision"][i]}
                  value={el.line || ""} onChange={(e) => setElement(i, "line", e.target.value)} />
                <p className="objective-description mb-0 mt-1">{counter((el.line || "").length, LIMITS.line)}</p>
              </div>
            </div>
          ))}
          <div className="form-group mt-3 mb-3">
            <label className="labels">Slide icon (shown above "Option" on the slides)</label>
            <p className="objective-description mb-2">Square icon with a transparent background. Generate one in the house style or upload your own. If empty, the activity logo is used.</p>
            <input type="text" className="form-control mb-2" placeholder="What the icon shows (optional) — e.g. a regal handmade throne with a small crown on the seat"
              value={ws.icon_concept || ""} onChange={(e) => setWS({ icon_concept: e.target.value })} />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {ws.icon ? <img src={ws.icon} alt="slide icon" style={{ width: 64, height: 64, objectFit: "contain", background: "#F6F3FF", borderRadius: 8 }} /> : null}
              <button type="button" className="btn btn-outline-primary" disabled={generatingIcon} onClick={onGenerateIcon}>
                {generatingIcon ? (<><span className="spinner-border spinner-border-sm mr-2" /> Generating…</>) : "Generate icon"}
              </button>
              <input type="file" accept="image/png" onChange={(e) => onIconUpload(e.target.files?.[0])} />
              {ws.icon ? <button type="button" className="btn btn-link p-0" onClick={() => setWS({ icon: "" })}>Remove</button> : null}
            </div>
          </div>
          <div className="form-group mt-3 mb-2">
            <label className="labels">Welcome illustration</label>
            <p className="objective-description mb-2">Portrait image (about 1024 x 1536). Upload your own or generate one with AI. If left empty, the first activity photo is used.</p>
            <textarea className="form-control mb-2" rows="2" placeholder="Illustration idea (optional) — e.g. colleagues building a cardboard throne while two colleagues in paper crowns test-sit it"
              value={ws.scene || ""} onChange={(e) => setWS({ scene: e.target.value })} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <button type="button" className="btn btn-outline-primary" disabled={generatingImg} onClick={onGenerateImage}>
                {generatingImg ? (<><span className="spinner-border spinner-border-sm mr-2" /> Generating… (about a minute)</>) : "Generate illustration"}
              </button>
              <span className="objective-description">Same style as the existing illustrations: global diverse team, Thought Bulb colours, no text. About $0.20 per image.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {ws.image ? <img src={ws.image} alt="welcome illustration" style={{ width: 80, height: 120, objectFit: "cover", borderRadius: 8 }} /> : null}
              <input type="file" accept="image/*" onChange={(e) => onWelcomeImage(e.target.files?.[0])} />
              {ws.image ? <button type="button" className="btn btn-link p-0" onClick={() => setWS({ image: "" })}>Remove</button> : null}
            </div>
          </div>
        </div>
        <div className="continue">
          <button
            class="btn btn-primary continue-button"
            onClick={() => {
              if (validateObjective()) {
                handleContinue();
              }
            }}
          >
            Continue
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
export default Objectives;
