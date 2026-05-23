import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  startAt,
  limitToLast,
} from "firebase/firestore";
import {fire} from "../components/Firebase";
import Sidebar from "../components/Sidebar";
import { ReactComponent as Activity_logo } from "../assets/images/activities.svg";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { getAuth, deleteUser } from "firebase/auth";
import { Stack, Chip } from "@mui/material";
import AppContext from "../components/AppContext";
import {
  faUser,
  faFile,
  faGear,
  faChartLine,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./Users.css";
import { getDownloadURL } from "firebase/storage";
import moment from "moment";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
// import { firebaseAdmin } from "firebase/admin";
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
import { collectionPicker, baseUrl } from "./collection_config";

function Users() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetched, setFetched] = useState(4);
  const db = getFirestore(fire);
  const auth = getAuth(fire);
  const user = auth.currentUser;

  const [totalDocuments, setTotalDocuments] = useState(0);
  const [lastRecord, setLastRecord] = useState("");
  const [firstRecord, setFirstRecord] = useState("");
  const [search_field, setSearch_field] = useState("");
  const [warn_deleted, setWarn_deleted] = useState(null);

  const [sort_draft, setSort_draft] = useState(false);
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
  const myContext = useContext(AppContext);
  let navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    if (search_field) return;
    if (show_type === "BD" || show_type === "Admin") return;

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

  function create_user() {
    navigate("/create-user");
  }

  async function del_user(email) {
    //call an api with this endpoint "http://localhost:8089/delete_user/${email}" with put method
    const url = baseUrl;

    axios
      .post(url + `/api/delete_user/`, { email: email })
      .then((res) => {
        if (res.data.msg === "User deleted successfully!") {
          setWarn_deleted(null);

          setConfirmDeletion(false);
          alert("User Deleted Successfully!");
        }
      })
      .catch((err) => {
        setConfirmDeletion(false);
        alert(`Error while deleting !!`);
        console.log("Error while deleting", err);
      });
  }

  useEffect(() => {
    const collectionRef = collection(db, "users");
    getDocs(collectionRef).then((docs) => {
      setTotalDocuments(docs.size);
    });
  }, []);

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
        // setFetched(0);
      } else {
        setFetched(1);
      }
    });
  };
  const changePage = (action) => {
    let q;

    if (action === "next")
      q = query(
        collection(db, "users"),
        orderBy("username", "asc"),
        limit(rowsPerPage),
        startAfter(lastRecord)
      );
    else {
      q = query(
        collection(db, "users"),
        orderBy("username", "asc"),
        limitToLast(rowsPerPage),
        endBefore(firstRecord)
      );
    }
    getDocs(q).then((docs) => {
      let index = 0;
      docs.forEach((doc) => {
        setLastRecord(doc.data().username);
        if (index === 0) {
          setFirstRecord(doc.data().username);
        }
        index++;
      });

      snapshot(q);
    });
  };
  useEffect(() => {
    let q;
    if (search_field) {
      q = query(
        collection(db, "users"),
        where("username_small", ">=", search_field.toLowerCase()),
        where("username_small", "<=", search_field.toLowerCase() + "\uf8ff"),
        orderBy("username_small", "asc")
      );
    } else if (show_type && show_type != "All") {
      q = query(
        collection(db, "users"),
        where("designation", "==", show_type),

        orderBy("username", "asc")
      );
    } else {
      q = query(
        collection(db, "users"),
        orderBy("username", "asc"),
        limit(rowsPerPage)
      );
    }
    getDocs(q).then((docs) => {
      let index = 0;
      docs.forEach((doc) => {
        setLastRecord(doc.data().username);
        if (index === 0) {
          setFirstRecord(doc.data().username);
        }
        index++;
      });

      snapshot(q);
    });
  }, [rowsPerPage, search_field, show_type]);

  function edit_user(id) {
    data.forEach((datum) => {
      if (datum.id === id) {
        const info = datum.data;
        myContext.setEdit_user(true);
        myContext.setUser_id(id);
        myContext.setUsername(info.username);
        myContext.setPassword("");
        myContext.setUser_email(info.email);
        myContext.setDesignation(info.designation);
        myContext.setProfile_picture(null);
        myContext.setUser_image(info.profile_image);
        navigate("/create-user");
      }
    });
  }

  useEffect(() => {
    if (show_type === "All") {
      setFiltered_data(data);
    }
    if (show_type === "BD") {
      setFiltered_data(data.filter((value) => value.data.designation === "BD"));
    }
    if (show_type === "Admin") {
      setFiltered_data(
        data.filter((value) => value.data.designation === "Admin")
      );
    }
  }, [show_type]);

  const sidebar_menu_items = [
    {
      label: "Users",
      icon: <FontAwesomeIcon icon={faUser} />,
      navigateOnClick: "/users",
      isActive: true,
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
    },
  ];
  function user_deleted_close() {
    setWarn_deleted(null);
    setConfirmDeletion(false);
  }

  return (
    <div>
      <Dialog className="pop" open={warn_deleted} onClose={user_deleted_close}>
        <h5 className="popup-alert">
          Are you sure you want to delete this User?
        </h5>
        <div className="d-flex justify-content-center gap-2 px-3">
          {" "}
          <button
            class="flex btn btn-primary drawer-submit "
            disabled={confirmDeletion}
            style={{ width: "100px" }}
            onClick={user_deleted_close}
          >
            No
          </button>
          <button
            style={{ width: "100px" }}
            class="flex btn btn-primary drawer-submit "
            disabled={confirmDeletion}
            onClick={() => {
              del_user(warn_deleted);
              setConfirmDeletion(true);
            }}
          >
            {confirmDeletion ? (
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
            <Sidebar sideBarMenuItems={sidebar_menu_items} />
          </Stack>
          <Stack sx={{ width: "87%" }} className="content-section float-right">
            {fetched === 1 ? (
              <div className="container-fluid table-section content-section">
                <div className="container-fluid table-head">
                  <div className="row">
                    <div className="col-lg-8 d-flex justify-content-between col-md-6 table-title-wrap">
                      <h6 id="table-title">Users</h6>
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
                      <div className="search">
                        <div className="row search-row">
                          <div className="col-2 search-icon">
                            <FontAwesomeIcon
                              icon={faSearch}
                              color="#DADADA"
                              size="lg"
                            />
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
                        onClick={create_user}
                      >
                        <FontAwesomeIcon icon={faPlus} color="#ffff" />
                        &nbsp;&nbsp;Create User
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
                            User Name
                          </TableCell>
                          <TableCell className="text-nowrap">
                            User Mail ID
                          </TableCell>
                          <TableCell className="text-nowrap">Role</TableCell>
                          {/* <TableCell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filtered_data
                          // .filter((value) => {
                          //   if (search_field === "") {
                          //     return value;
                          //   } else if (
                          //     value.data.username
                          //       .toLowerCase()
                          //       .includes(search_field.toLowerCase())
                          //   ) {
                          //     return value;
                          //   }
                          // })
                          // .slice(
                          //   page * rowsPerPage,
                          //   page * rowsPerPage + rowsPerPage
                          // )
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
                                  style={{
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                  }}
                                  className="company-logo"
                                  src={
                                    row.data.profile_image
                                      ? row.data.profile_image
                                      : require("../assets/images/avatar.png")
                                  }
                                ></img>
                                &nbsp;&nbsp;{row.data.username}
                              </TableCell>
                              <TableCell>
                                &nbsp;&nbsp;{row.data.email}
                              </TableCell>
                              <TableCell>{row.data.designation}</TableCell>
                              <TableCell>
                                {(localStorage.getItem("super-admin-auth") &&
                                  row.data.designation !== "Super Admin") ||
                                (!localStorage.getItem("super-admin-auth") &&
                                  localStorage.getItem("admin-auth") &&
                                  row.data.designation === "BD") ? (
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
                                          {(localStorage.getItem(
                                            "super-admin-auth"
                                          ) &&
                                            row.data.designation !==
                                              "Super Admin") ||
                                          (!localStorage.getItem(
                                            "super-admin-auth"
                                          ) &&
                                            localStorage.getItem(
                                              "admin-auth"
                                            ) &&
                                            row.data.designation === "BD") ? (
                                            <MenuItem
                                              onClick={(e) => {
                                                edit_user(row.id);
                                                popupState.close();
                                              }}
                                            >
                                              Edit
                                            </MenuItem>
                                          ) : null}
                                          {((localStorage.getItem(
                                            "super-admin-auth"
                                          ) &&
                                            row.data.designation !==
                                              "Super Admin") ||
                                            (!localStorage.getItem(
                                              "super-admin-auth"
                                            ) &&
                                              localStorage.getItem(
                                                "admin-auth"
                                              ) &&
                                              row.data.designation ===
                                                "BD")) && (
                                            <MenuItem
                                              onClick={(e) => {
                                                setWarn_deleted(row.data.email);
                                                popupState.close();
                                              }}
                                            >
                                              Delete
                                            </MenuItem>
                                          )}
                                        </Menu>
                                      </React.Fragment>
                                    )}
                                  </PopupState>
                                ) : null}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {!search_field && show_type === "All" && (
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
                  Get started with creating users.
                </h5>
                <img src={require("../assets/images/no-proposal.png")}></img>
                <br />
                <button
                  onClick={create_user}
                  type="button"
                  className="btn btn-primary btn-block proposal-button"
                >
                  Create New User
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
                      <option>BD</option>
                      <option>Admin</option>
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

export default Users;
