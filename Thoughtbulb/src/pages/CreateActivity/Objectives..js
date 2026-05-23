import React, { useState, useEffect } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import "cropperjs/dist/cropper.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "react-tabs/style/react-tabs.css";
import { setObjectiveData } from "./CreateActivitySlice";
const Objectives = ({
  completed,
  expanded,
  disabled,
  setComleted,
  setExpanded,
  setDisabled,
  handleContinue,
}) => {
  const { objectiveData } = useSelector((state) => state.createActivity);
  const dispatch = useDispatch();

  function validateObjective() {
    if (!objectiveData || objectiveData === "") {
      alert("Please enter the Objective of the activity ");
      return false;
    } else if (objectiveData.length > 380) {
      alert("Objective should be less than 380 characters");
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
