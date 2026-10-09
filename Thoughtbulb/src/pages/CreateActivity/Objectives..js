import React, { useState, useEffect } from "react";
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
} from "./CreateActivitySlice";

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
  const { objectiveData, objectivePoints, outcomes } = useSelector(
    (state) => state.createActivity
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
