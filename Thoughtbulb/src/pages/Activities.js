import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  endBefore,
  endAt,
  limit,
  startAfter,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  where,
  orderBy,
  snapshotEqual,
  updateDoc,
  startAt,
  limitToLast,
  setIndexConfiguration,
} from "firebase/firestore";

import {fire} from "../../components/Firebase";
import "./Activities.css";
import { getDownloadURL } from "firebase/storage";
import moment from "moment";
import AppContext from "../components/AppContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Stack, Chip } from "@mui/material";
import { ReactComponent as Activity_logo } from "../assets/images/activities.svg";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import {
  faUser,
  faFile,
  faGear,
  faChartLine,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CollectionName } from "./collection_config";

function Activities() {
  const [data, setData] = useState([]);
  const myContext = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetched, setFetched] = useState(4);
  const db = getFirestore(fire);
  const [data2, setData2] = useState([]);
  const [loadingPageChange, setLoadingPageChange] = useState(false);
  const [amortizedSearch, setAmortizedSearch] = useState("");

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [lastRecord, setLastRecord] = useState("");
  const [firstRecord, setFirstRecord] = useState("");
  const [search_field, setSearch_field] = useState("");
  const [rowId, setRowId] = useState(null);
  const [sort_type, setSort_type] = useState(false);
  const [created_activities, setCreated_activities] = useState(0);
  const [virtual_activities, setVirtual_activities] = useState(0);
  const [inperson_activities, setInperson_activities] = useState(0);
  const [inperson_outdoor_activities, setInperson_outdoor_activities] =
    useState(0);
  const [filter_open, setFilter_open] = useState(false);
  const [filtered_data, setFiltered_data] = useState([]);
  const [show_type, setShow_type] = useState("All");
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [pdf_loading, setPdf_loading] = useState([]);
  let navigate = useNavigate();
  const [warn_deleted, setWarn_deleted] = useState(false);

  const handleChangePage = (event, newPage) => {
    if (search_field) return;
    if (show_type === "Inperson" || show_type === "Virtual") return;
    setLoadingPageChange(true);
    if (newPage > page) {
      changePage("next");
    } else {
      changePage("prev");
    }
    setPage(newPage);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setFilter_open(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function create_activity() {
    navigate("/create-activity");
  }

  function del_activity(id, confirm) {
    const docRef = doc(db, CollectionName.games, id);
    if (confirm) {
      updateDoc(docRef, {
        isDeleted: true,
      })
        .then(() => {
          setSearch_field("");
          setConfirmDeletion(false);
          setRowId(null);
          setWarn_deleted(false);
        })
        .catch((error) => {
          alert("Something went wrong. Try after sometime");
        });
    } else {
      setWarn_deleted(true);
      setRowId(id);
    }
  }

  function edit_activity(id) {

    console.log(data)
    data.forEach((datum) => {
      if (datum.id === id) {
        const info = datum.data;

        myContext.setEdit_activity(true);
        myContext.setActivity_id(id);
        myContext.setGame_type(info.game_type);
        myContext.setGame_objective(info.game_objective);
        myContext.setKey_title1(info.key_title1);
        myContext.setKey_title2(info.key_title2);
        myContext.setKey_title3(info.key_title3);
        myContext.setKey_description1(info.key_description1);
        myContext.setKey_description2(info.key_description2);
        myContext.setKey_description3(info.key_description3);
        if (info.game_type === "Inperson") {
          myContext.setInperson_game_name(info.game_name);
          myContext.setInperson_game_url(info.game_url);
          myContext.setInperson_game_cost(info.material_cost);
          myContext.setInperson_game_category(info.category);
          myContext.setInperson_game_logo(null);
          myContext.setInperson_game_images(null);
          myContext.setInperson_logo(info.game_logo);
          myContext.setInperson_image(info.game_image);
          myContext.setInperson_image1(info.game_image1);
          myContext.setInperson_image2(info.game_image2);
          myContext.setInperson_specialgame_images(info.special_images);
          if (info.game_cover){
            myContext.setInperson_game_cover(info.game_cover);
          } else {
            myContext.setInperson_game_cover("");
          }
          
        } else if (info.game_type === "Virtual") {
          myContext.setVirtual_game_name(info.game_name);
          myContext.setVirtual_game_url(info.game_url);
          myContext.setAct_slab1(info.program_fee[0]);
          myContext.setAct_slab2(info.program_fee[1]);
          myContext.setAct_slab3(info.program_fee[2]);
          myContext.setAct_slab4(info.program_fee[3]);
          myContext.setAct_slab5(info.program_fee[4]);
          myContext.setVirtual_game_category(info.category);
          myContext.setVirtual_game_logo(null);
          myContext.setVirtual_game_images(null);
          myContext.setVirtual_logo(info.game_logo);
          myContext.setVirtual_image(info.game_image);
          myContext.setVirtual_image1(info.game_image1);
          myContext.setVirtual_image2(info.game_image2);
          myContext.setVirtual_specialgame_images(info.special_images);
          
          if (info.game_cover){
            myContext.setVirtual_game_cover(info.game_cover);
          } else {
            myContext.setVirtual_game_cover("");
          }
        }
        navigate("/create-activity");
      }
    });
  }

  useEffect(() => {
    // const collectionRef = collection(db, CollectionName.games);
    let q;
    q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false)
    );
    getDocs(q).then((docs) => {
      setTotalDocuments(docs.size);
    });
    q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false),

      orderBy("game_name", "asc")
    );

    onSnapshot(q, (querySnapshot) => {
      setData2(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, [rowId]);

  const changePage = (action) => {
    let q;

    if (action === "next")
      q = query(
        collection(db, CollectionName.games),
        where("isDeleted", "==", false),

        orderBy("game_name", "asc"),
        limit(rowsPerPage),
        startAfter(lastRecord)
      );
    else {
      q = query(
        collection(db, CollectionName.games),
        where("isDeleted", "==", false),

        orderBy("game_name", "asc"),
        limitToLast(rowsPerPage),
        endBefore(firstRecord)
      );
    }
    getDocs(q).then((docs) => {
      let index = 0;
      docs.forEach((doc) => {
        setLastRecord(doc.data().game_name);
        if (index === 0) {
          setFirstRecord(doc.data().game_name);
        }
        index++;
      });

      snapshot(q);
    });
  };

  const snapshot = (q) => {
    onSnapshot(q, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      setFiltered_data(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      if (
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          .length == 0
      ) {
        setFetched(0);
      } else {
        setFetched(1);
      }
    });
    setLoadingPageChange(false);
  };
  //change db programatically!
  // useEffect(() => {
  //   let q = query(collection(db, CollectionName.proposals));

  //   getDocs(q).then((querySnapshot) => {
  //     querySnapshot.forEach((docRef) => {
  //       // const gameData = docRef.data();
  //       // const gameName = gameData.game_name;
  //       // const gameNameSmall =
  //       //   gameData.game_name_small || gameName.toLowerCase(); // if game_name_small doesn't exist, use game_name

  //       // update the document with the new field
  //       updateDoc(doc(db, `${CollectionName.proposals}/${docRef.id}`), {
  //         isDeleted: false,
  //       });
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (!search_field && show_type === "All" && page === 0) {
      let q = query(
        collection(db, CollectionName.games),
        where("isDeleted", "==", false),
        orderBy("game_name", "asc"),
        limit(rowsPerPage)
      );
      getDocs(q).then((docs) => {
        if (docs.docs.length < 1) {
          setFiltered_data([]);
          return;
        }
        let index = 0;
        docs.forEach((doc) => {
          setLastRecord(doc.data().game_name);
          if (index === 0) {
            setFirstRecord(doc.data().game_name);
          }
          index++;
        });
        snapshot(q);
      });
    }
  }, [amortizedSearch, show_type, page]);

  useEffect(() => {
    let q;
    if (search_field && search_field != "") {
      q = query(
        collection(db, CollectionName.games),
        where("isDeleted", "==", false),
        where("game_name_small", ">=", search_field.toLowerCase()),
        where("game_name_small", "<=", search_field.toLowerCase() + "\uf8ff"),
        orderBy("game_name_small", "asc")
      );
    } else if (show_type && show_type != "All") {
      q = query(
        collection(db, CollectionName.games),

        where("isDeleted", "==", false),

        where("game_type", "==", show_type),

        orderBy("game_name", "asc")
      );
    } else {
      q = query(
        collection(db, CollectionName.games),
        where("isDeleted", "==", false),
        orderBy("game_name", "asc"),
        limit(rowsPerPage)
      );
    }
    getDocs(q).then((docs) => {
      if (docs.docs.length < 1) {
        setFiltered_data([]);
        return;
      }
      let index = 0;
      docs.forEach((doc) => {
        setLastRecord(doc.data().game_name);
        if (index === 0) {
          setFirstRecord(doc.data().game_name);
        }
        index++;
      });

      snapshot(q);
    });
  }, [rowsPerPage, search_field, show_type]);

  useEffect(() => {
    setCreated_activities(data2.length);
    setVirtual_activities(
      data2.filter((value) => {
        if (value.data.game_type === "Virtual") {
          return value;
        }
      }).length
    );

    setInperson_activities(
      data2.filter((value) => {
        if (
          value.data.game_type === "Inperson" &&
          (value.data.category === "Group A" ||
            value.data.category === "Group B")
        ) {
          return value;
        }
      }).length
    );

    setInperson_outdoor_activities(
      data2.filter((value) => {
        if (
          value.data.game_type === "Inperson" &&
          value.data.category === "Outdoor"
        ) {
          return value;
        }
      }).length
    );
  }, [data2]);
  const debouncedSearch = _.debounce((searchField, callback) => {
    setAmortizedSearch(searchField, callback);
  }, 500);
  const sidebar_menu_items = [
    {
      label: "Users",
      icon: <FontAwesomeIcon icon={faUser} />,
      navigateOnClick: "/admin-dashboard",
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
      isActive: true,
    },
    {
      label: "Settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      navigateOnClick: "/fee-settings",
    },
  ];

  const sidebar_menu_items_bd = [
    {
      label: "Proposals",
      icon: <FontAwesomeIcon icon={faFile} />,
      navigateOnClick: "/admin-dashboard",
    },
    {
      label: "Activities",
      icon: <FontAwesomeIcon icon={faPeopleGroup} />,
      navigateOnClick: "/activities",
      isActive: true,
    },
  ];

  function activity_deleted_close() {
    setWarn_deleted(false);
  }

  return (
    <div>
      <Dialog
        className="pop"
        open={warn_deleted}
        onClose={activity_deleted_close}
      >
        <h5 className="popup-alert">
          Are you sure you want to delete this Activity?
        </h5>
        <div className="d-flex justify-content-center gap-2 px-3">
          {" "}
          <button
            class="flex btn btn-primary drawer-submit "
            disabled={rowId && confirmDeletion}
            style={{ width: "100px" }}
            onClick={activity_deleted_close}
          >
            No
          </button>
          <button
            style={{ width: "100px" }}
            class="flex btn btn-primary drawer-submit "
            disabled={rowId && confirmDeletion}
            onClick={() => {
              setConfirmDeletion(true);
              del_activity(rowId, true);
            }}
          >
            {rowId && confirmDeletion ? (
              <div class="spinner-border spinner-border-sm"></div>
            ) : (
              "Yes"
            )}
          </button>
        </div>
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
            {localStorage.getItem("admin-auth") ? (
              <Sidebar sideBarMenuItems={sidebar_menu_items} />
            ) : (
              <Sidebar sideBarMenuItems={sidebar_menu_items_bd} />
            )}
          </Stack>
          <Stack sx={{ width: "87%" }} className="content-section float-right">
            {fetched === 1 ? (
              <div className="container-fluid content-section table-section">
                <div className="analytics">
                  <img src={require("../assets/images/insights.png")}></img>
                  <h5 className="insights">&nbsp;&nbsp;Insights</h5>
                  {/* <h6 className='insights-duration'>&nbsp;&nbsp;Last 7 days</h6> */}
                  <div className="row analyt">
                    <div className="col-md-2 columns">
                      <h6 className="analyt-title">Activities Created</h6>

                      <h3 className="analyt-value">{created_activities}</h3>
                    </div>
                    <div className="col-md-2 columns">
                      <h6 className="analyt-title">Virtual Activities</h6>
                      <h3 className="analyt-value">{virtual_activities}</h3>
                    </div>
                    <div className="col-md-2 columns">
                      <h6 className="analyt-title">
                        Indoor/Outdoor Activities
                      </h6>
                      <h3 className="analyt-value">{inperson_activities}</h3>
                    </div>
                    <div className="col-md-2 columns">
                      <h6 className="analyt-title">Outdoor Activities</h6>
                      <h3 className="analyt-value">
                        {inperson_outdoor_activities}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="container-fluid table-head">
                  <div className="row">
                    <div className="col-lg-8 d-flex justify-content-between col-md-6 table-title-wrap">
                      <h6 id="table-title">Activities</h6>
                      <div>
                        {" "}
                        {show_type != "All" && (
                          <Chip
                            label={show_type}
                            onDelete={() => {
                              setShow_type("All");
                            }}
                          />
                        )}
                        <img
                          className="filter"
                          onClick={(e) => {
                            setPage(0);

                            setFilter_open(true);
                            setSearch_field("");
                          }}
                          src={require("../assets/images/Filter.png")}
                        ></img>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2 d-flex align-items-center">
                      <div className="container-fluid search">
                        <div className="row search-row">
                          <div className="col-2 search-icon">
                            <FontAwesomeIcon icon={faSearch} color="#DADADA" />
                          </div>
                          <div className="col-10 padding-7">
                            <input
                              type="text"
                              className="form-control form-input search-input"
                              placeholder="Search..."
                              value={search_field}
                              onChange={(e) => {
                                setPage(0);
                                setShow_type("All");
                                setSearch_field(e.target.value);
                                debouncedSearch(
                                  e.target.value,
                                  setFiltered_data
                                );
                              }}
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-3 notify-button-wrap">
                      <button
                        type="button"
                        className="btn btn-primary w-100 p-0 notify-button"
                        onClick={create_activity}
                      >
                        <FontAwesomeIcon icon={faPlus} color="#ffff" />
                        &nbsp;&nbsp;Create Activity
                      </button>
                    </div>
                  </div>
                </div>

                <div className="table-responsive-lg">
                  <TableContainer component={Paper}>
                    <Table
                      size="larger"
                      aria-label="a dense table"
                      className="table table-striped table-dark"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-nowrap">S.No</TableCell>
                          <TableCell className="text-nowrap">
                            Activity Name
                          </TableCell>
                          <TableCell className="text-nowrap">
                            Game Type
                          </TableCell>
                          <TableCell className="text-nowrap">
                            Category
                          </TableCell>
                          <TableCell className="text-nowrap">Status</TableCell>
                          <TableCell className="text-nowrap">
                            Created On
                          </TableCell>
                          <TableCell>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filtered_data
                          // .filter((value) => {
                          //   if (search_field === "") {
                          //     return value;
                          //   } else if (
                          //     value.data.game_name
                          //       .toLowerCase()
                          //       .includes(search_field.toLowerCase())
                          //   ) {
                          //     return value;
                          //   }
                          // })
                          // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {rowsPerPage * page + index + 1}
                              </TableCell>
                              <TableCell>
                                <img
                                  className="company-logo"
                                  src={
                                    row.data.game_logo
                                      ? row.data.game_logo
                                      : require("../assets/images/schedule.png")
                                  }
                                  width="30px"
                                  height="30px"
                                ></img>
                                &nbsp;&nbsp;{row.data.game_name}
                              </TableCell>
                              <TableCell>{row.data.game_type}</TableCell>
                              <TableCell>{row.data.category}</TableCell>
                              <TableCell>
                                {row.data.draft ? "Draft" : "Published"}
                              </TableCell>
                              <TableCell>
                                {moment(new Date(row.data.created_date)).format(
                                  "ll"
                                )}
                              </TableCell>
                              <TableCell>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <React.Fragment>
                                      <div
                                        className="profile edit-del"
                                        {...bindTrigger(popupState)}
                                      >
                                        <img
                                          className="drop edit-del"
                                          src={require("../assets/images/edit-delete.png")}
                                        ></img>
                                      </div>

                                      <Menu {...bindMenu(popupState)}>
                                        <MenuItem
                                          onClick={(e) => {
                                            edit_activity(row.id);
                                            popupState.close();
                                          }}
                                        >
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          onClick={(e) => {
                                            del_activity(row.id, false);
                                            popupState.close();
                                          }}
                                        >
                                          Delete
                                        </MenuItem>
                                      </Menu>
                                    </React.Fragment>
                                  )}
                                </PopupState>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {!search_field && show_type === "All" && !loadingPageChange && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    className="pagination"
                    component="div"
                    rowsPerPage={rowsPerPage}
                    count={totalDocuments}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </div>
            ) : (
              ""
            )}
            {fetched == 0 ? (
              <div className="no-proposal content-section">
                <h5 className="proposal-text">
                  Get started with creating activities.
                </h5>
                <img src={require("../assets/images/no-proposal.png")}></img>
                <br />
                <button
                  onClick={create_activity}
                  type="button"
                  className="btn btn-primary btn-block proposal-button"
                >
                  Create New Activity
                </button>
              </div>
            ) : (
              ""
            )}

            <Dialog
              disableEscapeKeyDown
              open={filter_open}
              onClose={handleClose}
            >
              <DialogTitle>Filter</DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel htmlFor="demo-dialog-native">Type</InputLabel>
                    <Select
                      native
                      value={show_type}
                      onChange={(e) => setShow_type(e.target.value)}
                      input={
                        <OutlinedInput label="Age" id="demo-dialog-native" />
                      }
                    >
                      <option>All</option>
                      <option>Inperson</option>
                      <option>Virtual</option>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(e) => {
                    setShow_type("All");
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Ok</Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default Activities;
