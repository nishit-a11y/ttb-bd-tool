import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import _ from "lodash";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  where,
} from "firebase/firestore";
import {fire} from "../../components/Firebase";
import "./Activities.css";
import Sidebar from "../../components/Sidebar";
import { Stack } from "@mui/material";
import { CollectionName } from "./../collection_config";
import { useNavigate } from "react-router-dom";

import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { sidebar_menu_items, sidebar_menu_items_bd } from "./constant";

function Activities() {
  const db = getFirestore(fire);
  const [activityData, setActivityData] = useState([]);
  let navigate = useNavigate();

  //gets data from games collection and updates the activityData state
  useEffect(() => {
    let q;
    q = query(
      collection(db, CollectionName.games),
      orderBy("created_date", "desc"),
      where("isDeleted", "==", false)
    );

    onSnapshot(q, (querySnapshot) => {
      setActivityData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div>
      <Stack
        direction={"column"}
        className="container-fluid sec-wrap height-100 admin-dashboard"
      >
        <Stack>
          <Header />
        </Stack>
        <Stack direction={"row"}>
          <Stack sx={{ width: "13%" }}>
            {localStorage.getItem("admin-auth") ? (
              <Sidebar sideBarMenuItems={sidebar_menu_items} />
            ) : (
              <Sidebar sideBarMenuItems={sidebar_menu_items_bd} />
            )}
          </Stack>
          <Stack sx={{ width: "87%" }} className="content-section float-right">
            {activityData.length === 0 ? (
              <div className="container-fluid  ">
                <div className="no-proposal ">
                  <h5 className="proposal-text">
                    Get started with creating activities.
                  </h5>
                  <img
                    src={require("../../assets/images/no-proposal.png")}
                  ></img>
                  <br />
                  <button
                    onClick={() => {
                      window.location.href = "/create-activity";
                    }}
                    type="button"
                    className="btn btn-primary btn-block proposal-button"
                  >
                    Create New Activity
                  </button>
                </div>
              </div>
            ) : (
              <div className="container-fluid content-section table-section">
                <TopSection activityData={activityData} />
                <BottomSection activityData={activityData} />
              </div>
            )}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default Activities;
