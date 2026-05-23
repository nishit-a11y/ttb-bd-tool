import React, { useState, useContext, useEffect } from "react";
import "./Create-activity.css";
import "./Settings.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import inperson_img from "../assets/images/inperson.svg";
import virtual_img from "../assets/images/virtual.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import {
  faUser,
  faFile,
  faGear,
  faChartLine,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Activity_logo } from "../assets/images/activities.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../components/Sidebar";
import Dialog from "@mui/material/Dialog";
import { CollectionName, collectionPicker } from "./collection_config";
import { deleteField } from "firebase/firestore";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  Timestamp,
  addDoc,
  doc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import {fire} from "../components/Firebase";
import AppContext from "../components/AppContext";
import moment from "moment";

function Settings() {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const db = getFirestore(fire);
  const storage = getStorage(fire);
  const myContext = useContext(AppContext);
  const [expanded, setExpanded] = useState(1);
  const [fac_fee, setFac_fee] = useState(0);
  const [warn_people_per_team, setWarn_people_per_team] = useState(false);
  const [accordion1, setAccordion1] = useState(false);
  const [change_fac_fee, setChange_fac_fee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [people_per_team, setPeople_per_team] = useState(0);
  const [day1_slab1, setDay1_slab1] = useState(0);
  const [day1_slab2, setDay1_slab2] = useState(0);
  const [day1_slab3, setDay1_slab3] = useState(0);
  const [day1_slab4, setDay1_slab4] = useState(0);
  const [day1_slab5, setDay1_slab5] = useState(0);
  const [day2_slab1, setDay2_slab1] = useState(0);
  const [day2_slab2, setDay2_slab2] = useState(0);
  const [day2_slab3, setDay2_slab3] = useState(0);
  const [day2_slab4, setDay2_slab4] = useState(0);
  const [day2_slab5, setDay2_slab5] = useState(0);
  const [team_slab1, setTeam_slab1] = useState(0);
  const [team_slab2, setTeam_slab2] = useState(0);
  const [team_slab3, setTeam_slab3] = useState(0);
  const [team_slab4, setTeam_slab4] = useState(0);
  const [team_slab5, setTeam_slab5] = useState(0);
  const [oneway_slab1, setoneway_slab1] = useState(0);
  const [oneway_slab2, setoneway_slab2] = useState(0);
  const [oneway_slab3, setoneway_slab3] = useState(0);
  const [oneway_slab4, setoneway_slab4] = useState(0);
  const [oneway_slab5, setoneway_slab5] = useState(0);
  const [weblink_slab1, setWeblink_slab1] = useState(0);
  const [weblink_slab2, setWeblink_slab2] = useState(0);
  const [weblink_slab3, setWeblink_slab3] = useState(0);
  const [weblink_slab4, setWeblink_slab4] = useState(0);
  const [weblink_slab5, setWeblink_slab5] = useState(0);

  const [change_day1_slab1, setChange_Day1_slab1] = useState(false);
  const [change_day1_slab2, setChange_Day1_slab2] = useState(false);
  const [change_day1_slab3, setChange_Day1_slab3] = useState(false);
  const [change_day1_slab4, setChange_Day1_slab4] = useState(false);
  const [change_day1_slab5, setChange_Day1_slab5] = useState(false);
  const [change_day2_slab1, setChange_Day2_slab1] = useState(false);
  const [change_day2_slab2, setChange_Day2_slab2] = useState(false);
  const [change_day2_slab3, setChange_Day2_slab3] = useState(false);
  const [change_day2_slab4, setChange_Day2_slab4] = useState(false);
  const [change_day2_slab5, setChange_Day2_slab5] = useState(false);
  const [change_team_slab1, setChange_Team_slab1] = useState(false);
  const [change_team_slab2, setChange_Team_slab2] = useState(false);
  const [change_team_slab3, setChange_Team_slab3] = useState(false);
  const [change_team_slab4, setChange_Team_slab4] = useState(false);
  const [change_team_slab5, setChange_Team_slab5] = useState(false);
  const [change_oneway_slab1, setChange_oneway_slab1] = useState(false);
  const [change_oneway_slab2, setChange_oneway_slab2] = useState(false);
  const [change_oneway_slab3, setChange_oneway_slab3] = useState(false);
  const [change_oneway_slab4, setChange_oneway_slab4] = useState(false);
  const [change_oneway_slab5, setChange_oneway_slab5] = useState(false);
  const [change_weblink_slab1, setChange_Weblink_slab1] = useState(false);
  const [change_weblink_slab2, setChange_Weblink_slab2] = useState(false);
  const [change_weblink_slab3, setChange_Weblink_slab3] = useState(false);
  const [change_weblink_slab4, setChange_Weblink_slab4] = useState(false);
  const [change_weblink_slab5, setChange_Weblink_slab5] = useState(false);

  const [warn_change, setWarn_change] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "fees"));
    onSnapshot(q, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      myContext.setPeople_per_team(data[0].data.person_per_team);
      myContext.setDay1_slab1(data[0].data.inperson.day1.slab1);
      myContext.setDay1_slab2(data[0].data.inperson.day1.slab2);
      myContext.setDay1_slab3(data[0].data.inperson.day1.slab3);
      myContext.setDay1_slab4(data[0].data.inperson.day1.slab4);
      myContext.setDay1_slab5(data[0].data.inperson.day1.slab5);
      myContext.setDay2_slab1(data[0].data.inperson.day2.slab1);
      myContext.setDay2_slab2(data[0].data.inperson.day2.slab2);
      myContext.setDay2_slab3(data[0].data.inperson.day2.slab3);
      myContext.setDay2_slab4(data[0].data.inperson.day2.slab4);
      myContext.setDay2_slab5(data[0].data.inperson.day2.slab5);
      myContext.setTeam_slab1(data[0].data.virtual.teambased.slab1);
      myContext.setTeam_slab2(data[0].data.virtual.teambased.slab2);
      myContext.setTeam_slab3(data[0].data.virtual.teambased.slab3);
      myContext.setTeam_slab4(data[0].data.virtual.teambased.slab4);
      myContext.setTeam_slab5(data[0].data.virtual.teambased.slab5);
      myContext.setoneway_slab1(data[0].data.virtual.oneway.slab1);
      myContext.setoneway_slab2(data[0].data.virtual.oneway.slab2);
      myContext.setoneway_slab3(data[0].data.virtual.oneway.slab3);
      myContext.setoneway_slab4(data[0].data.virtual.oneway.slab4);
      myContext.setoneway_slab5(data[0].data.virtual.oneway.slab5);
      myContext.setWeblink_slab1(data[0].data.virtual.weblink.slab1);
      myContext.setWeblink_slab2(data[0].data.virtual.weblink.slab2);
      myContext.setWeblink_slab3(data[0].data.virtual.weblink.slab3);
      myContext.setWeblink_slab4(data[0].data.virtual.weblink.slab4);
      myContext.setWeblink_slab5(data[0].data.virtual.weblink.slab5);

      setPeople_per_team(data[0].data.person_per_team);
      setDay1_slab1(data[0].data.inperson.day1.slab1);
      setDay1_slab2(data[0].data.inperson.day1.slab2);
      setDay1_slab3(data[0].data.inperson.day1.slab3);
      setDay1_slab4(data[0].data.inperson.day1.slab4);
      setDay1_slab5(data[0].data.inperson.day1.slab5);
      setDay2_slab1(data[0].data.inperson.day2.slab1);
      setDay2_slab2(data[0].data.inperson.day2.slab2);
      setDay2_slab3(data[0].data.inperson.day2.slab3);
      setDay2_slab4(data[0].data.inperson.day2.slab4);
      setDay2_slab5(data[0].data.inperson.day2.slab5);
      setTeam_slab1(data[0].data.virtual.teambased.slab1);
      setTeam_slab2(data[0].data.virtual.teambased.slab2);
      setTeam_slab3(data[0].data.virtual.teambased.slab3);
      setTeam_slab4(data[0].data.virtual.teambased.slab4);
      setTeam_slab5(data[0].data.virtual.teambased.slab5);
      setoneway_slab1(data[0].data.virtual.oneway.slab1);
      setoneway_slab2(data[0].data.virtual.oneway.slab2);
      setoneway_slab3(data[0].data.virtual.oneway.slab3);
      setoneway_slab4(data[0].data.virtual.oneway.slab4);
      setoneway_slab5(data[0].data.virtual.oneway.slab5);
      setWeblink_slab1(data[0].data.virtual.weblink.slab1);
      setWeblink_slab2(data[0].data.virtual.weblink.slab2);
      setWeblink_slab3(data[0].data.virtual.weblink.slab3);
      setWeblink_slab4(data[0].data.virtual.weblink.slab4);
      setWeblink_slab5(data[0].data.virtual.weblink.slab5);
    });
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function update_changes() {
    if (myContext.people_per_team == 0) {
      setWarn_people_per_team(true);
    } else {
      const final_data = {
        person_per_team: myContext.people_per_team,
        inperson: {
          day1: {
            slab1: myContext.day1_slab1,
            slab2: myContext.day1_slab2,
            slab3: myContext.day1_slab3,
            slab4: myContext.day1_slab4,
            slab5: myContext.day1_slab5,
          },
          day2: {
            slab1: myContext.day2_slab1,
            slab2: myContext.day2_slab2,
            slab3: myContext.day2_slab3,
            slab4: myContext.day2_slab4,
            slab5: myContext.day2_slab5,
          },
        },
        virtual: {
          teambased: {
            slab1: myContext.team_slab1,
            slab2: myContext.team_slab2,
            slab3: myContext.team_slab3,
            slab4: myContext.team_slab4,
            slab5: myContext.team_slab5,
          },
          oneway: {
            slab1: myContext.oneway_slab1,
            slab2: myContext.oneway_slab2,
            slab3: myContext.oneway_slab3,
            slab4: myContext.oneway_slab4,
            slab5: myContext.oneway_slab5,
          },
          weblink: {
            slab1: myContext.weblink_slab1,
            slab2: myContext.weblink_slab2,
            slab3: myContext.weblink_slab3,
            slab4: myContext.weblink_slab4,
            slab5: myContext.weblink_slab5,
          },
        },
      };

      try {
        updateDoc(doc(db, "fees", "mKT7NpEMAuSktbYMjG7q"), final_data).then(
          (doc) => {
            setWarn_change(true);
          }
        );
      } catch (err) {
        alert(err);
      }
    }
  }

  const sidebar_menu_items = [
    {
      label: "Users",
      icon: <FontAwesomeIcon icon={faUser} />,
      navigateOnClick: "/users",
    },
    {
      label: "Proposals",
      icon: <FontAwesomeIcon icon={faFile} />,
      navigateOnClick: "/admin-dashboard",
    },
    {
      label: "Activities",
      icon: <FontAwesomeIcon icon={faPeopleGroup} />,
      navigateOnClick: "/activities",
    },
    {
      label: "Settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      navigateOnClick: "/fee-settings",
      isActive: true,
    },
  ];

  function warn_change_close() {
    setWarn_change(false);
  }

  return (
    <div>
      <Dialog className="pop" open={warn_change} onClose={warn_change_close}>
        <h5 className="popup-alert">Changes Made Successfully</h5>
        <button
          class="btn btn-primary drawer-submit"
          onClick={warn_change_close}
        >
          Ok
        </button>
      </Dialog>
      <Stack
        direction={"column"}
        className="container-fluid sec-wrap height-100 admin-dashboard"
      >
        <Stack>
          <Header />
        </Stack>
        <Stack direction={"row"}>
          <Stack sx={{ width: "13%" }}>
            <Sidebar sideBarMenuItems={sidebar_menu_items} />
          </Stack>
          <Stack sx={{ width: "87%" }} className="content-section float-right">
            <div className="container-fluid proposal-wrap mt-5 mb-5 content-section">
              <Accordion
                disabled={accordion1}
                expanded={expanded === 1}
                onChange={handleChange(1)}
              >
                <AccordionDetails>
                  <div class="form-group">
                    <h6 className="objective-title mt-4">
                      No. of Participants Per Team
                    </h6>
                    <input
                      type="number"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.people_per_team}
                      onChange={(e) => {
                        myContext.setPeople_per_team(e.target.value);
                        setWarn_people_per_team(false);
                      }}
                    ></input>
                    <p className="objective-description">
                      This is used for calculation of the Material Cost of each
                      Activity
                    </p>
                    {warn_people_per_team ? (
                      <p className="warning">
                        * People Per Team cannot be zero
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  <h6 className="objective-title mt-4">
                    Facilitation Fee for In-Person Events
                  </h6>
                  {/* <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)} className='mt-4'>
                                        <TabList className='tablist'>
                                            <Tab className='days'>
                                                <p className='labels types-tab days-para'>In Person</p>
                                            </Tab>
                                            <Tab className='days'>
                                                <p className='labels types-tab days-para'>Virtual</p>
                                            </Tab>
                                        </TabList>
                                    </Tabs>

                                    {tabIndex === 0 ? */}
                  <TableContainer component={Paper}>
                    <Table
                      size="larger"
                      aria-label="a dense table"
                      className="table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-nowrap tab-width">
                            FACILITATION FEE (DAY ONE)
                          </TableCell>
                          <TableCell className="text-nowrap tab-width1">
                            FEE
                          </TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell>1 - 50 Pax</TableCell>
                          <TableCell>
                            {!change_day1_slab1 ? (
                              myContext.day1_slab1 === "" ? (
                                "0"
                              ) : (
                                myContext.day1_slab1
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day1_slab1}
                                onChange={(e) => {
                                  setDay1_slab1(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day1_slab1 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay1_slab1(
                                    myContext.day1_slab1 === ""
                                      ? "0"
                                      : myContext.day1_slab1
                                  );

                                  setChange_Day1_slab1(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay1_slab1(day1_slab1);
                                    setChange_Day1_slab1(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day1_slab1(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>51 - 100 Pax</TableCell>
                          <TableCell>
                            {!change_day1_slab2 ? (
                              myContext.day1_slab2 === "" ? (
                                "0"
                              ) : (
                                myContext.day1_slab2
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day1_slab2}
                                onChange={(e) => {
                                  setDay1_slab2(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day1_slab2 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay1_slab2(
                                    myContext.day1_slab2 === ""
                                      ? "0"
                                      : myContext.day1_slab2
                                  );

                                  setChange_Day1_slab2(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay1_slab2(day1_slab2);
                                    setChange_Day1_slab2(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day1_slab2(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>101 - 200 Pax</TableCell>
                          <TableCell>
                            {!change_day1_slab3 ? (
                              myContext.day1_slab3 === "" ? (
                                "0"
                              ) : (
                                myContext.day1_slab3
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day1_slab3}
                                onChange={(e) => {
                                  setDay1_slab3(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day1_slab3 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay1_slab3(
                                    myContext.day1_slab3 === ""
                                      ? "0"
                                      : myContext.day1_slab3
                                  );

                                  setChange_Day1_slab3(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay1_slab3(day1_slab3);
                                    setChange_Day1_slab3(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day1_slab3(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>201 - 350 Pax</TableCell>
                          <TableCell>
                            {!change_day1_slab4 ? (
                              myContext.day1_slab4 === "" ? (
                                "0"
                              ) : (
                                myContext.day1_slab4
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day1_slab4}
                                onChange={(e) => {
                                  setDay1_slab4(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day1_slab4 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay1_slab4(
                                    myContext.day1_slab4 === ""
                                      ? "0"
                                      : myContext.day1_slab4
                                  );

                                  setChange_Day1_slab4(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay1_slab4(day1_slab4);
                                    setChange_Day1_slab4(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day1_slab4(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>351 - 500 Pax</TableCell>
                          <TableCell>
                            {!change_day1_slab5 ? (
                              myContext.day1_slab5 === "" ? (
                                "0"
                              ) : (
                                myContext.day1_slab5
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day1_slab5}
                                onChange={(e) => {
                                  setDay1_slab5(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day1_slab5 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay1_slab5(
                                    myContext.day1_slab5 === ""
                                      ? "0"
                                      : myContext.day1_slab5
                                  );

                                  setChange_Day1_slab5(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay1_slab5(day1_slab5);
                                    setChange_Day1_slab5(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day1_slab5(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Table
                      size="larger"
                      aria-label="a dense table"
                      className="table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-nowrap tab-width">
                            FACILITATION FEE (DAY TWO)
                          </TableCell>
                          <TableCell className="text-nowrap tab-width1">
                            FEE
                          </TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell>1 - 50 Pax</TableCell>
                          <TableCell>
                            {!change_day2_slab1 ? (
                              myContext.day2_slab1 === "" ? (
                                "0"
                              ) : (
                                myContext.day2_slab1
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day2_slab1}
                                onChange={(e) => {
                                  setDay2_slab1(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day2_slab1 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay2_slab1(
                                    myContext.day2_slab1 === ""
                                      ? "0"
                                      : myContext.day2_slab1
                                  );

                                  setChange_Day2_slab1(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay2_slab1(day2_slab1);
                                    setChange_Day2_slab1(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day2_slab1(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>51 - 100 Pax</TableCell>
                          <TableCell>
                            {!change_day2_slab2 ? (
                              myContext.day2_slab2 === "" ? (
                                "0"
                              ) : (
                                myContext.day2_slab2
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day2_slab2}
                                onChange={(e) => {
                                  setDay2_slab2(e.target.value);
                                }}
                              ></input>
                            )}{" "}
                          </TableCell>
                          <TableCell>
                            {!change_day2_slab2 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay2_slab2(
                                    myContext.day2_slab2 === ""
                                      ? "0"
                                      : myContext.day2_slab2
                                  );

                                  setChange_Day2_slab2(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay2_slab2(day2_slab2);
                                    setChange_Day2_slab2(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day2_slab2(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>101 - 200 Pax</TableCell>
                          <TableCell>
                            {!change_day2_slab3 ? (
                              myContext.day2_slab3 === "" ? (
                                "0"
                              ) : (
                                myContext.day2_slab3
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day2_slab3}
                                onChange={(e) => {
                                  setDay2_slab3(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day2_slab3 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay2_slab3(
                                    myContext.day2_slab3 === ""
                                      ? "0"
                                      : myContext.day2_slab3
                                  );

                                  setChange_Day2_slab3(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay2_slab3(day2_slab3);
                                    setChange_Day2_slab3(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day2_slab3(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>201 - 350 Pax</TableCell>
                          <TableCell>
                            {!change_day2_slab4 ? (
                              myContext.day2_slab4 === "" ? (
                                "0"
                              ) : (
                                myContext.day2_slab4
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day2_slab4}
                                onChange={(e) => {
                                  setDay2_slab4(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day2_slab4 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay2_slab4(
                                    myContext.day2_slab4 === ""
                                      ? "0"
                                      : myContext.day2_slab4
                                  );

                                  setChange_Day2_slab4(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay2_slab4(day2_slab4);
                                    setChange_Day2_slab4(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day2_slab4(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>351 - 500 Pax</TableCell>
                          <TableCell>
                            {!change_day2_slab5 ? (
                              myContext.day2_slab5 === "" ? (
                                "0"
                              ) : (
                                myContext.day2_slab5
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={day2_slab5}
                                onChange={(e) => {
                                  setDay2_slab5(e.target.value);
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_day2_slab5 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setDay2_slab5(
                                    myContext.day2_slab5 === ""
                                      ? "0"
                                      : myContext.day2_slab5
                                  );

                                  setChange_Day2_slab5(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setDay2_slab5(day2_slab5);
                                    setChange_Day2_slab5(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_Day2_slab5(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* : ""} */}

                  {/* {tabIndex === 1 ?
                                        <TableContainer component={Paper}>
                                            <Table size='larger' aria-label="a dense table" className="table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-nowrap tab-width">TEAM BASED PROGRAMS</TableCell>
                                                        <TableCell className="text-nowrap tab-width1">FEE</TableCell>
                                                        <TableCell>&nbsp;</TableCell>

                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <TableRow>

                                                        <TableCell>1 - 50 Pax</TableCell>
                                                        <TableCell>{!change_team_slab1 ? myContext.team_slab1 : <input type="number" class="form-control" id="formGroupExampleInput" value={team_slab1} onChange={(e) => setTeam_slab1(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_team_slab1 ? <img className='edit-table-icons' onClick={(e) => setChange_Team_slab1(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setTeam_slab1(day1_slab1); setChange_Team_slab1(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Team_slab1(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>51 - 100 Pax</TableCell>
                                                        <TableCell>{!change_team_slab2 ? myContext.team_slab2 : <input type="number" class="form-control" id="formGroupExampleInput" value={team_slab2} onChange={(e) => setTeam_slab2(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_team_slab2 ? <img className='edit-table-icons' onClick={(e) => setChange_Team_slab2(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setTeam_slab2(day1_slab2); setChange_Team_slab2(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Team_slab2(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>101 - 200 Pax</TableCell>
                                                        <TableCell>{!change_team_slab3 ? myContext.team_slab3 : <input type="number" class="form-control" id="formGroupExampleInput" value={team_slab3} onChange={(e) => setTeam_slab3(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_team_slab3 ? <img className='edit-table-icons' onClick={(e) => setChange_Team_slab3(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setTeam_slab3(day1_slab1); setChange_Team_slab3(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Team_slab3(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>201 - 350 Pax</TableCell>
                                                        <TableCell>{!change_team_slab4 ? myContext.team_slab4 : <input type="number" class="form-control" id="formGroupExampleInput" value={team_slab4} onChange={(e) => setTeam_slab4(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_team_slab4 ? <img className='edit-table-icons' onClick={(e) => setChange_Team_slab4(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setTeam_slab4(day1_slab4); setChange_Team_slab4(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Team_slab4(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>351 - 500 Pax</TableCell>
                                                        <TableCell>{!change_team_slab5 ? myContext.team_slab5 : <input type="number" class="form-control" id="formGroupExampleInput" value={team_slab5} onChange={(e) => setTeam_slab5(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_team_slab5 ? <img className='edit-table-icons' onClick={(e) => setChange_Team_slab5(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setTeam_slab5(day1_slab1); setChange_Team_slab5(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Team_slab5(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>

                                                </TableBody>
                                            </Table>

                                            <Table size='larger' aria-label="a dense table" className="table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-nowrap tab-width">ONE-WAY FLOW PROGRAMS</TableCell>
                                                        <TableCell className="text-nowrap tab-width1">FEE</TableCell>
                                                        <TableCell>&nbsp;</TableCell>

                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <TableRow>

                                                        <TableCell>1 - 50 Pax</TableCell>
                                                        <TableCell>{!change_oneway_slab1 ? myContext.oneway_slab1 : <input type="number" class="form-control" id="formGroupExampleInput" value={oneway_slab1} onChange={(e) => setoneway_slab1(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_oneway_slab1 ? <img className='edit-table-icons' onClick={(e) => setChange_oneway_slab1(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setoneway_slab1(oneway_slab1); setChange_oneway_slab1(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_oneway_slab1(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>51 - 100 Pax</TableCell>
                                                        <TableCell>{!change_oneway_slab2 ? myContext.oneway_slab2 : <input type="number" class="form-control" id="formGroupExampleInput" value={oneway_slab2} onChange={(e) => setoneway_slab2(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_oneway_slab2 ? <img className='edit-table-icons' onClick={(e) => setChange_oneway_slab2(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setoneway_slab2(oneway_slab2); setChange_oneway_slab2(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_oneway_slab2(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>101 - 200 Pax</TableCell>
                                                        <TableCell>{!change_oneway_slab3 ? myContext.oneway_slab3 : <input type="number" class="form-control" id="formGroupExampleInput" value={oneway_slab3} onChange={(e) => setoneway_slab3(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_oneway_slab3 ? <img className='edit-table-icons' onClick={(e) => setChange_oneway_slab3(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setoneway_slab3(oneway_slab3); setChange_oneway_slab1(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_oneway_slab1(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>201 - 350 Pax</TableCell>
                                                        <TableCell>{!change_oneway_slab4 ? myContext.oneway_slab4 : <input type="number" class="form-control" id="formGroupExampleInput" value={oneway_slab4} onChange={(e) => setoneway_slab4(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_oneway_slab4 ? <img className='edit-table-icons' onClick={(e) => setChange_oneway_slab4(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setoneway_slab4(oneway_slab4); setChange_oneway_slab4(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_oneway_slab4(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>351 - 500 Pax</TableCell>
                                                        <TableCell>{!change_oneway_slab5 ? myContext.oneway_slab5 : <input type="number" class="form-control" id="formGroupExampleInput" value={oneway_slab5} onChange={(e) => setoneway_slab5(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_oneway_slab5 ? <img className='edit-table-icons' onClick={(e) => setChange_oneway_slab5(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setoneway_slab5(oneway_slab5); setChange_oneway_slab5(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_oneway_slab5(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>

                                                </TableBody>
                                            </Table>

                                            <Table size='larger' aria-label="a dense table" className="table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="text-nowrap tab-width">WEB-LINK BASED PROGRAMS</TableCell>
                                                        <TableCell className="text-nowrap tab-width1">FEE</TableCell>
                                                        <TableCell>&nbsp;</TableCell>

                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    <TableRow>

                                                        <TableCell>1 - 50 Pax</TableCell>
                                                        <TableCell>{!change_weblink_slab1 ? myContext.weblink_slab1 : <input type="number" class="form-control" id="formGroupExampleInput" value={weblink_slab1} onChange={(e) => setWeblink_slab1(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_weblink_slab1 ? <img className='edit-table-icons' onClick={(e) => setChange_Weblink_slab1(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setWeblink_slab1(weblink_slab1); setChange_Weblink_slab1(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Weblink_slab1(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>51 - 100 Pax</TableCell>
                                                        <TableCell>{!change_weblink_slab2 ? myContext.weblink_slab2 : <input type="number" class="form-control" id="formGroupExampleInput" value={weblink_slab2} onChange={(e) => setWeblink_slab2(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_weblink_slab2 ? <img className='edit-table-icons' onClick={(e) => setChange_Weblink_slab2(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setWeblink_slab2(weblink_slab2); setChange_Weblink_slab2(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Weblink_slab2(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>101 - 200 Pax</TableCell>
                                                        <TableCell>{!change_weblink_slab3 ? myContext.weblink_slab3 : <input type="number" class="form-control" id="formGroupExampleInput" value={weblink_slab3} onChange={(e) => setWeblink_slab3(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_weblink_slab3 ? <img className='edit-table-icons' onClick={(e) => setChange_Weblink_slab3(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setWeblink_slab3(weblink_slab3); setChange_Weblink_slab3(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Weblink_slab3(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>201 - 350 Pax</TableCell>
                                                        <TableCell>{!change_weblink_slab4 ? myContext.weblink_slab4 : <input type="number" class="form-control" id="formGroupExampleInput" value={weblink_slab4} onChange={(e) => setWeblink_slab4(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_weblink_slab4 ? <img className='edit-table-icons' onClick={(e) => setChange_Weblink_slab4(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setWeblink_slab4(weblink_slab4); setChange_Weblink_slab4(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Weblink_slab4(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>
                                                    <TableRow>

                                                        <TableCell>351 - 500 Pax</TableCell>
                                                        <TableCell>{!change_weblink_slab5 ? myContext.weblink_slab5 : <input type="number" class="form-control" id="formGroupExampleInput" value={weblink_slab5} onChange={(e) => setWeblink_slab5(e.target.value)}></input>}</TableCell>
                                                        <TableCell>{!change_weblink_slab5 ? <img className='edit-table-icons' onClick={(e) => setChange_Weblink_slab5(true)} src={require('../assets/images/edit.png')} width={20} height={20}></img> : <div className='edit-table'><img onClick={(e) => { myContext.setWeblink_slab5(weblink_slab5); setChange_Weblink_slab5(false) }} className='edit-table-icons' src={require('../assets/images/table-tick.png')} width={15} height={15}></img><img onClick={(e) => setChange_Weblink_slab5(false)} className='edit-table-icons' src={require('../assets/images/table-cancel.png')} width={15} height={15}></img></div>}</TableCell>

                                                    </TableRow>

                                                </TableBody>
                                            </Table>

                                        </TableContainer> : ""} */}

                  <div className="continue">
                    <button
                      onClick={update_changes}
                      class="btn btn-primary continue-button"
                    >
                      {loading ? (
                        <div class="spinner-border spinner-border-sm"></div>
                      ) : (
                        "Update Changes"
                      )}
                    </button>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default Settings;
