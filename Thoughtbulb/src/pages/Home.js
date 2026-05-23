import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import {fire} from "../components/Firebase";
import "./Home.css";
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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CollectionName } from "./collection_config";

function Home() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetched, setFetched] = useState(4);
  const db = getFirestore(fire);
  const [search_field, setSearch_field] = useState("");
  const [sort_draft, setSort_draft] = useState(false);
  const [sort_type, setSort_type] = useState(false);
  const [created_proposals, setCreated_proposals] = useState(0);
  const [proposals_in_process, setProposals_in_process] = useState(0);
  const [proposals_completed, setProposals_completed] = useState(0);
  const [filter_open, setFilter_open] = useState(false);
  const [filtered_data, setFiltered_data] = useState([]);
  const [show_type, setShow_type] = useState("All");
  const [show_pdf, setShow_pdf] = useState("All");
  const [pdf_loading, setPdf_loading] = useState([]);
  let navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
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

  function create_proposal() {
    navigate("/create-proposal");
  }

  useEffect(() => {
    const q = query(collection(db, CollectionName.proposals));
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
  }, []);

  useEffect(() => {
    //
    let today = new Date();
    let day_before_7_days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // setCreated_proposals(data.filter((value) => {
    //   if ((day_before_7_days < value.data.created_date.toDate()) && (value.data.created_date.toDate() < today)) {
    //     return value;
    //   }
    // }).length)

    setCreated_proposals(data.length);

    setProposals_in_process(
      data.filter((value) => {
        if (value.data.inperson) {
          if (value.data.inperson_info.days === 2) {
            if (new Date(value.data.inperson_info.day2.date) > today) {
              return value;
            }
          } else {
            if (new Date(value.data.inperson_info.day1.date) > today) {
              return value;
            }
          }
        }
        if (value.data.virtual) {
          if (value.data.virtual_info.days === 2) {
            if (new Date(value.data.virtual_info.day2.date) > today) {
              return value;
            }
          } else {
            if (new Date(value.data.virtual_info.day1.date) > today) {
              return value;
            }
          }
        }
      }).length
    );

    setProposals_completed(
      data.filter((value) => {
        if (value.data.inperson) {
          if (value.data.inperson_info.days === 2) {
            if (new Date(value.data.inperson_info.day2.date) < today) {
              return value;
            }
          } else {
            if (new Date(value.data.inperson_info.day1.date) < today) {
              return value;
            }
          }
        }
        if (value.data.virtual) {
          if (value.data.virtual_info.days === 2) {
            if (new Date(value.data.virtual_info.day2.date) < today) {
              return value;
            }
          } else {
            if (new Date(value.data.virtual_info.day1.date) < today) {
              return value;
            }
          }
        }
      }).length
    );
  }, [data]);

  function get_pdf(id, index) {
    const new_arr = [...pdf_loading];
    new_arr[index] = true;
    setPdf_loading(new_arr);

    axios(`http://54.146.77.174:3007/generate/${id}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "document.pdf";
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        const new_arr = [...pdf_loading];
        new_arr[index] = false;
        setPdf_loading(new_arr);
      })
      .catch((error) => {
        const new_arr = [...pdf_loading];
        new_arr[index] = false;
        setPdf_loading(new_arr);
      });
  }

  useEffect(() => {
    if (show_type === "All" && show_pdf === "All") {
      setFiltered_data(data);
    }
    if (show_type === "All" && show_pdf === "Generated") {
      setFiltered_data(data.filter((value) => !value.data.draft));
    }
    if (show_type === "All" && show_pdf === "Not Generated") {
      setFiltered_data(data.filter((value) => value.data.draft));
    }
    if (show_type === "Inperson" && show_pdf === "All") {
      setFiltered_data(data.filter((value) => value.data.inperson));
    }
    if (show_type === "Inperson" && show_pdf === "Generated") {
      setFiltered_data(
        data.filter((value) => !value.data.draft && value.data.inperson)
      );
    }
    if (show_type === "Inperson" && show_pdf === "Not Generated") {
      setFiltered_data(
        data.filter((value) => value.data.draft && value.data.inperson)
      );
    }
    if (show_type === "Virtual" && show_pdf === "All") {
      setFiltered_data(data.filter((value) => value.data.virtual));
    }
    if (show_type === "Virtual" && show_pdf === "Generated") {
      setFiltered_data(
        data.filter((value) => !value.data.draft && value.data.virtual)
      );
    }
    if (show_type === "Virtual" && show_pdf === "Not Generated") {
      setFiltered_data(
        data.filter((value) => value.data.draft && value.data.virtual)
      );
    }
  }, [show_pdf, show_type]);

  return (
    <div className="container-fluid sec-wrap">
      <Header />
      {fetched === 1 ? (
        <div className="container-fluid table-section">
          <div className="analytics">
            <img src={require("../assets/images/insights.png")}></img>
            <h5 className="insights">&nbsp;&nbsp;Insights</h5>
            {/* <h6 className='insights-duration'>&nbsp;&nbsp;Last 7 days</h6> */}
            <div className="row analyt">
              <div className="col-md-2 columns">
                <h6 className="analyt-title">Proposals Created</h6>

                <h3 className="analyt-value">{created_proposals}</h3>
              </div>
              <div className="col-md-2 columns">
                <h6 className="analyt-title">Proposals In-Process</h6>
                <h3 className="analyt-value">{proposals_in_process}</h3>
              </div>
              <div className="col-md-2 columns">
                <h6 className="analyt-title">Proposals Completed</h6>
                <h3 className="analyt-value">{proposals_completed}</h3>
              </div>
              <div className="col-md-2 columns">
                <h6 className="analyt-title">Total Proposals Value</h6>
                <h3 className="analyt-value">360K</h3>
              </div>
            </div>
          </div>

          <div className="container-fluid table-head">
            <div className="row">
              <div className="col-md-7 table-title-wrap">
                <h6 id="table-title">Proposals</h6>
              </div>
              <div className="col-md-2">
                <div className="container-fluid search">
                  <div className="row search-row">
                    <div className="col-2 search-icon">
                      <FontAwesomeIcon icon={faSearch} color="#DADADA" />
                    </div>
                    <div className="col-10">
                      <input
                        type="text"
                        className="form-control form-input search-input"
                        placeholder="Search..."
                        onChange={(e) => setSearch_field(e.target.value)}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-1 filter">
                <img
                  className="filter"
                  onClick={(e) => setFilter_open(true)}
                  src={require("../assets/images/Filter.png")}
                ></img>
              </div>
              <div className="col-md-2 notify-button-wrap">
                <button
                  type="button"
                  className="btn btn-primary notify-button"
                  onClick={create_proposal}
                >
                  <FontAwesomeIcon icon={faPlus} color="#ffff" />
                  &nbsp;&nbsp;Create Proposal
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
                    <TableCell className="text-nowrap">Company Name</TableCell>
                    <TableCell className="text-nowrap">Participants</TableCell>
                    <TableCell className="text-nowrap">Type</TableCell>
                    <TableCell className="text-nowrap">Duration</TableCell>
                    <TableCell className="text-nowrap">Venue</TableCell>
                    <TableCell className="text-nowrap">PDF</TableCell>
                    <TableCell className="text-nowrap">Created On</TableCell>
                    <TableCell className="text-nowrap">
                      Intervention Date
                    </TableCell>
                    <TableCell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered_data
                    .filter((value) => {
                      if (search_field === "") {
                        return value;
                      } else if (
                        value.data.company_name
                          .toLowerCase()
                          .includes(search_field.toLowerCase())
                      ) {
                        return value;
                      }
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {rowsPerPage * page + index + 1}
                        </TableCell>
                        <TableCell>
                          <img
                            className="company-logo"
                            src={
                              row.data.company_logo
                                ? row.data.company_logo
                                : require("../assets/images/avatar.png")
                            }
                            width="30"
                            height="30"
                          ></img>
                          &nbsp;&nbsp;{row.data.company_name}
                        </TableCell>
                        <TableCell>
                          {row.data.inperson && row.data.inperson_info.days == 1
                            ? row.data.inperson_info.day1.participants
                            : ""}
                          {row.data.inperson && row.data.inperson_info.days == 2
                            ? row.data.inperson_info.day1.participants +
                              " / " +
                              row.data.inperson_info.day2.participants
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 1
                            ? row.data.virtual_info.day1.participants
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 2
                            ? row.data.virtual_info.day1.participants +
                              " / " +
                              row.data.virtual_info.day2.participants
                            : ""}
                        </TableCell>
                        <TableCell>
                          {row.data.inperson ? "In-Person" : "Virtual"}
                        </TableCell>
                        <TableCell>
                          {row.data.inperson && row.data.inperson_info.days == 1
                            ? row.data.inperson_info.day1.time
                            : ""}
                          {row.data.inperson && row.data.inperson_info.days == 2
                            ? row.data.inperson_info.day1.time +
                              " / " +
                              row.data.inperson_info.day2.time
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 1
                            ? row.data.virtual_info.day1.time
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 2
                            ? row.data.virtual_info.day1.time +
                              " / " +
                              row.data.virtual_info.day2.time
                            : ""}
                        </TableCell>
                        <TableCell>
                          {row.data.inperson
                            ? row.data.inperson_info.location
                            : ""}
                        </TableCell>
                        <TableCell>
                          {row.data.draft ? (
                            ""
                          ) : pdf_loading[index] ? (
                            <div class="spinner-border spinner-border-sm"></div>
                          ) : (
                            <img
                              className="pdf-icon"
                              onClick={(e) => {
                                get_pdf(row.id, index);
                              }}
                              src={require("../assets/images/pdf.png")}
                              width={20}
                            ></img>
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(new Date(row.data.created_date)).format("ll")}
                        </TableCell>
                        <TableCell>
                          {row.data.inperson && row.data.inperson_info.days == 1
                            ? moment(
                                new Date(row.data.inperson_info.day1.date)
                              ).format("ll")
                            : ""}
                          {row.data.inperson && row.data.inperson_info.days == 2
                            ? moment(
                                new Date(row.data.inperson_info.day1.date)
                              ).format("ll") +
                              " / " +
                              moment(
                                new Date(row.data.inperson_info.day2.date)
                              ).format("ll")
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 1
                            ? moment(
                                new Date(row.data.virtual_info.day1.date)
                              ).format("ll")
                            : ""}
                          {row.data.virtual && row.data.virtual_info.days == 2
                            ? moment(
                                new Date(row.data.virtual_info.day1.date)
                              ).format("ll") +
                              " / " +
                              moment(
                                new Date(row.data.virtual_info.day2.date)
                              ).format("ll")
                            : ""}
                        </TableCell>
                        <TableCell>
                          <img
                            className="pdf-icon"
                            src={require("../assets/images/edit-delete.png")}
                            width={5}
                            height={15}
                          ></img>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 15]}
            className="pagination"
            component="div"
            rowsPerPage={rowsPerPage}
            count={filtered_data.length}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        ""
      )}
      {fetched == 0 ? (
        <div className="no-proposal">
          <h5 className="proposal-text">
            Get started with creating proposals.
          </h5>
          <img src={require("../assets/images/no-proposal.png")}></img>
          <br />
          <button
            onClick={create_proposal}
            type="button"
            className="btn btn-primary btn-block proposal-button"
          >
            Create New Proposal
          </button>
        </div>
      ) : (
        ""
      )}

      <Dialog disableEscapeKeyDown open={filter_open} onClose={handleClose}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Type</InputLabel>
              <Select
                native
                value={show_type}
                onChange={(e) => setShow_type(e.target.value)}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                <option>All</option>
                <option>Inperson</option>
                <option>Virtual</option>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Type</InputLabel>
              <Select
                native
                value={show_pdf}
                onChange={(e) => setShow_pdf(e.target.value)}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                <option>All</option>
                <option>Generated</option>
                <option>Not Generated</option>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
