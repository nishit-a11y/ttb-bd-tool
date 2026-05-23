import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Select from "@mui/material/Select";
import {fire} from "../../components/Firebase";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import FormControl from "@mui/material/FormControl";
import "./Activities.css";
import moment from "moment";
import { Chip } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import {
  setGameType,
  setOpenFilter,
  setSearchField,
  setStatus,
} from "./ActivitySlice";
import { CollectionName } from "../collection_config";
import {
  setCategory,
  setDescriptionData,
  setEditActivity,
  setFirebaseURLActivity,
  setFirebaseURLLogo,
  setFirebaseURLSpecial,
  setGameName,
  setGameURL,
  setgame_type,
  setImagesActivity,
  setImagesLogo,
  setImageCover,
  setImagesSpecial,
  setMaterialCost,
  setObjectiveData,
  setProgramFee,
  setSpecialActivity,
  reset,
} from "../CreateActivity/CreateActivitySlice";

function BottomSection({ activityData }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //handles filter dialog box
  const Dialogs = () => {
    const dispatch = useDispatch();
    const { openFilter, gameType, status } = useSelector(
      (state) => state.activity
    );
    return (
      <>
        <Dialog
          disableEscapeKeyDown
          open={openFilter}
          onClose={() => {
            dispatch(setOpenFilter(gameType));
          }}
        >
          <DialogTitle>Filter</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel shrink htmlFor="game-type-select">
                  Game Type
                </InputLabel>
                <Select
                  native
                  value={gameType}
                  onChange={(e) => dispatch(setGameType(e.target.value))}
                  input={
                    <OutlinedInput label="Game Type" id="game-type-select" />
                  }
                >
                  <option>All</option>
                  <option>Inperson</option>
                  <option>Virtual</option>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel shrink htmlFor="status-select">
                  Status
                </InputLabel>
                <Select
                  native
                  value={status}
                  onChange={(e) => dispatch(setStatus(e.target.value))}
                  input={<OutlinedInput label="Status" id="status-select" />}
                >
                  <option>All</option>
                  <option>Published</option>
                  <option>Draft</option>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={(e) => {
                dispatch(setGameType("All"));
                dispatch(setStatus("All"));
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenFilter(false));
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenFilter(false));
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  //handles search, filter and create activity button
  const Heading = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const { searchField, gameType, status } = useSelector(
      (state) => state.activity
    );
    const inputRef = useRef(null);
    useEffect(() => {
      if (inputRef.current && currentPage == 0 && searchField.length > 0) {
        inputRef.current.focus();
      }
    }, [currentPage]);
    return (
      <div className="container-fluid table-head">
        <div className="row">
          <div className="col-lg-8 d-flex justify-content-between col-md-6 table-title-wrap">
            <h6 id="table-title">Activities</h6>
            <div>
              {" "}
              {gameType && gameType != "All" && (
                <Chip
                  label={gameType}
                  onDelete={() => {
                    dispatch(setGameType("All"));
                  }}
                />
              )}
              {status && status != "All" && (
                <Chip
                  label={status}
                  onDelete={() => {
                    dispatch(setStatus("All"));
                  }}
                />
              )}
              <img
                className="filter"
                onClick={(e) => {
                  setCurrentPage(0);
                  dispatch(setOpenFilter(true));
                  // dispatch(setSearchField(""));
                }}
                src={require("../../assets/images/Filter.png")}
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
                    ref={inputRef}
                    type="text"
                    id="activitySearch"
                    className="form-control form-input search-input"
                    placeholder="Search..."
                    value={searchField}
                    onChange={(e) => {
                      setCurrentPage(0);

                      dispatch(setSearchField(e.target.value));
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
              onClick={() => {
                navigate("/create-activity");
                dispatch(reset());
              }}
            >
              <FontAwesomeIcon icon={faPlus} color="#ffff" />
              &nbsp;&nbsp;Create Activity
            </button>
          </div>
        </div>
      </div>
    );
  };

  //handles table content
  const TableContent = () => {
    let navigate = useNavigate();
    const { editActivityData } = useSelector((state) => state.createActivity);
    const { searchField, gameType, status } = useSelector(
      (state) => state.activity
    );
    const dispatch = useDispatch();
    const [openDelete, setOpenDelete] = useState(false);
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [rowId, setRowId] = useState(null);

    const db = getFirestore(fire);

    function deleteActivity(id, confirm) {
      const docRef = doc(db, CollectionName.games, id);
      if (confirm) {
        updateDoc(docRef, {
          isDeleted: true,
        })
          .then(() => {
            dispatch(setSearchField(""));
            setConfirmDeletion(false);
            setRowId(null);
            setOpenDelete(false);
          })
          .catch((error) => {
            alert("Something went wrong. Try after sometime");
          });
      } else {
        setOpenDelete(true);
        setRowId(id);
      }
    }

    function edit_activity(id) {
      activityData.forEach((data) => {
        if (!editActivityData && data.id === id) {
          console.log(data.data);
          dispatch(setEditActivity(id));

          dispatch(setCategory(data.data.category));
          dispatch(setGameName(data.data.game_name));
          dispatch(setGameURL(data.data.game_url));
          dispatch(setMaterialCost(data.data.material_cost));
          dispatch(setProgramFee(data.data.program_fee));
          if (data.data.game_logo === "") {
            dispatch(setImagesLogo([]));
            dispatch(setFirebaseURLLogo([]));
          } else {
            dispatch(setImagesLogo([data.data.game_logo]));
            dispatch(setFirebaseURLLogo([data.data.game_logo]));
          }

          if (data.data.game_cover === "") {
            dispatch(setImageCover([]));
            dispatch(setFirebaseURLLogo([]));
          } else {
            dispatch(setImageCover([data.data.game_cover]));
            dispatch(setFirebaseURLLogo([data.data.game_cover]));
          }

          if (
            data.data.game_image === "" &&
            data.data.game_image1 === "" &&
            data.data.game_image2 === ""
          ) {
            dispatch(setImagesActivity([]));
            dispatch(setFirebaseURLActivity([]));
          } else {
            dispatch(
              setImagesActivity([
                data.data.game_image,
                data.data.game_image1,
                data.data.game_image2,
              ])
            );
            dispatch(
              setFirebaseURLActivity([
                data.data.game_image,
                data.data.game_image1,
                data.data.game_image2,
              ])
            );
          }
          //if special images is empty array
          if (data.data.special_images.length > 0)
            dispatch(setSpecialActivity(true));

          dispatch(setImagesSpecial(data.data.special_images));
          dispatch(setFirebaseURLSpecial(data.data.special_images));

          dispatch(
            setDescriptionData({
              title: [
                data.data.key_title1,
                data.data.key_title2,
                data.data.key_title3,
              ],
              description: [
                data.data.key_description1,
                data.data.key_description2,
                data.data.key_description3,
              ],
            })
          );

          dispatch(setgame_type(data.data.game_type));
          dispatch(setObjectiveData(data.data.game_objective));
        }
        navigate("/create-activity");
      });
    }
    const handleChangePage = (event, newPage) => {
      setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setCurrentPage(0);
    };

    return (
      <div className="table-responsive-lg">
        <Dialog
          className="pop"
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
          }}
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
              onClick={() => setOpenDelete(false)}
            >
              No
            </button>
            <button
              style={{ width: "100px" }}
              class="flex btn btn-primary drawer-submit "
              disabled={rowId && confirmDeletion}
              onClick={() => {
                setConfirmDeletion(true);
                deleteActivity(rowId, true);
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
        <TableContainer component={Paper}>
          <Table
            size="larger"
            aria-label="a dense table"
            className="table table-striped table-dark"
          >
            <TableHead>
              <TableRow>
                <TableCell className="text-nowrap">S.No</TableCell>
                <TableCell className="text-nowrap">Activity Name</TableCell>
                <TableCell className="text-nowrap">Game Type</TableCell>
                <TableCell className="text-nowrap">Category</TableCell>
                <TableCell className="text-nowrap">Status</TableCell>
                <TableCell className="text-nowrap">Created On</TableCell>
                <TableCell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(() => {
                const filteredActivityData = activityData
                  .filter((value) => {
                    if (searchField === "") {
                      return true;
                    } else if (
                      value.data.game_name
                        .toLowerCase()
                        .includes(searchField.toLowerCase())
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .filter((value) => {
                    if (gameType === "All" || !gameType) {
                      return true;
                    } else if (value.data.game_type === gameType) {
                      return true;
                    }
                    return false;
                  })
                  .filter((value) => {
                    if (status === "All" || !status) {
                      return true;
                    } else if (status === "Published") {
                      return !value.data.draft;
                    } else if (status === "Draft") {
                      return value.data.draft;
                    }
                    return false;
                  });

                const isFiltering =
                  searchField !== "" || gameType !== "All" || status !== "All";

                const displayedActivityData = isFiltering
                  ? filteredActivityData
                  : filteredActivityData.slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    );

                return displayedActivityData.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {rowsPerPage * currentPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <img
                        className="company-logo"
                        src={
                          row.data.game_logo
                            ? row.data.game_logo
                            : require("../../assets/images/schedule.png")
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
                      {moment(new Date(row.data.created_date)).format("ll")}
                    </TableCell>
                    <TableCell>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <div
                              className="profile edit-del"
                              {...bindTrigger(popupState)}
                            >
                              <img
                                className="drop edit-del"
                                src={require("../../assets/images/edit-delete.png")}
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
                                  deleteActivity(row.id, false);
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
                ));
              })()}
            </TableBody>
          </Table>
        </TableContainer>
        {searchField == "" &&
          gameType &&
          gameType == "All" &&
          status &&
          status == "All" && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              className="pagination"
              component="div"
              rowsPerPage={rowsPerPage}
              count={activityData.length}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
      </div>
    );
  };

  return (
    <>
      <Dialogs />
      <Heading />
      <TableContent />
    </>
  );
}
export default BottomSection;
