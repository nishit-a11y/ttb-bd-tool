import React, { useState } from "react";
import "./index.css";
import Header from "../../components/Header";
import "cropperjs/dist/cropper.css";
import "react-tabs/style/react-tabs.css";
import TopSection from "./TopSection";
import ActivityBrief from "./ActivityBrief";
import Objectives from "./Objectives.";

function Create_activity() {
  const [ActivityBriefExpanded, setActivityBriefExpanded] = useState(true);
  const [ActivityBriefCompleted, setActivityBriefCompleted] = useState(false);
  const [ActivityBriefDisabled, setActivityBriefDisabled] = useState(false);

  const [ObjectivesExpanded, setObjectivesExpanded] = useState(false);
  const [ObjectivesCompleted, setObjectivesCompleted] = useState(false);
  const [ObjectivesDisabled, setObjectivesDisabled] = useState(true);


  const Content = () => {
    return (
      <div className="container-fluid proposal-wrap">
        <ActivityBrief
          completed={ActivityBriefCompleted}
          expanded={ActivityBriefExpanded}
          disabled={ActivityBriefDisabled}
          setCompleted={setActivityBriefCompleted}
          setExpanded={setActivityBriefExpanded}
          setDisabled={setActivityBriefDisabled}
          handleContinue={(data) => {
            setActivityBriefExpanded(false);
            setObjectivesExpanded(true);
            setObjectivesDisabled(false);
            setActivityBriefCompleted(true);
          }}
        />
        <Objectives
          completed={ObjectivesCompleted}
          expanded={ObjectivesExpanded}
          disabled={ObjectivesDisabled}
          setCompleted={setObjectivesCompleted}
          setExpanded={setObjectivesExpanded}
          setDisabled={setObjectivesDisabled}
          handleContinue={() => {}}
        />

      </div>
    );
  };
  return (
    <>
      <div className="container-fluid  sec-wrap z-2" style={{ zIndex: 2 }}>
        <Header />
        <TopSection />
        <Content />
      </div>
    </>
  );
}
export default Create_activity;
