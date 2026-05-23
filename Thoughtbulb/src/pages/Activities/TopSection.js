import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./Activities.css";

function TopSection({ activityData }) {
  const [createdActivities, setCreatedActivities] = useState(0);
  const [virtualActivities, setVirtualActivities] = useState(0);
  const [indoorOutdoorActivities, setIndoorOutdoorActivities] = useState(0);
  const [outdoorActivities, setOutdoorActivities] = useState(0);

  //updates local activity states when activityData changes
  useEffect(() => {
    if (activityData) {
      setCreatedActivities(activityData.length);
      setVirtualActivities(
        activityData.filter((value) => {
          if (value.data.game_type === "Virtual") {
            return value;
          }
        }).length
      );

      setIndoorOutdoorActivities(
        activityData.filter((value) => {
          if (
            value.data.game_type === "Inperson" &&
            (value.data.category === "Group A" ||
              value.data.category === "Group B")
          ) {
            return value;
          }
        }).length
      );

      setOutdoorActivities(
        activityData.filter((value) => {
          if (
            value.data.game_type === "Inperson" &&
            value.data.category === "Outdoor"
          ) {
            return value;
          }
        }).length
      );
    }
  }, [activityData]);
  return (
    <div className="analytics">
      <img src={require("../../assets/images/insights.png")}></img>
      <h5 className="insights">&nbsp;&nbsp;Insights</h5>
      <div className="row analyt">
        <div className="col-md-2 columns">
          <h6 className="analyt-title">Activities Created</h6>

          <h3 className="analyt-value">{createdActivities}</h3>
        </div>
        <div className="col-md-2 columns">
          <h6 className="analyt-title">Virtual Activities</h6>
          <h3 className="analyt-value">{virtualActivities}</h3>
        </div>
        <div className="col-md-2 columns">
          <h6 className="analyt-title">Indoor/Outdoor Activities</h6>
          <h3 className="analyt-value">{indoorOutdoorActivities}</h3>
        </div>
        <div className="col-md-2 columns">
          <h6 className="analyt-title">Outdoor Activities</h6>
          <h3 className="analyt-value">{outdoorActivities}</h3>
        </div>
      </div>
    </div>
  );
}
export default TopSection;
