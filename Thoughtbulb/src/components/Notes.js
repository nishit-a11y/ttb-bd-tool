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
import { FaRegStickyNote } from "react-icons/fa";
import "./Notes.css";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import fire from "./Firebase";
import { baseUrl } from "../pages/collection_config";

export default function Notes({ gamesList = [], onGamesListUpdate }) {
  const db = getFirestore(fire);
  const [notesState, setNotesState] = useState({});
  const [editorGameId, setEditorGameId] = useState(null);
  const [editorText, setEditorText] = useState("");
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (gamesList.length > 0) {
      setNotesState((prev) => {
        const initial = {};
        gamesList.forEach((game) => {
          if (prev[game.id]) {
            initial[game.id] = prev[game.id];
          } else {
            const hasNote = game.note && game.note.trim() !== "";
            initial[game.id] = {
              status: hasNote ? "on" : "off",
              note: game.note || "",
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
    }));
    onGamesListUpdate?.(result);
  };

  const openEditor = (gameId) => {
    setEditorGameId(gameId);
    setEditorText(notesState[gameId]?.note || "");
  };

  const handleSwitchChange = (gameId, checked) => {
    const existing = notesState[gameId];
  
    if (checked) {
      openEditor(gameId);
    } else {
      if (existing?.note && existing.note.trim() !== "") {
        const confirmClear = window.confirm(
          "You have already entered a note. Turning off will clear it. Do you want to proceed?"
        );
        if (!confirmClear) return; // User cancelled, do nothing
      }
  
      const newState = {
        ...notesState,
        [gameId]: { status: "off", note: "" },
      };
      setNotesState(newState);
      triggerNotesChange(newState);
    }
  };
  
  const saveNote = () => {
    const trimmed = editorText.trim();
    const newState = {
      ...notesState,
      [editorGameId]: {
        status: trimmed === "" ? "off" : "on",
        note: trimmed,
      },
    };
    setNotesState(newState);
    triggerNotesChange(newState);
    setEditorGameId(null);
    setEditorText("");
  };



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
  



  const buildPrompt1 = (game) => {
    return `You are an expert in corporate team-building and employee engagement.

Based on the client context and activity details below, write a short customization note explaining how this activity is relevant for this client.

Client Context: ${aiDescription}

Activity: ${game.name}
Objective: ${game.game_objective}
Key Details: ${game.key_title1}: ${game.key_description1}, ${game.key_title2}: ${game.key_description2}, ${game.key_title3}: ${game.key_description3}

Output:
- Do not include any salutation, greeting, or sign-off like "Dear Client" or Dear <client name>
- One short paragraph (2-3 sentences) explaining why this activity suits this client
- 3-4 <li> items highlighting specific relevance to their context. In each bullet point, add the operational details of the activity and link it to the work of the participants. Also include specific examples from the role/industry/company and link it to the activity debrief.
- A conclusion one liner in the end for the activity

You make the content visualy appealing use the default html icons and organize the content with bold,italized styling.

Return clean HTML using only <p>, <ul>, <li>, and <strong> tags. No markdown, no headings, no tables.`;
  };

  const generateNote = async () => {
    let game = gamesList.find((g) => g.id === editorGameId);

    // if game details are missing, fetch from Firestore
    if (!game.game_objective) {
      const docSnap = await getDoc(doc(db, "games", game.id));
      if (docSnap.exists()) {
        game = { ...game, ...docSnap.data() };
      }
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

  const cancelNote = () => {
    const existing = notesState[editorGameId];
    const newState = {
      ...notesState,
      [editorGameId]: {
        status:
          existing && existing.note && existing.note.trim() !== ""
            ? "on"
            : "off",
        note: existing?.note || "",
      },
    };
    setNotesState(newState);
    triggerNotesChange(newState);
    setEditorGameId(null);
    setEditorText("");
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="notes table" className="table mt-4">
          <TableHead>
            <TableRow>
              <TableCell className="text-nowrap tab-width">Selected Activities</TableCell>
              <TableCell className="text-nowrap tab-width1">Enable Custom Notes</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gamesList.map((game) => {
              const state = notesState[game.id] || { status: "off", note: "" };
              return (
                <TableRow key={game.id}>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={state.status === "on"}
                        onChange={(e) =>
                          handleSwitchChange(game.id, e.target.checked)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </TableCell>
                  <TableCell>
                    {state.status === "on" && state.note && (
                      <span
                        className="note-icon"
                        onClick={() => openEditor(game.id)}
                        title="Click to edit note"
                      >
                        <FaRegStickyNote />
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {editorGameId !== null && (
        <div className="popup-overlay">
          <div className="editor-popup">
            <h4>
              Edit Note for{" "}
              {gamesList.find((g) => g.id === editorGameId)?.name}
            </h4>
            <ReactQuill value={editorText} onChange={setEditorText}   style={{ height: '300px', marginBottom: '50px' }} 
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
          </div>
        </div>
      )}

      {showAiPopup && (
        <div className="popup-overlay ai-overlay">
          <div className="editor-popup ai-popup">
            <h4>Generate Note with AI</h4>
            <div className="ai-field">
              <label>Description / Program of Client</label>
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder={`A single paragraph that includes:
                  * Company background
                  * Industry
                  * Participant profile
                  * Context of the program
                  * Theme (if any)
                  * Expectations from the program`}
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
                ) : "Generate"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowAiPopup(false)}
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
