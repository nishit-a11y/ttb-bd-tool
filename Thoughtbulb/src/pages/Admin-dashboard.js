import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Menu from "@mui/material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faUser,
  faFile,
  faGear,
  faChartLine,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Activity_logo } from "../assets/images/activities.svg";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  endBefore,
  endAt,
  limit,
  startAfter,
  updateDoc,
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
import {fire} from "../../components/Firebase";
import "./Admin-dashboard.css";
import { getDownloadURL } from "firebase/storage";
import moment from "moment";
import axios from "axios";
import { Stack, Chip } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import AppContext from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

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
import { CollectionName, collectionPicker, baseUrl } from "./collection_config";
import { useSelector } from "react-redux";
import DateRangeFilter from "../components/DateRangeFilter";

function Admin_dashboard() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [amortizedSearch, setAmortizedSearch] = useState("");

  const myContext = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [rowId, setRowId] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [lastRecord, setLastRecord] = useState("");
  const [firstRecord, setFirstRecord] = useState("");
  const [loadingPageChange, setLoadingPageChange] = useState(false);

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
  const [created_by_filter, setCreated_by_filter] = useState("All");
  const [pdf_loading, setPdf_loading] = useState([]);
  const [warn_deleted, setWarn_deleted] = useState(false);

  const [proposalsData, setProposalsData] = useState([]);
  let navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
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

  function create_proposal() {
    navigate("/create-proposal");
  }

  function del_proposal(id, confirm) {
    const docRef = doc(db, CollectionName.proposals, id);
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

  function edit_proposal(id) {
    data.forEach((datum) => {
      if (datum.id === id) {
        const info = datum.data;
        console.log("in admin dashboard")
        console.log(info)
  
        myContext.setEdit_proposal(true);
        myContext.setProposal_id(id);
        myContext.setCreated_by(info.created_by);
        myContext.setCompany_logo(null);
        myContext.setCompany_name(info.company_name);
        myContext.setCreated_date(info.created_date);
        myContext.setDraft(info.draft);
        myContext.setInperson(info.inperson);
        myContext.setVirtual(info.virtual);
        myContext.setInperson_location(info.inperson_info.location);
        myContext.setInperson_days(info.inperson_info.days);
        myContext.setInperson_day1_date(info.inperson_info.day1.date);
        myContext.setInperson_day1_time(info.inperson_info.day1.time);
        myContext.setInperson_day1_participants(
          info.inperson_info.day1.participants
        );
        myContext.setInperson_day2_date(info.inperson_info.day2.date);
        myContext.setInperson_day2_time(info.inperson_info.day2.time);
        myContext.setInperson_day2_participants(
          info.inperson_info.day2.participants
        );
        myContext.setVirtual_days(info.virtual_info.days);
        myContext.setVirtual_day1_date(info.virtual_info.day1.date);
        myContext.setVirtual_day1_time(info.virtual_info.day1.time);
        myContext.setVirtual_day1_participants(
          info.virtual_info.day1.participants
        );
        myContext.setVirtual_day2_date(info.virtual_info.day2.date);
        myContext.setVirtual_day2_time(info.virtual_info.day2.time);
        myContext.setVirtual_day2_participants(
          info.virtual_info.day2.participants
        );
        myContext.setDefault_obj(info.default_objective);
        myContext.setCustom_obj(info.custom_objective);
        myContext.setDefault_obj_info(info.default_objective_info);
        myContext.setCustom_obj_info(info.custom_objective_info);

        myContext.setGames(info.game);
        myContext.setFacilitation_fee(
          info.pricing.facilitation_fee.facilitation
        );
        myContext.setTravel_stay_meals(
          info.pricing.facilitation_fee.travel_stay_meals
        );
        myContext.setAddon_description(
          info.pricing.facilitation_fee.addons.description
        );
        myContext.setAddon_fee(info.pricing.facilitation_fee.addons.fee);
        myContext.setMaterial_cost_fees(info.pricing.material_cost_fees);
        myContext.setdisplay_month_only(info.display_month_only);
        myContext.setCustomNotesforGames(info.custom_notes)
        navigate("/create-proposal");
      }
    });
  }

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

  // useEffect(() => {
  //   let users;
  //   users = query(collection(db, "users"));
  //   onSnapshot(users, (querySnapshot) => {
  //     setUsers(
  //       querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }))
  //     );
  //   });
  // }, []);

  console.log("users", users);

  // useEffect(() => {
  //   let q;
  //   if (localStorage.getItem("admin-auth"))
  //     q = query(
  //       collection(db, CollectionName.proposals),
  //       where("isDeleted", "==", false),

  //       orderBy("created_date", "desc")
  //     );
  //   else {
  //     q = query(
  //       collection(db, CollectionName.proposals),
  //       where("isDeleted", "==", false),

  //       where("created_by", "==", localStorage.getItem("email")),
  //       orderBy("created_date", "desc")
  //     );
  //   }

  //   onSnapshot(q, (querySnapshot) => {
  //     setProposalsData(
  //       querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }))
  //     );
  //   });
  // }, [proposalsData]);

  useEffect(() => {
    let q;
    q = query(
      collection(db, CollectionName.proposals),
      where("isDeleted", "==", false)
    );
    // const collectionRef = collection(db, CollectionName.proposals);
    getDocs(q).then((docs) => {
      setTotalDocuments(docs.size);
    });

    if (localStorage.getItem("admin-auth"))
      q = query(
        collection(db, CollectionName.proposals),
        where("isDeleted", "==", false),

        orderBy("created_date", "desc")
      );
    else {
      q = query(
        collection(db, CollectionName.proposals),
        where("isDeleted", "==", false),

        where("created_by", "==", localStorage.getItem("email")),
        orderBy("created_date", "desc")
      );
    }
    snapshot(q);
    onSnapshot(q, (querySnapshot) => {
      setData2(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      // setFiltered_data(
      //   querySnapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     data: doc.data(),
      //   }))
      // );

      if (
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          .length == 0
      ) {
        setFetched(0);
      } else {
        setFetched(1);
      }
    });
  }, [rowId]);

  useEffect(() => {
    if (
      !search_field &&
      show_type === "All" &&
      show_pdf === "All" &&
      created_by_filter === "All" &&
      page === 0
    ) {
      let q;
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          orderBy("created_date", "desc"),
          limit(rowsPerPage)
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          where("created_by", "==", localStorage.getItem("email")),

          orderBy("created_date", "desc"),
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
          setLastRecord(doc.data().created_date);
          if (index === 0) {
            setFirstRecord(doc.data().created_date);
          }
          index++;
        });

        snapshot(q);
      });
    }
  }, [amortizedSearch, show_type, show_pdf, created_by_filter, page]);

  const debouncedSearch = _.debounce((searchField, callback) => {
    setAmortizedSearch(searchField, callback);
  }, 500);
  useEffect(() => {
    debugger;
    let q;
    if (search_field) {
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),

          where("company_name_small", ">=", search_field.toLowerCase()),
          where(
            "company_name_small",
            "<=",
            search_field.toLowerCase() + "\uf8ff"
          ),
          where("isDeleted", "==", false),

          orderBy("company_name_small", "desc")
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          where("created_by", "==", localStorage.getItem("email")),

          where("company_name_small", ">=", search_field.toLowerCase()),
          where(
            "company_name_small",
            "<=",
            search_field.toLowerCase() + "\uf8ff"
          ),
          orderBy("company_name_small", "desc")
        );
      }
    } else if (
      show_type != "All" ||
      show_pdf != "All" ||
      created_by_filter != "All"
    ) {
      console.log("created_by_name", created_by_filter);
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          orderBy("created_date", "desc")
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),
          where("created_by", "==", localStorage.getItem("email")),
          orderBy("created_date", "desc")
        );
      }

      if (show_type != "All") {
        q = query(
          q,
          where("virtual", "==", show_type === "Virtual" ? true : false)
        );
      }
      if (show_pdf != "All") {
        q = query(
          q,
          where("draft", "==", show_pdf === "Not Generated" ? true : false)
        );
      }
      if (created_by_filter != "All") {
        q = query(q, where("created_by_name", "==", created_by_filter));
      }

      // if (
      //   show_type != "All" &&
      //   show_pdf != "All" &&
      //   created_by_filter != "All"
      // ) {
      //   if (localStorage.getItem("admin-auth")) {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("virtual", "==", show_type === "Virtual" ? true : false),
      //       where("draft", "==", show_pdf === "Not Generated" ? true : false),
      //       where("created_by_name", "==", created_by_filter),
      //       orderBy("created_date", "desc")
      //     );
      //   } else {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("created_by", "==", localStorage.getItem("email")),
      //       where("virtual", "==", show_type === "Virtual" ? true : false),
      //       where("draft", "==", show_pdf === "Not Generated" ? true : false),
      //       orderBy("created_date", "desc")
      //     );
      //   }
      // } else if (show_type != "All") {
      //   if (localStorage.getItem("admin-auth")) {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("virtual", "==", show_type === "Virtual" ? true : false),
      //       orderBy("created_date", "desc")
      //     );
      //   } else {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("created_by", "==", localStorage.getItem("email")),
      //       where("virtual", "==", show_type === "Virtual" ? true : false),
      //       orderBy("created_date", "desc")
      //     );
      //   }
      // } else if (show_pdf != "All") {
      //   if (localStorage.getItem("admin-auth")) {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("draft", "==", show_pdf === "Not Generated" ? true : false),
      //       orderBy("created_date", "desc")
      //     );
      //   } else {
      //     q = query(
      //       collection(db, CollectionName.proposals),
      //       where("isDeleted", "==", false),
      //       where("created_by", "==", localStorage.getItem("email")),
      //       where("draft", "==", show_pdf === "Not Generated" ? true : false),
      //       orderBy("created_date", "desc")
      //     );
      //   }
      // }
    } else {
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          orderBy("created_date", "desc"),
          limit(rowsPerPage)
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          where("created_by", "==", localStorage.getItem("email")),

          orderBy("created_date", "desc"),
          limit(rowsPerPage)
        );
      }
    }
    getDocs(q).then((docs) => {
      if (docs.docs.length < 1) {
        setFiltered_data([]);

        return;
      }
      let index = 0;

      docs.forEach((doc) => {
        setLastRecord(doc.data().created_date);
        if (index === 0) {
          setFirstRecord(doc.data().created_date);
        }
        index++;
      });

      snapshot(q);
    });
  }, [rowsPerPage, search_field, show_type, show_pdf, created_by_filter]);
  const changePage = (action) => {
    let q;

    if (action === "next") {
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          orderBy("created_date", "desc"),
          limit(rowsPerPage),
          startAfter(lastRecord)
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          where("created_by", "==", localStorage.getItem("email")),
          orderBy("created_date", "desc"),
          limit(rowsPerPage),
          startAfter(lastRecord)
        );
      }
    } else {
      if (localStorage.getItem("admin-auth")) {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          orderBy("created_date", "desc"),
          limitToLast(rowsPerPage),
          endBefore(firstRecord)
        );
      } else {
        q = query(
          collection(db, CollectionName.proposals),
          where("isDeleted", "==", false),

          where("created_by", "==", localStorage.getItem("email")),

          orderBy("created_date", "desc"),
          limitToLast(rowsPerPage),
          endBefore(firstRecord)
        );
      }
    }
    getDocs(q).then((docs) => {
      let index = 0;
      docs.forEach((doc) => {
        setLastRecord(doc.data().created_date);
        if (index === 0) {
          setFirstRecord(doc.data().created_date);
        }
        index++;
      });

      snapshot(q);
    });
  };
  useEffect(() => {
    setCreated_proposals(data2.length);

    setProposals_in_process(
      data2.filter((value) => {
        if (value.data.draft === true) {
          return value;
        }
      }).length
    );

    setProposals_completed(
      data2.filter((value) => {
        if (value.data.draft === false) {
          return value;
        }
      }).length
    );
  });

  console.log("filteredData", filtered_data);

  function get_pdf(id, index, company_name, program_type) {
    const new_arr = [...pdf_loading];
    new_arr[index] = true;
    setPdf_loading(new_arr);
    const url = baseUrl;

    axios.get(url + `/api/preview/${id}`)
      .then((response) => {
        const filename = `${program_type} Team Engagement for ${company_name}`;
        if (!response.data || response.data.length < 10) {
          alert("Preview returned empty content. Please try again.");
          const new_arr = [...pdf_loading];
          new_arr[index] = false;
          setPdf_loading(new_arr);
          return;
        }
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          alert("Please allow pop-ups for this site to generate the PDF.");
        } else {
          const style = `<style>*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important;}@media print{@page{size:1080px 608px;margin:0}}</style>`;
          const script = `<script>window.onload=function(){document.title="${filename.replace(/"/g, '\\"')}";setTimeout(window.print,800);}<\/script>`;
          const html = response.data
            .replace("</head>", style + "</head>")
            .replace("</body>", script + "</body>");
          printWindow.document.write(html);
          printWindow.document.close();
        }
        const new_arr = [...pdf_loading];
        new_arr[index] = false;
        setPdf_loading(new_arr);
      })
      .catch((error) => {
        alert("PDF generation failed: " + (error.response?.data || error.message));
        const new_arr = [...pdf_loading];
        new_arr[index] = false;
        setPdf_loading(new_arr);
      });
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
      isActive: true,
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

  const sidebar_menu_items_bd = [
    {
      label: "Proposals",
      icon: <FontAwesomeIcon icon={faFile} />,
      navigateOnClick: "/admin-dashboard",
      isActive: true,
    },
    {
      label: "Activities",
      icon: <FontAwesomeIcon icon={faPeopleGroup} />,
      navigateOnClick: "/activities",
    },
  ];

  function proposal_deleted_close() {
    setWarn_deleted(false);
  }

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log("Selected option:", option);
  };

  const options = [];
  users &&
    users.map((user) =>
      options.push({ label: user.data.username, value: user.data.username })
    );

  const handleFilter = (filterData) => {
    console.log("Filter data:", filterData);
  };

  return (
    <div>
      <Dialog
        className="pop"
        open={warn_deleted}
        onClose={proposal_deleted_close}
      >
        <h5 className="popup-alert">
          {" "}
          Are you sure you want to delete this Proposal?
        </h5>
        <div className="d-flex justify-content-center gap-2 px-3">
          {" "}
          <button
            class="flex btn btn-primary drawer-submit "
            style={{ width: "100px" }}
            onClick={proposal_deleted_close}
            disabled={rowId && confirmDeletion}
          >
            No{" "}
          </button>
          <button
            style={{ width: "100px" }}
            class="flex btn btn-primary drawer-submit "
            disabled={rowId && confirmDeletion}
            onClick={() => {
              setConfirmDeletion(true);
              del_proposal(rowId, true);
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
            {/* <div className="content-section float-right"> */}
            {fetched === 1 ? (
              <div className="container-fluid table-section ">
                <div className="analytics">
                  <div className="insights-div">
                    <img src={require("../assets/images/insights.png")}></img>
                    <h5 className="insights">&nbsp;&nbsp;Insights</h5>
                    {/* <div className="ms-2 text-black-50">Last 7 days</div> */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      border: "1px",
                      "justify-content": "space-evenly",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        margin: "10px",
                        flex: 0.75,
                      }}
                    >
                      <h6 className="analyt-title">Proposals Created</h6>

                      <h3 className="analyt-value">{created_proposals}</h3>
                    </div>
                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        margin: "10px",
                        flex: 0.75,
                      }}
                    >
                      <h6 className="analyt-title">Proposals In-Process</h6>
                      <h3 className="analyt-value">{proposals_in_process}</h3>
                    </div>
                    <div
                      style={{
                        border: "1px solid lightgray",
                        padding: "10px",
                        margin: "10px",
                        flex: 0.75,
                      }}
                    >
                      <h6 className="analyt-title">Proposals Completed</h6>
                      <h3 className="analyt-value">{proposals_completed}</h3>
                    </div>
                    {/* <div className="col-md-2 columns roundedborder">
                      <h6 className="analyt-title">Total Proposals Value</h6>
                      <h3 className="analyt-value">360K</h3>
                    </div> */}
                  </div>
                </div>
                <div className="container-fluid table-head">
                  <div className="row">
                    <div className="col-lg-8 d-flex justify-content-between col-md-6 table-title-wrap">
                      <h6 id="table-title">Proposals</h6>
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
                        {show_pdf != "All" && (
                          <Chip
                            label={show_pdf}
                            onDelete={() => {
                              setShow_pdf("All");
                            }}
                          />
                        )}
                        {created_by_filter != "All" && (
                          <Chip
                            label={created_by_filter}
                            onDelete={() => {
                              setCreated_by_filter("All");
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
                    {/* <div>
                      <DateRangeFilter onFilter={handleFilter} />
                    </div> */}
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
                                setShow_pdf("All");
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
                          <TableCell className="text-nowrap">
                            Company Name
                          </TableCell>
                          <TableCell className="text-nowrap">
                            Participants
                          </TableCell>
                          <TableCell className="text-nowrap">Type</TableCell>
                          <TableCell className="text-nowrap">
                            Duration
                          </TableCell>
                          <TableCell className="text-nowrap">Venue</TableCell>
                          <TableCell className="text-nowrap">PDF</TableCell>
                          <TableCell className="text-nowrap">
                            Created On
                          </TableCell>
                          <TableCell className="text-nowrap">
                            Created By
                          </TableCell>
                          <TableCell className="text-nowrap">
                            Intervention Date
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
                          //     value.data.company_name
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
                                <div
                                  className="com-name"
                                  title={row.data.company_name}
                                >
                                  {row.data.company_name}
                                </div>
                              </TableCell>
                              <TableCell>
                                {row.data.inperson &&
                                row.data.inperson_info.days == 1
                                  ? row.data.inperson_info.day1.participants
                                  : ""}
                                {row.data.inperson &&
                                row.data.inperson_info.days == 2
                                  ? row.data.inperson_info.day1.participants +
                                    " / " +
                                    row.data.inperson_info.day2.participants
                                  : ""}
                                {row.data.virtual &&
                                row.data.virtual_info.days == 1
                                  ? row.data.virtual_info.day1.participants
                                  : ""}
                                {row.data.virtual &&
                                row.data.virtual_info.days == 2
                                  ? row.data.virtual_info.day1.participants +
                                    " / " +
                                    row.data.virtual_info.day2.participants
                                  : ""}
                              </TableCell>
                              <TableCell>
                                <div className="wrapping">
                                  {row.data.inperson ? "In-Person" : "Virtual"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="wrapping">
                                  {row.data.inperson &&
                                  row.data.inperson_info.days == 1
                                    ? row.data.inperson_info.day1.time
                                    : ""}
                                  {row.data.inperson &&
                                  row.data.inperson_info.days == 2
                                    ? row.data.inperson_info.day1.time +
                                      " / " +
                                      row.data.inperson_info.day2.time
                                    : ""}
                                  {row.data.virtual &&
                                  row.data.virtual_info.days == 1
                                    ? row.data.virtual_info.day1.time
                                    : ""}
                                  {row.data.virtual &&
                                  row.data.virtual_info.days == 2
                                    ? row.data.virtual_info.day1.time +
                                      " / " +
                                      row.data.virtual_info.day2.time
                                    : ""}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className="com-name "
                                  title={row.data.inperson_info.location}
                                >
                                  {row.data.inperson
                                    ? row.data.inperson_info.location
                                    : ""}
                                </div>
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
                                      get_pdf(
                                        row.id,
                                        index,
                                        row.data.company_name,
                                        row.data.inperson
                                          ? "In-Person"
                                          : "Virtual"
                                      );
                                    }}
                                    src={require("../assets/images/pdf.png")}
                                    width={20}
                                  ></img>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="wrapping">
                                  {moment(
                                    new Date(row.data.created_date)
                                  ).format("ll")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="com-name">
                                  {row.data.created_by_name}
                                </div>
                              </TableCell>

                              <TableCell>
                                {row.data.inperson &&
                                row.data.inperson_info.days == 1
                                  ? moment(
                                      new Date(row.data.inperson_info.day1.date)
                                    ).format("ll")
                                  : ""}
                                {row.data.inperson &&
                                row.data.inperson_info.days == 2
                                  ? moment(
                                      new Date(row.data.inperson_info.day1.date)
                                    ).format("ll") +
                                    " / " +
                                    moment(
                                      new Date(row.data.inperson_info.day2.date)
                                    ).format("ll")
                                  : ""}
                                {row.data.virtual &&
                                row.data.virtual_info.days == 1
                                  ? moment(
                                      new Date(row.data.virtual_info.day1.date)
                                    ).format("ll")
                                  : ""}
                                {row.data.virtual &&
                                row.data.virtual_info.days == 2
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
                                            edit_proposal(row.id);
                                          }}
                                        >
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          onClick={(e) => {
                                            del_proposal(row.id, false);
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
                {!search_field &&
                  show_type === "All" &&
                  show_pdf === "All" &&
                  !loadingPageChange && (
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

            <Dialog
              disableEscapeKeyDown
              open={filter_open}
              onClose={handleClose}
              id="dialog-filter"
            >
              <DialogTitle>Filters</DialogTitle>
              <DialogContent>
                <Box
                  component="form"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel htmlFor="demo-dialog-native">Type</InputLabel>
                      <Select
                        native
                        value={show_type}
                        onChange={(e) => {
                          setShow_type(e.target.value);
                          // setShow_pdf("All");
                        }}
                        input={
                          <OutlinedInput label="Age" id="demo-dialog-native" />
                        }
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
                        onChange={(e) => {
                          setShow_pdf(e.target.value);
                          // setShow_type("All");
                        }}
                        input={
                          <OutlinedInput label="Age" id="demo-dialog-native" />
                        }
                      >
                        <option>All</option>
                        <option>Generated</option>
                        <option>Not Generated</option>
                      </Select>
                    </FormControl>

                    {/* new filters */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel htmlFor="demo-dialog-native">
                        Created by
                      </InputLabel>
                      <Select
                        native
                        value={created_by_filter}
                        onChange={(e) => {
                          setCreated_by_filter(e.target.value);
                          // setShow_type("All");
                        }}
                        input={
                          <OutlinedInput
                            label="Createdby"
                            id="demo-dialog-native"
                          />
                        }
                      >
                        <option>All</option>
                        {options.map((option) => (
                          <option>{option.value}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div style={{ paddingTop: "10px", margin: "8px" }}>
                    <DateRangeFilter onFilter={handleFilter} />
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(e) => {
                    setShow_pdf("All");
                    setShow_type("All");
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Ok</Button>
              </DialogActions>
            </Dialog>
            {/* </div> */}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default Admin_dashboard;
