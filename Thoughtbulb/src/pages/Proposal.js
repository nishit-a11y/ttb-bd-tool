import React, { useState, useContext, useEffect } from "react";
import "./Proposal.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import inperson_img from "../assets/images/inperson.svg";
import virtual_img from "../assets/images/virtual.svg";
import inperson_img_white from "../assets/images/inperson-white.svg";
import virtual_img_white from "../assets/images/virtual-white.svg";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import Notes from "../components/Notes";


import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  where,
  Timestamp,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import {fire} from "../components/Firebase";
import { Oval } from "react-loader-spinner";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AppContext from "../components/AppContext";
import moment from "moment";
import detectBackButton from "detect-browser-back-navigation";
import { CollectionName, collectionPicker, baseUrl } from "./collection_config";
import SortableList from "../components/SortableList";
import { getAuth, onIdTokenChanged, signOut } from "firebase/auth";


function Proposal() {
  let navigate = useNavigate();
  const db = getFirestore(fire);
  const storage = getStorage(fire);
  const myContext = useContext(AppContext);
  const [custom_obj, setCustom_obj] = useState(false);
  const [inperson, setInperson] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [venue_drawer, setVenue_drawer] = useState(false);
  const [venue_field, setVenue_field] = useState(false);
  const [drawer_venue, setDrawer_venue] = useState("");
  const [venue, setVenue] = useState("");
  const [oneday, setOneday] = useState(false);
  const [twoday, setTwoday] = useState(false);
  const [oneday_virtual, setOneday_virtual] = useState(false);
  const [twoday_virtual, setTwoday_virtual] = useState(false);
  const [expanded, setExpanded] = useState(1);
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [completed3, setCompleted3] = useState(false);
  const [completed4, setCompleted4] = useState(false);
  const [completed5, setCompleted5] = useState(false);
  const [selected_tab, setSelected_tab] = useState(0);
  const [data, setData] = useState([]);
  const [filtered_data, setFiltered_data] = useState([]);
  const [default_games, setDefault_games] = useState(true);
  const [group_a_data, setGroup_a_data] = useState([]);
  const [group_b_data, setGroup_b_data] = useState([]);
  const [outdoor_data, setOutdoor_data] = useState([]);
  const [teambased_data, setTeambased_data] = useState([]);
  const [oneway_data, setOneway_data] = useState([]);
  const [weblink_data, setWeblink_data] = useState([]);
  const [search_field, setSearch_field] = useState("");
  const [inperson_alignment, setInperson_alignment] = useState("groupa");
  const [virtual_alignment, setVirtual_alignment] = useState("teambased");
  const [oneday_time, setOneday_time] = useState("");
  const [oneday_participants, setOneday_participants] = useState(0);
  const [virtual_games, setVirtual_games] = useState([]);
  const [inperson_games, setInperson_games] = useState([]);
  const [selected_games, setSelected_games] = useState([]);
  const [fac_fee, setFac_fee] = useState(0);
  const [trav_fee, setTrav_fee] = useState(0);
  const [change_fac_fee, setChange_fac_fee] = useState(false);
  const [change_trav_fee, setChange_trav_fee] = useState(false);
  const [change_addon, setChange_addon] = useState(false);
  const [addon_desc, setAddon_desc] = useState("");
  const [addon_price, setAddon_price] = useState(0);
  const [addon_val, setAddon_val] = useState(false);
  const [fromEdit, setFromEdit] = useState(false);

  const [change_addon_desc, setChange_addon_desc] = useState(false);
  const [change_addon_fee, setChange_addon_fee] = useState(false);
  const [change_addon_value, setChange_addon_value] = useState(false);
  const [activity_count, setActivity_count] = useState(0);
  const [warn_act_count, setWarn_act_count] = useState(false);
  const [fees_data, setFees_data] = useState([]);
  const [fac_day1_inperson, setFac_day1_inperson] = useState(0);
  const [fac_day2_inperson, setFac_day2_inperson] = useState(0);
  const [fac_teambased_virtual, setFac_teambased_virtual] = useState(0);
  const [fac_oneway_virtual, setFac_oneway_virtual] = useState(0);
  const [fac_weblink_virtual, setFac_weblink_virtual] = useState(0);
  const [warn_company_name, setWarn_company_name] = useState(false);
  const [warn_objective_state, setWarn_objective_state] = useState(false);
  const [warn_objective, setWarn_objective] = useState("");
  const [warn_custom_location, setWarn_custom_location] = useState(false);
  const [people_per_team, setPeople_per_team] = useState(0);
  const [change_material_cost, setChange_material_cost] = useState(null);
  const [local_material_cost, setLocal_material_cost] = useState([]);
  const [warn_inperson_location, setWarn_inperson_location] = useState(false);
  const [warn_inperson_days, setWarn_inperson_days] = useState(false);
  const [warn_inperson_day1, setWarn_inperson_day1] = useState(false);
  const [warn_inperson_day2, setWarn_inperson_day2] = useState(false);
  const [warn_virtual_days, setWarn_virtual_days] = useState(false);
  const [warn_virtual_day1, setWarn_virtual_day1] = useState(false);
  const [warn_virtual_day2, setWarn_virtual_day2] = useState(false);
  const [accordion1, setAccordion1] = useState(false);
  const [accordion2, setAccordion2] = useState(true);
  const [accordion3, setAccordion3] = useState(true);
  const [accordion4, setAccordion4] = useState(true);
  const [accordion5, setAccordion5] = useState(true);
  const [accordion6, setAccordion6] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [selected_games_arr, setSelected_games_arr] = useState([]);

  const [restrict, setRestrict] = useState(false);
  const [warn_inperson_day1_time, setWarn_inperson_day1_time] = useState(false);
  const [warn_inperson_day1_participants, setWarn_inperson_day1_participants] =
    useState(false);
  const [warn_inperson_day1_date, setWarn_inperson_day1_date] = useState(false);
  const [warn_inperson_day2_time, setWarn_inperson_day2_time] = useState(false);
  const [warn_inperson_day2_participants, setWarn_inperson_day2_participants] =
    useState(false);
  const [warn_inperson_day2_date, setWarn_inperson_day2_date] = useState(false);
  const [warn_virtual_day1_time, setWarn_virtual_day1_time] = useState(false);
  const [warn_virtual_day1_participants, setWarn_virtual_day1_participants] =
    useState(false);
  const [warn_virtual_day1_date, setWarn_virtual_day1_date] = useState(false);
  const [warn_virtual_day2_time, setWarn_virtual_day2_time] = useState(false);
  const [warn_virtual_day2_participants, setWarn_virtual_day2_participants] =
    useState(false);
  const [warn_virtual_day2_date, setWarn_virtual_day2_date] = useState(false);
  const [warn_participant_limit, setWarn_participant_limit] = useState(false);
  const [warn_participant_negative, setWarn_participant_negative] =
    useState(false);

  /** added by Praveen for notes for games */
  const [gamesAndNotes, setGamesAndNotes] = useState([])
  
  /* Draft state */
  const [material_cost_fees_draft, setMaterial_cost_fees_draft] =
    useState(null);
  const [facilitation_fee_draft, setFacilitation_fee_draft] = useState(null); // Value of failitation fee is drafted untill the fee is changed in the Pricing b or change in the Number f days in the Event Type tab.
  const [warn_day1_day2, setWarn_day1_day2] = useState(false);

  const [ordered_selected_games, setOrdered_selected_games] = useState([]);

  const cust_obj = ` 1) To drive messages around collaboration in a fun way.\n 2) To work together as a team and connect well with each other.\n 3) To create memories and celebrate oneness.`;

  useEffect(() => {
    // Saving if we have the edited material cost from myContext
    if (myContext.material_cost_fees && myContext.games) {
      let arr = {};
      myContext.material_cost_fees.map((fees, index) => {
        arr[String(myContext.games[index])] = fees;
      });
      setMaterial_cost_fees_draft(arr);
    }
    if (myContext.facilitation_fee) {
      setFacilitation_fee_draft(myContext.facilitation_fee);
    }

    /* commenst added by praveen */
    if(myContext.custom_notes_for_games){

        setGamesAndNotes(JSON.parse(myContext.custom_notes_for_games))
        console.log("Game data is initialized" + myContext.custom_notes_for_games)
        }
  }, []);




  useEffect(() => {
    if (myContext.games.length > 0) {
      setOrdered_selected_games([...myContext.games]);
    }
  }, []);

  useEffect(() => {
    let tempArr = [];
    selected_games.map((gameObj) => {
      if (gameObj.selected) {
        tempArr.push(gameObj);
      }
    });

    if (myContext.games.length > 0 && tempArr.length > 0) {
      let sortedArr = [];
      for (let i = 0; i < myContext.games.length; i++) {
        const item = tempArr.find((obj) => obj.id === myContext.games[i]);
        if (item) {
          sortedArr.push(item);
        }
      }

      // Check tempArr has anything others in it and add at the last of sortedArr
      for (let i = 0; i < tempArr.length; i++) {
        const hasIdInSortedArr = sortedArr.some(
          (elem) => elem.id === tempArr[i].id
        );
        if (!hasIdInSortedArr) {
          sortedArr.push(tempArr[i]);
        }
      }

      tempArr = [...sortedArr];
    }

    setSelected_games_arr(tempArr);

    console.log("selected games changed")
    const nameArray=[];
    tempArr.forEach((x)=>nameArray.push(x.data.game_name));
    console.log(nameArray)
     console.log(nameArray)
    
  }, [selected_games]);

  useEffect(() => {
    detectBackButton(() => {
      if (window.confirm("Continue without saving changes ?")) {
        myContext.setCompany_logo(null);
        myContext.setCompany_name("");
        myContext.setCreated_date("");
        myContext.setDraft(true);
        myContext.setInperson(true);
        myContext.setVirtual(false);
        myContext.setInperson_location("");
        myContext.setInperson_days(0);
        myContext.setInperson_day1_date("");
        myContext.setInperson_day1_time("");
        myContext.setInperson_day1_participants(0);
        myContext.setInperson_day2_date("");
        myContext.setInperson_day2_time("");
        myContext.setInperson_day2_participants(0);
        myContext.setVirtual_days(0);
        myContext.setVirtual_day1_date("");
        myContext.setVirtual_day1_time("");
        myContext.setVirtual_day1_participants(0);
        myContext.setVirtual_day2_date("");
        myContext.setVirtual_day2_time("");
        myContext.setVirtual_day2_participants(0);
        myContext.setDefault_obj(true);
        myContext.setCustom_obj(false);
        myContext.default_obj_info.length = 0;
        myContext.setCustom_obj_info("");
        myContext.games.length = 0;
        myContext.setFacilitation_fee(0);
        myContext.setTravel_stay_meals(0);
        myContext.setAddon_description("");
        myContext.setAddon_fee(0);
        myContext.material_cost_fees.length = 0;
        myContext.setCreated_by("");
        navigate("/admin-dashboard");
      }
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false)
    );
    onSnapshot(q, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          selected: myContext.games.includes(doc.id),
        }))
      );
    });

    const p = query(collection(db, "fees"));
    onSnapshot(p, (querySnapshot) => {
      setFees_data(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);
  // useEffect(()=>{
  //   if(myContext.edit_proposal){
  //     myContext.games.map((id)=>{
  //     select_game(id)

  //     })
  //   }
  // },[data])
  useEffect(() => {
    setFac_fee(myContext.facilitation_fee);
    setTrav_fee(myContext.travel_stay_meals);
    setDrawer_venue(myContext.inperson_location);
    if (myContext.addon_fee !== 0 && myContext.addon_description !== "") {
      setAddon_desc(myContext.addon_description);
      setAddon_price(myContext.addon_fee);
      setChange_addon(false);
      setAddon_val(true);
    }
    myContext.setLoggedin_username(localStorage.getItem("username"));
  }, []);
  useEffect(() => {
    setSelected_games(data);
  }, [data]);
  useEffect(() => {
    const draft_games_array = [];

    selected_games.map((game) => {
      if (game.selected) {
        draft_games_array.push(false);
      }
    });
    setChange_material_cost(draft_games_array);
  }, [selected_games]);
  useEffect(() => {}, [restrict]);
  useEffect(() => {
    setVirtual_games(
      selected_games.filter(
        (value) => value.data.game_type === "Virtual" && !value.data.draft
      )
    );
    setInperson_games(
      selected_games.filter(
        (value) => value.data.game_type === "Inperson" && !value.data.draft
      )
    );
    if (activity_count && selected_games) {
      if (
        selected_games.filter((game) => {
          if (game.selected === true) {
            return game;
          }
        }).length === activity_count
      ) {
        setRestrict(true);
      } else if (
        selected_games.filter((game) => {
          if (game.selected === true) {
            return game;
          }
        }).length < activity_count
      ) {
        setRestrict(false);
        setWarn_act_count(false);
      }
    }
    if (myContext.inperson && myContext.inperson_days == 2) {
      myContext.setFacilitation_fee(
        Number(fac_day1_inperson) + Number(fac_day2_inperson)
      );
    }
  }, [selected_games, activity_count]);
  useEffect(() => {
    setGroup_a_data(
      inperson_games.filter((value) => value.data.category === "Group A")
    );
    setGroup_b_data(
      inperson_games.filter((value) => value.data.category === "Group B")
    );
    setOutdoor_data(
      inperson_games.filter((value) => value.data.category === "Outdoor")
    );
  }, [inperson_alignment, inperson_games]);

  useEffect(() => {
    setTeambased_data(
      virtual_games.filter(
        (value) =>
          value.data.category.toLowerCase() === "Team Based".toLowerCase()
      )
    );
    setOneway_data(
      virtual_games.filter(
        (value) =>
          value.data.category.toLowerCase() === "One-way flow".toLowerCase()
      )
    );
    setWeblink_data(
      virtual_games.filter(
        (value) =>
          value.data.category.toLowerCase() === "Web-link based".toLowerCase()
      )
    );
  }, [virtual_alignment, virtual_games]);

  const handleInpersonToggleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setInperson_alignment(newAlignment);
    }
  };

  const handleVirtualToggleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setVirtual_alignment(newAlignment);
    }
  };

  function go_back() {
    if (window.confirm("Continue without saving changes ?")) {
      myContext.setCompany_logo(null);
      myContext.setCompany_name("");
      myContext.setCreated_date("");
      myContext.setDraft(true);
      myContext.setInperson(true);
      myContext.setVirtual(false);
      myContext.setInperson_location("");
      myContext.setInperson_days(0);
      myContext.setInperson_day1_date("");
      myContext.setInperson_day1_time("");
      myContext.setInperson_day1_participants(0);
      myContext.setInperson_day2_date("");
      myContext.setInperson_day2_time("");
      myContext.setInperson_day2_participants(0);
      myContext.setVirtual_days(0);
      myContext.setVirtual_day1_date("");
      myContext.setVirtual_day1_time("");
      myContext.setVirtual_day1_participants(0);
      myContext.setVirtual_day2_date("");
      myContext.setVirtual_day2_time("");
      myContext.setVirtual_day2_participants(0);
      myContext.setDefault_obj(true);
      myContext.setCustom_obj(false);
      myContext.default_obj_info.length = 0;
      myContext.setCustom_obj_info("");
      myContext.games.length = 0;
      myContext.setFacilitation_fee(0);
      myContext.setTravel_stay_meals(0);
      myContext.setAddon_description("");
      myContext.setAddon_fee(0);
      myContext.material_cost_fees.length = 0;
      myContext.setCreated_by("");
      navigate("/admin-dashboard");
    }
  }

  function client_details_completed() {
    if (myContext.company_name.length < 2) {
      setWarn_company_name(true);
    } else {
      setWarn_company_name(false);
      setCompleted1(true);
      setAccordion2(false);
      setExpanded(2);
    }
  }

  function objectives_completed() {
    if (
      myContext.default_obj_info.length === 0 &&
      myContext.default_obj === true
    ) {
      setWarn_objective("* No objectives selected");
      setWarn_objective_state(true);
    } else if (
      myContext.default_obj_info.length !== 4 &&
      myContext.default_obj === true
    ) {
      setWarn_objective("* Select 4 objectives");
      setWarn_objective_state(true);
    } else if (
      myContext.custom_obj === true &&
      myContext.custom_obj_info.length > 800
    ) {
      setWarn_objective("* Only 800 characters are allowed");
      setWarn_objective_state(true);
    } else if (
      myContext.custom_obj === true &&
      myContext.custom_obj_info.length === 0
    ) {
      setWarn_objective("* Enter the objective");
      setWarn_objective_state(true);
    } else {
      setWarn_objective_state(false);
      setCompleted2(true);
      setAccordion3(false);
      setExpanded(3);
    }
  }

  function event_type_inperson_completed() {
    if (myContext.virtual) {
      reset_activities();
    }
    myContext.setInperson(true);
    myContext.setVirtual(false);

    setPeople_per_team(fees_data[0].data.person_per_team);
    if (
      myContext.inperson_days === 1 &&
      myContext.inperson_day1_participants > 500
    ) {
      // setWarn_participant_limit(true);
      alert("Participant limit is 500");
    } else if (
      (myContext.inperson_days === 2 &&
        myContext.inperson_day1_participants > 500) ||
      myContext.inperson_day2_participants > 500
    ) {
      alert("Participant limit is 500");

      // setWarn_participant_limit(true);
    } else if (myContext.inperson_location.length === 0) {
      setWarn_inperson_location(true);
    } else if (myContext.inperson_days === 0) {
      setWarn_inperson_days(true);
    } else if (
      myContext.inperson_days === 1 &&
      myContext.inperson_day1_time.length === 0
    ) {
      setWarn_inperson_day1_time(true);
    } else if (
      myContext.inperson_days === 1 &&
      myContext.inperson_day1_participants <= 0
    ) {
      setWarn_inperson_day1_participants(true);
    } else if (
      myContext.inperson_days === 1 &&
      myContext.inperson_day1_date.length === 0
    ) {
      setWarn_inperson_day1_date(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day1_time.length !== 0 &&
      myContext.inperson_day1_participants !== 0 &&
      myContext.inperson_day1_date.length !== 0 &&
      (myContext.inperson_day2_time.length === 0 ||
        myContext.inperson_day2_participants.length === 0 ||
        myContext.inperson_day2_date.length === 0)
    ) {
      // setWarn_day1_day2(true);
      alert("Please fill all details for Day 1 and Day 2");
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day2_time.length !== 0 &&
      myContext.inperson_day2_participants !== 0 &&
      myContext.inperson_day2_date.length !== 0 &&
      (myContext.inperson_day1_time.length === 0 ||
        myContext.inperson_day1_participants.length === 0 ||
        myContext.inperson_day1_date.length === 0)
    ) {
      // setWarn_day1_day2(true);
      alert("Please fill all details for Day 1 and Day 2");
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day1_time.length === 0
    ) {
      setWarn_inperson_day1_time(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day1_participants <= 0
    ) {
      setWarn_inperson_day1_participants(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day1_date.length === 0
    ) {
      setWarn_inperson_day1_date(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day2_time.length === 0
    ) {
      setWarn_inperson_day2_time(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day2_participants <= 0
    ) {
      setWarn_inperson_day2_participants(true);
    } else if (
      myContext.inperson_days === 2 &&
      myContext.inperson_day2_date.length === 0
    ) {
      setWarn_inperson_day2_date(true);
    } else {
      setWarn_inperson_location(false);
      setWarn_inperson_days(false);
      setWarn_inperson_day1(false);
      setWarn_inperson_day2(false);
      if (myContext.inperson_days == 1) {
        if (myContext.inperson_day1_participants <= 30) {
          if (myContext.inperson_day1_time === "Full Day") {
            setActivity_count(4);
          }
          if (myContext.inperson_day1_time === "Half Day") {
            setActivity_count(4);
          }
          if (myContext.inperson_day1_time === "Short") {
            setActivity_count(3);
          }
        }

        if (myContext.inperson_day1_participants > 30) {
          if (myContext.inperson_day1_time === "Full Day") {
            setActivity_count(4);
          }
          if (myContext.inperson_day1_time === "Half Day") {
            setActivity_count(3);
          }
          if (myContext.inperson_day1_time === "Short") {
            setActivity_count(3);
          }
        }
      }

      if (myContext.inperson_days == 2) {
        if (
          myContext.inperson_day1_participants <= 30 &&
          myContext.inperson_day2_participants <= 30
        ) {
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(6);
          }
        }

        if (
          myContext.inperson_day1_participants <= 30 &&
          myContext.inperson_day2_participants > 30
        ) {
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(6);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(6);
          }
        }

        if (
          myContext.inperson_day1_participants > 30 &&
          myContext.inperson_day2_participants <= 30
        ) {
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(6);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(6);
          }
        }

        if (
          myContext.inperson_day1_participants > 30 &&
          myContext.inperson_day2_participants > 30
        ) {
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(8);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Full Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(6);
          }
          if (
            myContext.inperson_day1_time === "Half Day" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(6);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Full Day"
          ) {
            setActivity_count(7);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Half Day"
          ) {
            setActivity_count(6);
          }
          if (
            myContext.inperson_day1_time === "Short" &&
            myContext.inperson_day2_time === "Short"
          ) {
            setActivity_count(6);
          }
        }
      }
      if (myContext.inperson_days === 1) {
        // if (myContext.facilitation_fee <= 0) {
        if (
          myContext.inperson_day1_participants <= 50 &&
          myContext.inperson_day1_participants >= 1
        ) {
          myContext.setFacilitation_fee(fees_data[0].data.inperson.day1.slab1);
        } else if (
          myContext.inperson_day1_participants <= 100 &&
          myContext.inperson_day1_participants >= 51
        ) {
          myContext.setFacilitation_fee(fees_data[0].data.inperson.day1.slab2);
        } else if (
          myContext.inperson_day1_participants <= 200 &&
          myContext.inperson_day1_participants >= 101
        ) {
          myContext.setFacilitation_fee(fees_data[0].data.inperson.day1.slab3);
        } else if (
          myContext.inperson_day1_participants <= 350 &&
          myContext.inperson_day1_participants >= 201
        ) {
          myContext.setFacilitation_fee(fees_data[0].data.inperson.day1.slab4);
        } else if (
          myContext.inperson_day1_participants <= 500 &&
          myContext.inperson_day1_participants >= 351
        ) {
          myContext.setFacilitation_fee(fees_data[0].data.inperson.day1.slab5);
        }
        // }
      }

      if (myContext.inperson_days === 2) {
        if (
          myContext.inperson_day1_participants <= 50 &&
          myContext.inperson_day1_participants >= 1
        ) {
          setFac_day1_inperson(fees_data[0].data.inperson.day1.slab1);
        } else if (
          myContext.inperson_day1_participants <= 100 &&
          myContext.inperson_day1_participants >= 51
        ) {
          setFac_day1_inperson(fees_data[0].data.inperson.day1.slab2);
        } else if (
          myContext.inperson_day1_participants <= 200 &&
          myContext.inperson_day1_participants >= 101
        ) {
          setFac_day1_inperson(fees_data[0].data.inperson.day1.slab3);
        } else if (
          myContext.inperson_day1_participants <= 350 &&
          myContext.inperson_day1_participants >= 201
        ) {
          setFac_day1_inperson(fees_data[0].data.inperson.day1.slab4);
        } else if (
          myContext.inperson_day1_participants <= 500 &&
          myContext.inperson_day1_participants >= 351
        ) {
          setFac_day1_inperson(fees_data[0].data.inperson.day1.slab5);
        }

        if (
          myContext.inperson_day2_participants <= 50 &&
          myContext.inperson_day2_participants >= 1
        ) {
          setFac_day2_inperson(fees_data[0].data.inperson.day2.slab1);
        } else if (
          myContext.inperson_day2_participants <= 100 &&
          myContext.inperson_day2_participants >= 51
        ) {
          setFac_day2_inperson(fees_data[0].data.inperson.day2.slab2);
        } else if (
          myContext.inperson_day2_participants <= 200 &&
          myContext.inperson_day2_participants >= 101
        ) {
          setFac_day2_inperson(fees_data[0].data.inperson.day2.slab3);
        } else if (
          myContext.inperson_day2_participants <= 350 &&
          myContext.inperson_day2_participants >= 201
        ) {
          setFac_day2_inperson(fees_data[0].data.inperson.day2.slab4);
        } else if (
          myContext.inperson_day2_participants <= 500 &&
          myContext.inperson_day2_participants >= 351
        ) {
          setFac_day2_inperson(fees_data[0].data.inperson.day2.slab5);
        }
      }
      setCompleted3(true);
      setAccordion4(false);
      setExpanded(4);
    }
  }

  function event_type_virtual_completed() {
    if (myContext.inperson) {
      reset_activities();
    }
    myContext.setVirtual(true);
    myContext.setInperson(false);

    setPeople_per_team(fees_data[0].data.person_per_team);

    if (
      myContext.virtual_days === 1 &&
      myContext.virtual_day1_participants > 500
    ) {
      // setWarn_participant_limit(true);
      alert("Participant limit is 500");
    } else if (
      myContext.virtual_days === 2 &&
      (myContext.virtual_day1_participants > 500 ||
        myContext.virtual_day2_participants > 500)
    ) {
      // setWarn_participant_limit(true);
      alert("Participant limit is 500");
    } else if (myContext.virtual_days === 0) {
      setWarn_virtual_days(true);
    } else if (
      myContext.virtual_days === 1 &&
      myContext.virtual_day1_time.length === 0
    ) {
      setWarn_virtual_day1_time(true);
    } else if (
      myContext.virtual_days === 1 &&
      myContext.virtual_day1_participants <= 0
    ) {
      setWarn_virtual_day1_participants(true);
    } else if (
      myContext.virtual_days === 1 &&
      myContext.virtual_day1_date.length === 0
    ) {
      setWarn_virtual_day1_date(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day1_time.length !== 0 &&
      myContext.virtual_day1_participants !== 0 &&
      myContext.virtual_day1_date.length !== 0 &&
      (myContext.virtual_day2_time.length === 0 ||
        myContext.virtual_day2_participants.length === 0 ||
        myContext.virtual_day2_date.length === 0)
    ) {
      // setWarn_day1_day2(true);
      alert("Please fill all details for Day 1 and Day 2");
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day2_time.length !== 0 &&
      myContext.virtual_day2_participants !== 0 &&
      myContext.virtual_day2_date.length !== 0 &&
      (myContext.virtual_day1_time.length === 0 ||
        myContext.virtual_day1_participants.length === 0 ||
        myContext.virtual_day1_date.length === 0)
    ) {
      // setWarn_day1_day2(true);
      alert("Please fill all details for Day 1 and Day 2");
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day1_time.length === 0
    ) {
      setWarn_virtual_day1_time(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day1_participants <= 0
    ) {
      setWarn_virtual_day1_participants(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day1_date.length <= 0
    ) {
      setWarn_virtual_day1_date(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day2_time.length === 0
    ) {
      setWarn_virtual_day2_time(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day2_participants <= 0
    ) {
      setWarn_virtual_day2_participants(true);
    } else if (
      myContext.virtual_days === 2 &&
      myContext.virtual_day2_date.length === 0
    ) {
      setWarn_virtual_day2_date(true);
    } else {
      if (myContext.virtual_days == 1) {
        if (myContext.virtual_day1_time === "Short") {
          setActivity_count(3);
        }
        if (myContext.virtual_day1_time === "Extended") {
          setActivity_count(4);
        }
      }

      if (myContext.virtual_days == 2) {
        if (
          myContext.virtual_day1_time === "Short" &&
          myContext.virtual_day2_time === "Short"
        ) {
          setActivity_count(6);
        }
        if (
          myContext.virtual_day1_time === "Short" &&
          myContext.virtual_day2_time === "Extended"
        ) {
          setActivity_count(7);
        }
        if (
          myContext.virtual_day1_time === "Extended" &&
          myContext.virtual_day2_time === "Short"
        ) {
          setActivity_count(7);
        }
        if (
          myContext.virtual_day1_time === "Extended" &&
          myContext.virtual_day2_time === "Extended"
        ) {
          setActivity_count(8);
        }
      }

      setCompleted3(true);
      setAccordion4(false);
      setExpanded(4);
    }
  }

  function reset_activities() {
    selected_games.forEach((game) => {
      if (game.selected) {
        game.selected = false;
      }
    });
    setRestrict(false);
    myContext.games.length = 0;
  }

  function activities_completed() {
    setWarn_act_count(false);
    myContext.games.length = 0;
    myContext.material_cost_fees.length = 0;
    myContext.material_cost_games.length = 0;
    // local_material_cost.length = 0;
    setLocal_material_cost([]);

    let local_material_temp_cost = [];

    selected_games_arr.forEach((game) => {
      if (game.selected) {
        myContext.games.push(game.id);
        myContext.material_cost_games.push(game.data.game_name);
        if (myContext.inperson) {
          myContext.material_cost_fees.push(
            get_material_cost(game.data.material_cost, game)
          );
          // local_material_cost.push(get_material_cost(game.data.material_cost));
          local_material_temp_cost.push(
            get_material_cost(game.data.material_cost)
          );
        } else if (myContext.virtual) {
          // Check if draft has the value then assign it
          if (material_cost_fees_draft[game.id]) {
            myContext.material_cost_fees.push(
              material_cost_fees_draft[game.id]
            );
            // local_material_cost.push(
            //   material_cost_fees_draft[game.id]
            // );
            local_material_temp_cost.push(material_cost_fees_draft[game.id]);
          } else {
            if (myContext.virtual_days === 1) {
              if (
                myContext.virtual_day1_participants <= 50 &&
                myContext.virtual_day1_participants >= 1
              ) {
                myContext.material_cost_fees.push(game.data.program_fee[0]);
                // local_material_cost.push(game.data.program_fee[0]);
                local_material_temp_cost.push(game.data.program_fee[0]);
              } else if (
                myContext.virtual_day1_participants <= 100 &&
                myContext.virtual_day1_participants >= 51
              ) {
                myContext.material_cost_fees.push(game.data.program_fee[1]);
                // local_material_cost.push(game.data.program_fee[1]);
                local_material_temp_cost.push(game.data.program_fee[1]);
              } else if (
                myContext.virtual_day1_participants <= 200 &&
                myContext.virtual_day1_participants >= 101
              ) {
                myContext.material_cost_fees.push(game.data.program_fee[2]);
                // local_material_cost.push(game.data.program_fee[2]);
                local_material_temp_cost.push(game.data.program_fee[2]);
              } else if (
                myContext.virtual_day1_participants <= 350 &&
                myContext.virtual_day1_participants >= 201
              ) {
                myContext.material_cost_fees.push(game.data.program_fee[3]);
                // local_material_cost.push(game.data.program_fee[3]);
                local_material_temp_cost.push(game.data.program_fee[3]);
              } else if (
                myContext.virtual_day1_participants <= 500 &&
                myContext.virtual_day1_participants >= 351
              ) {
                myContext.material_cost_fees.push(game.data.program_fee[4]);
                // local_material_cost.push(game.data.program_fee[4]);
                local_material_temp_cost.push(game.data.program_fee[4]);
              }
            } else if (myContext.virtual_days === 2) {
              if (
                myContext.virtual_day1_participants <= 50 &&
                myContext.virtual_day1_participants >= 1
              ) {
                var day1_fee = game.data.program_fee[0];
              } else if (
                myContext.virtual_day1_participants <= 100 &&
                myContext.virtual_day1_participants >= 51
              ) {
                var day1_fee = game.data.program_fee[1];
              } else if (
                myContext.virtual_day1_participants <= 200 &&
                myContext.virtual_day1_participants >= 101
              ) {
                var day1_fee = game.data.program_fee[2];
              } else if (
                myContext.virtual_day1_participants <= 350 &&
                myContext.virtual_day1_participants >= 201
              ) {
                var day1_fee = game.data.program_fee[3];
              } else if (
                myContext.virtual_day1_participants <= 500 &&
                myContext.virtual_day1_participants >= 351
              ) {
                var day1_fee = game.data.program_fee[4];
              }

              if (
                myContext.virtual_day2_participants <= 50 &&
                myContext.virtual_day2_participants >= 1
              ) {
                var day2_fee = game.data.program_fee[0];
              } else if (
                myContext.virtual_day2_participants <= 100 &&
                myContext.virtual_day2_participants >= 51
              ) {
                var day2_fee = game.data.program_fee[1];
              } else if (
                myContext.virtual_day2_participants <= 200 &&
                myContext.virtual_day2_participants >= 101
              ) {
                var day2_fee = game.data.program_fee[2];
              } else if (
                myContext.virtual_day2_participants <= 350 &&
                myContext.virtual_day2_participants >= 201
              ) {
                var day2_fee = game.data.program_fee[3];
              } else if (
                myContext.virtual_day2_participants <= 500 &&
                myContext.virtual_day2_participants >= 351
              ) {
                var day2_fee = game.data.program_fee[4];
              }

              myContext.material_cost_fees.push(
                Number(day1_fee) + Number(day2_fee)
              );
              // local_material_cost.push(Number(day1_fee) + Number(day2_fee));
              local_material_temp_cost.push(
                Number(day1_fee) + Number(day2_fee)
              );
            }
          }
        }
      }
    });

    //Updating the local_material_fees
    setLocal_material_cost(local_material_temp_cost);

    if (myContext.games.length > activity_count) {
      setWarn_act_count(true);
    } else {
      setCompleted4(true);
      setAccordion5(false);
      setExpanded(5);
    }

    if (myContext.virtual && virtual_alignment === "teambased") {
      if (
        myContext.virtual_day1_participants <= 50 &&
        myContext.virtual_day1_participants >= 1
      ) {
        myContext.setFacilitation_fee(
          fees_data[0].data.virtual.teambased.slab1
        );
      } else if (
        myContext.virtual_day1_participants <= 100 &&
        myContext.virtual_day1_participants >= 51
      ) {
        myContext.setFacilitation_fee(
          fees_data[0].data.virtual.teambased.slab2
        );
      } else if (
        myContext.virtual_day1_participants <= 200 &&
        myContext.virtual_day1_participants >= 101
      ) {
        myContext.setFacilitation_fee(
          fees_data[0].data.virtual.teambased.slab3
        );
      } else if (
        myContext.virtual_day1_participants <= 350 &&
        myContext.virtual_day1_participants >= 201
      ) {
        myContext.setFacilitation_fee(
          fees_data[0].data.virtual.teambased.slab4
        );
      } else if (
        myContext.virtual_day1_participants <= 500 &&
        myContext.virtual_day1_participants >= 351
      ) {
        myContext.setFacilitation_fee(
          fees_data[0].data.virtual.teambased.slab5
        );
      }
    }

    if (myContext.virtual && virtual_alignment === "oneway") {
      if (
        myContext.virtual_day1_participants <= 50 &&
        myContext.virtual_day1_participants >= 1
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.oneway.slab1);
      } else if (
        myContext.virtual_day1_participants <= 100 &&
        myContext.virtual_day1_participants >= 51
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.oneway.slab2);
      } else if (
        myContext.virtual_day1_participants <= 200 &&
        myContext.virtual_day1_participants >= 101
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.oneway.slab3);
      } else if (
        myContext.virtual_day1_participants <= 350 &&
        myContext.virtual_day1_participants >= 201
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.oneway.slab4);
      } else if (
        myContext.virtual_day1_participants <= 500 &&
        myContext.virtual_day1_participants >= 351
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.oneway.slab5);
      }
    }

    if (myContext.virtual && virtual_alignment === "weblink") {
      if (
        myContext.virtual_day1_participants <= 50 &&
        myContext.virtual_day1_participants >= 1
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.weblink.slab1);
      } else if (
        myContext.virtual_day1_participants <= 100 &&
        myContext.virtual_day1_participants >= 51
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.weblink.slab2);
      } else if (
        myContext.virtual_day1_participants <= 200 &&
        myContext.virtual_day1_participants >= 101
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.weblink.slab3);
      } else if (
        myContext.virtual_day1_participants <= 350 &&
        myContext.virtual_day1_participants >= 201
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.weblink.slab4);
      } else if (
        myContext.virtual_day1_participants <= 500 &&
        myContext.virtual_day1_participants >= 351
      ) {
        myContext.setFacilitation_fee(fees_data[0].data.virtual.weblink.slab5);
      }
    }
    /* updated by Praveen */
    updateGameNotesBasedOnActivitySelection(myContext.material_cost_games,gamesAndNotes);
      /* updated by Praveen */      
  }

        function updateGameNotesBasedOnActivitySelection(latestSelectedGameNames,previoulsySlectedGames){
          const previousGameNames = new Set(previoulsySlectedGames.map(item => item.name));

          console.log(previousGameNames)
          /*Step 1 preparing a dictonary of id and name first from the names array
          as mycontext.games array has id and latestSleecttedGameNames has only name */
          const idAndNameDIctionary ={}
          latestSelectedGameNames.forEach((name, index) => {
          idAndNameDIctionary[name]=myContext.games[index]
                  });
       
                  console.log(idAndNameDIctionary)

          // Step 2: Create new entries for games that were not there before */
          /* praveen populating more details of the game to help with open ai prompt */
            const newEntries = latestSelectedGameNames
            .filter(name => !previousGameNames.has(name))
            .map(name => {
              const gameObj = selected_games.find(g => g.data.game_name === name);
              console.log("gameObj for", name, gameObj?.data.game_objective, gameObj?.data.key_title1);
              return {
              id:idAndNameDIctionary[name],
              name:name,
              game_objective: gameObj?.data.game_objective || "",
              key_title1: gameObj?.data.key_title1 || "",
              key_description1: gameObj?.data.key_description1 || "",
              key_title2: gameObj?.data.key_title2 || "",
              key_description2: gameObj?.data.key_description2 || "",
              key_title3: gameObj?.data.key_title3 || "",
              key_description3: gameObj?.data.key_description3 || "",
              note: ""
            };
            });
                  console.log(newEntries)

            // Step 3: Merge new entries into filtered firstArray
            const updatedArray = [
            ...previoulsySlectedGames.filter(item => latestSelectedGameNames.includes(item.name)),
            ...newEntries
            ];
    
            console.log('updated games and notes');
          setGamesAndNotes( updatedArray);
    

        }
    function get_material_cost(value, game) {
    if (myContext.inperson && myContext.inperson_days === 1) {
      // Return if it has draft values
      if (game && Object.keys(material_cost_fees_draft).includes(game.id)) {
        return material_cost_fees_draft[game.id];
      }
      return (
        Math.round(myContext.inperson_day1_participants / people_per_team) *
        value
      );
    } else if (myContext.inperson && myContext.inperson_days === 2) {
      // Return if it has draft values
      if (game && Object.keys(material_cost_fees_draft).includes(game.id)) {
        return material_cost_fees_draft[game.id];
      }
      // Return the maximun amount
      if (
        Math.round(myContext.inperson_day1_participants / people_per_team) *
          value >
        Math.round(myContext.inperson_day2_participants / people_per_team) *
          value
      ) {
        return (
          Math.round(myContext.inperson_day1_participants / people_per_team) *
          value
        );
      }
      return (
        Math.round(myContext.inperson_day2_participants / people_per_team) *
        value
      );

      // return (
      //   Math.round(myContext.inperson_day1_participants / people_per_team) *
      //     value +
      //   Math.round(myContext.inperson_day2_participants / people_per_team) *
      //     value
      // );
    } else if (myContext.virtual && myContext.virtual_days === 1) {
      return (
        Math.round(myContext.virtual_day1_participants / people_per_team) *
        value
      );
    } else if (myContext.virtual && myContext.virtual_days === 2) {
      // Return maximum cost

      if (
        Math.round(myContext.virtual_day1_participants / people_per_team) *
          value >
        Math.round(myContext.virtual_day2_participants / people_per_team) *
          value
      ) {
        return (
          Math.round(myContext.virtual_day1_participants / people_per_team) *
          value
        );
      }
      return (
        Math.round(myContext.virtual_day2_participants / people_per_team) *
        value
      );

      // return (
      //   Math.round(myContext.virtual_day1_participants / people_per_team) *
      //     value +
      //   Math.round(myContext.virtual_day2_participants / people_per_team) *
      //     value
      // );
    }
  }

  function set_venue() {
    if (drawer_venue.length === 0) {
      setWarn_custom_location(true);
    } else {
      setWarn_custom_location(false);
      setVenue(drawer_venue);
      setVenue_drawer(false);
      setVenue_field(true);
      myContext.setInperson_location(drawer_venue);
    }
  }

  function add_activity(event, value) {
    if (event.target.checked) {
      myContext.default_obj_info.push(value);
    } else {
      myContext.default_obj_info.splice(
        myContext.default_obj_info.indexOf(value),
        1
      );
    }
  }

  function update_activity_state(value) {
    if (myContext.default_obj_info.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  function isselectedGamesCountMacthingActiveCount() {
    return (
      selected_games.filter((game) => {
        if (game.selected === true) {
          return game;
        }
      }).length >= activity_count
    );
  }

  function select_game(id) {
    // Update the material cost fees draft state -- Remove it from draft if the selection changes
    const material_cost_draft_fees = material_cost_fees_draft;
    let selected_game_name_obj = selected_games.filter(
      (game) => game.id === id
    );
    delete material_cost_draft_fees[selected_game_name_obj[0].id];


    if (!restrict) {
      setSelected_games((prevState) => {
        const updatedState = prevState.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              selected: !item.selected,
            };
          }
          return item;
        });
        return updatedState;
      });
    } else {
      if (
        selected_games[
          selected_games.findIndex((object) => {
            return object.id === id;
          })
        ].selected === true
      ) {
        setSelected_games((prevState) => {
          const updatedState = prevState.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                selected: !item.selected,
              };
            }
            return item;
          });
          return updatedState;
        });
      } else {
        setWarn_act_count(true);
      }
    }
    if (
      selected_games.filter((game) => {
        if (game.selected === true) {
          return game;
        }
      }).length === activity_count
    ) {
      setRestrict(true);
    } else if (
      selected_games.filter((game) => {
        if (game.selected === true) {
          return game;
        }
      }).length < activity_count
    ) {
      setRestrict(false);
      setWarn_act_count(false);

      
      
    }
  }

   /** Added  by Praveen */
   
    const handleGamesListUpdate = (updatedList) => {
            console.log(updatedList)
             setGamesAndNotes(updatedList);
    };


      
    function notes_completed(){
      setCompleted5(true)
      setAccordion6(false)
      setExpanded(6)
       
    console.log("Final notes:", gamesAndNotes);
    const jsonString = JSON.stringify(gamesAndNotes, null, 2);      
    console.log(jsonString)
  }
    /** Added  by Praveen to support notes for activities */

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function generate_pdf() {
    setLoading(true);
    let tempArr = [];
    selected_games_arr.map((gameObj) => {
      if (gameObj.selected) {
        tempArr.push(gameObj.id);
      }
    });
    const final_data = {
      created_by: localStorage.getItem("email"),
      created_by_name: localStorage.getItem("username"),
      company_name: myContext.company_name,
      company_name_small: myContext.company_name.toLowerCase(),
      created_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
      custom_objective: myContext.custom_obj,
      default_objective: myContext.default_obj,
      custom_objective_info: myContext.custom_obj_info,
      default_objective_info: myContext.default_obj_info,
      isDeleted: false,
      draft: false,
      game: tempArr,
      inperson: myContext.inperson,
      virtual: myContext.virtual,
      display_month_only: myContext.display_month_only,
      on_actuals: myContext.on_actuals,
      remove_program_flow: myContext.remove_program_flow,
      inperson_info: {
        days: myContext.inperson_days,
        location: myContext.inperson_location,
        day1: {
          date: myContext.inperson_day1_date,
          time: myContext.inperson_day1_time,
          participants: myContext.inperson_day1_participants,
        },
        day2: {
          date: myContext.inperson_day2_date,
          time: myContext.inperson_day2_time,
          participants: myContext.inperson_day2_participants,
        },
      },
      virtual_info: {
        days: myContext.virtual_days,
        day1: {
          date: myContext.virtual_day1_date,
          time: myContext.virtual_day1_time,
          participants: myContext.virtual_day1_participants,
        },
        day2: {
          date: myContext.virtual_day2_date,
          time: myContext.virtual_day2_time,
          participants: myContext.virtual_day2_participants,
        },
      },

      pricing: {
        facilitation_fee: {
          facilitation: facilitation_fee_draft
            ? facilitation_fee_draft
            : myContext.facilitation_fee,
          travel_stay_meals: myContext.travel_stay_meals,
          addons: {
            description: myContext.addon_description,
            fee: myContext.addon_fee,
          },
        },
        material_cost_games: myContext.material_cost_games,
        material_cost_fees: myContext.material_cost_fees,
      },
      custom_notes:JSON.stringify(gamesAndNotes)    

    };

    if (myContext.edit_proposal) {
      if (myContext.company_logo !== null) {
        const storageRef = ref(
          storage,
          "/company_logos/" +
            Date.now() +
            Math.floor(Math.random() * 9999) +
            myContext.company_logo.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          myContext.company_logo
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => alert(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              final_data.company_logo = url;
              try {
                updateDoc(
                  doc(db, CollectionName.proposals, myContext.proposal_id),
                  final_data
                ).then((doc) => {
                  const url = baseUrl;

                  axios.get(url + `/api/preview/${myContext.proposal_id}`)
                    .then((response) => {
                      const filename = `${myContext.inperson ? "In-person" : "Virtual"} Team Engagement for ${myContext.company_name}`;
                      const printWindow = window.open("", "_blank");
                      if (!printWindow) {
                        alert("Please allow pop-ups to generate the PDF.");
                      } else {
                        const style = `<style>@media print{@page{size:landscape;margin:0}}</style>`;
                        const script = `<script>window.onload=function(){document.title="${filename.replace(/"/g, '\\"')}";setTimeout(window.print,800);}<\/script>`;
                        const html = response.data.replace("</head>", style + "</head>").replace("</body>", script + "</body>");
                        printWindow.document.write(html);
                        printWindow.document.close();
                      }
                      myContext.setCompany_logo(null);
                      myContext.setCompany_name("");
                      myContext.setCreated_date("");
                      myContext.setDraft(true);
                      myContext.setInperson(true);
                      myContext.setVirtual(false);
                      myContext.setInperson_location("");
                      myContext.setInperson_days(0);
                      myContext.setInperson_day1_date("");
                      myContext.setInperson_day1_time("");
                      myContext.setInperson_day1_participants(0);
                      myContext.setInperson_day2_date("");
                      myContext.setInperson_day2_time("");
                      myContext.setInperson_day2_participants(0);
                      myContext.setVirtual_days(0);
                      myContext.setVirtual_day1_date("");
                      myContext.setVirtual_day1_time("");
                      myContext.setVirtual_day1_participants(0);
                      myContext.setVirtual_day2_date("");
                      myContext.setVirtual_day2_time("");
                      myContext.setVirtual_day2_participants(0);
                      myContext.setDefault_obj(true);
                      myContext.setCustom_obj(false);
                      myContext.default_obj_info.length = 0;
                      myContext.setCustom_obj_info("");
                      myContext.games.length = 0;
                      myContext.setFacilitation_fee(0);
                      myContext.setTravel_stay_meals(0);
                      myContext.setAddon_description("");
                      myContext.setAddon_fee(0);
                      myContext.material_cost_fees.length = 0;
                      myContext.setCreated_by("");
                      myContext.setEdit_proposal(false);
                      myContext.setProposal_id("");
                      setLoading(false);
                      alert("PDF Generated Successfully");
                      navigate("/admin-dashboard");
                    })
                    .catch((error) => {});
                });
              } catch (err) {
                alert(err);
              }
            });
          }
        );
      } else {
        try {
          updateDoc(
            doc(db, CollectionName.proposals, myContext.proposal_id),
            final_data
          ).then((docs) => {
            const url = baseUrl;

            axios.get(url + `/api/preview/${myContext.proposal_id}`)
              .then((response) => {
                const filename = `${myContext.inperson ? "In-person" : "Virtual"} Team Engagement for ${myContext.company_name}`;
                const printWindow = window.open("", "_blank");
                if (!printWindow) {
                  alert("Please allow pop-ups to generate the PDF.");
                } else {
                  const style = `<style>@media print{@page{size:landscape;margin:0}}</style>`;
                  const script = `<script>window.onload=function(){document.title="${filename.replace(/"/g, '\\"')}";setTimeout(window.print,800);}<\/script>`;
                  const html = response.data.replace("</head>", style + "</head>").replace("</body>", script + "</body>");
                  printWindow.document.write(html);
                  printWindow.document.close();
                }
                myContext.setCompany_logo(null);
                myContext.setCompany_name("");
                myContext.setCreated_date("");
                myContext.setDraft(true);
                myContext.setInperson(true);
                myContext.setVirtual(false);
                myContext.setInperson_location("");
                myContext.setInperson_days(0);
                myContext.setInperson_day1_date("");
                myContext.setInperson_day1_time("");
                myContext.setInperson_day1_participants(0);
                myContext.setInperson_day2_date("");
                myContext.setInperson_day2_time("");
                myContext.setInperson_day2_participants(0);
                myContext.setVirtual_days(0);
                myContext.setVirtual_day1_date("");
                myContext.setVirtual_day1_time("");
                myContext.setVirtual_day1_participants(0);
                myContext.setVirtual_day2_date("");
                myContext.setVirtual_day2_time("");
                myContext.setVirtual_day2_participants(0);
                myContext.setDefault_obj(true);
                myContext.setCustom_obj(false);
                myContext.default_obj_info.length = 0;
                myContext.setCustom_obj_info("");
                myContext.games.length = 0;
                myContext.setFacilitation_fee(0);
                myContext.setTravel_stay_meals(0);
                myContext.setAddon_description("");
                myContext.setAddon_fee(0);
                myContext.material_cost_fees.length = 0;
                myContext.setCreated_by("");
                myContext.setEdit_proposal(false);
                myContext.setProposal_id("");
                setLoading(false);
                alert("PDF Generated Successfully");
                navigate("/admin-dashboard");
              })
              .catch((error) => {});
          });
        } catch (err) {
          alert(err);
        }
      }
    } else {
      if (myContext.company_logo !== null) {
        const storageRef = ref(
          storage,
          "/company_logos/" +
            Date.now() +
            Math.floor(Math.random() * 9999) +
            myContext.company_logo.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          myContext.company_logo
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => alert(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              final_data.company_logo = url;
              try {
                addDoc(
                  collection(db, CollectionName.proposals),
                  final_data
                ).then((doc) => {
                  const url = baseUrl;

                  axios.get(url + `/api/preview/${doc.id}`)
                    .then((response) => {
                      const filename = `${myContext.inperson ? "In-person" : "Virtual"} Team Engagement for ${myContext.company_name}`;
                      const printWindow = window.open("", "_blank");
                      if (!printWindow) {
                        alert("Please allow pop-ups to generate the PDF.");
                      } else {
                        const style = `<style>@media print{@page{size:landscape;margin:0}}</style>`;
                        const script = `<script>window.onload=function(){document.title="${filename.replace(/"/g, '\\"')}";setTimeout(window.print,800);}<\/script>`;
                        const html = response.data.replace("</head>", style + "</head>").replace("</body>", script + "</body>");
                        printWindow.document.write(html);
                        printWindow.document.close();
                      }
                      myContext.setCompany_logo(null);
                      myContext.setCompany_name("");
                      myContext.setCreated_date("");
                      myContext.setDraft(true);
                      myContext.setInperson(true);
                      myContext.setVirtual(false);
                      myContext.setInperson_location("");
                      myContext.setInperson_days(0);
                      myContext.setInperson_day1_date("");
                      myContext.setInperson_day1_time("");
                      myContext.setInperson_day1_participants(0);
                      myContext.setInperson_day2_date("");
                      myContext.setInperson_day2_time("");
                      myContext.setInperson_day2_participants(0);
                      myContext.setVirtual_days(0);
                      myContext.setVirtual_day1_date("");
                      myContext.setVirtual_day1_time("");
                      myContext.setVirtual_day1_participants(0);
                      myContext.setVirtual_day2_date("");
                      myContext.setVirtual_day2_time("");
                      myContext.setVirtual_day2_participants(0);
                      myContext.setDefault_obj(true);
                      myContext.setCustom_obj(false);
                      myContext.default_obj_info.length = 0;
                      myContext.setCustom_obj_info("");
                      myContext.games.length = 0;
                      myContext.setFacilitation_fee(0);
                      myContext.setTravel_stay_meals(0);
                      myContext.setAddon_description("");
                      myContext.setAddon_fee(0);
                      myContext.material_cost_fees.length = 0;
                      myContext.setCreated_by("");
                      setLoading(false);
                      alert("PDF Generated Successfully");
                      navigate("/admin-dashboard");
                    })
                    .catch((error) => {});
                });
              } catch (err) {
                alert(err);
              }
            });
          }
        );
      } else {
        try {
          addDoc(collection(db, CollectionName.proposals), final_data).then(
            (doc) => {
              const url = baseUrl;

              axios.get(url + `/api/preview/${doc.id}`)
                .then((response) => {
                  const filename = `${myContext.inperson ? "In-person" : "Virtual"} Team Engagement for ${myContext.company_name}`;
                  const printWindow = window.open("", "_blank");
                  if (!printWindow) {
                    alert("Please allow pop-ups to generate the PDF.");
                  } else {
                    const style = `<style>@media print{@page{size:landscape;margin:0}}</style>`;
                    const script = `<script>window.onload=function(){document.title="${filename.replace(/"/g, '\\"')}";setTimeout(window.print,800);}<\/script>`;
                    const html = response.data.replace("</head>", style + "</head>").replace("</body>", script + "</body>");
                    printWindow.document.write(html);
                    printWindow.document.close();
                  }
                  myContext.setCompany_logo(null);
                  myContext.setCompany_name("");
                  myContext.setCreated_date("");
                  myContext.setDraft(true);
                  myContext.setInperson(true);
                  myContext.setVirtual(false);
                  myContext.setInperson_location("");
                  myContext.setInperson_days(0);
                  myContext.setInperson_day1_date("");
                  myContext.setInperson_day1_time("");
                  myContext.setInperson_day1_participants(0);
                  myContext.setInperson_day2_date("");
                  myContext.setInperson_day2_time("");
                  myContext.setInperson_day2_participants(0);
                  myContext.setVirtual_days(0);
                  myContext.setVirtual_day1_date("");
                  myContext.setVirtual_day1_time("");
                  myContext.setVirtual_day1_participants(0);
                  myContext.setVirtual_day2_date("");
                  myContext.setVirtual_day2_time("");
                  myContext.setVirtual_day2_participants(0);
                  myContext.setDefault_obj(true);
                  myContext.setCustom_obj(false);
                  myContext.default_obj_info.length = 0;
                  myContext.setCustom_obj_info("");
                  myContext.games.length = 0;
                  myContext.setFacilitation_fee(0);
                  myContext.setTravel_stay_meals(0);
                  myContext.setAddon_description("");
                  myContext.setAddon_fee(0);
                  myContext.material_cost_fees.length = 0;
                  myContext.setCreated_by("");
                  setLoading(false);
                  alert("PDF Generated Successfully");
                  navigate("/admin-dashboard");
                })
                .catch((error) => {});
            }
          );
        } catch (err) {
          alert(err);
        }
      }
    }
  }

  function save_draft() {
    setLoading(true);

    let tempArr = [];
    selected_games_arr.map((gameObj) => {
      if (gameObj.selected) {
        tempArr.push(gameObj.id);
      }
    });
    if (myContext.company_name.length === 0) {
      alert("No details are entered");
      setLoading(false);
    } else {
      const final_data = {
        created_by: localStorage.getItem("email"),
        company_name: myContext.company_name,
        company_name_small: myContext.company_name.toLowerCase(),

        created_by_name: localStorage.getItem("username"),
        isDeleted: false,
        company_name_small: myContext.company_name.toLowerCase(),
        created_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        custom_objective: myContext.custom_obj,
        default_objective: myContext.default_obj,
        custom_objective_info: myContext.custom_obj_info,
        default_objective_info: myContext.default_obj_info,
        draft: true,
        game: tempArr,
        inperson: myContext.inperson,
        virtual: myContext.virtual,
        display_month_only: myContext.display_month_only,
        on_actuals: myContext.on_actuals,
        remove_program_flow: myContext.remove_program_flow,
        inperson_info: {
          days: myContext.inperson_days,
          location: myContext.inperson_location,
          day1: {
            date: myContext.inperson_day1_date,
            time: myContext.inperson_day1_time,
            participants: myContext.inperson_day1_participants,
          },
          day2: {
            date: myContext.inperson_day2_date,
            time: myContext.inperson_day2_time,
            participants: myContext.inperson_day2_participants,
          },
        },
        virtual_info: {
          days: myContext.virtual_days,
          day1: {
            date: myContext.virtual_day1_date,
            time: myContext.virtual_day1_time,
            participants: myContext.virtual_day1_participants,
          },
          day2: {
            date: myContext.virtual_day2_date,
            time: myContext.virtual_day2_time,
            participants: myContext.virtual_day2_participants,
          },
        },

        pricing: {
          facilitation_fee: {
            facilitation: myContext.facilitation_fee,
            travel_stay_meals: myContext.travel_stay_meals,
            addons: {
              description: myContext.addon_description,
              fee: myContext.addon_fee,
            },
          },
          material_cost_games: myContext.material_cost_games, // Might have to change to tempArr
          material_cost_fees: myContext.material_cost_fees,
        },
        custom_notes:JSON.stringify(gamesAndNotes),    
      };

      if (myContext.edit_proposal) {
        if (myContext.company_logo !== null) {
          const storageRef = ref(
            storage,
            "/company_logos/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              myContext.company_logo.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            myContext.company_logo
          );

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => console.log(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                final_data.company_logo = url;
                try {
                  updateDoc(
                    doc(db, CollectionName.proposals, myContext.proposal_id),
                    final_data
                  ).then(() => {
                    alert("Draft saved");
                    myContext.setCompany_logo(null);
                    myContext.setCompany_name("");
                    myContext.setCreated_date("");
                    myContext.setDraft(true);
                    myContext.setInperson(true);
                    myContext.setVirtual(false);
                    myContext.setInperson_location("");
                    myContext.setInperson_days(0);
                    myContext.setInperson_day1_date("");
                    myContext.setInperson_day1_time("");
                    myContext.setInperson_day1_participants(0);
                    myContext.setInperson_day2_date("");
                    myContext.setInperson_day2_time("");
                    myContext.setInperson_day2_participants(0);
                    myContext.setVirtual_days(0);
                    myContext.setVirtual_day1_date("");
                    myContext.setVirtual_day1_time("");
                    myContext.setVirtual_day1_participants(0);
                    myContext.setVirtual_day2_date("");
                    myContext.setVirtual_day2_time("");
                    myContext.setVirtual_day2_participants(0);
                    myContext.setDefault_obj(true);
                    myContext.setCustom_obj(false);
                    myContext.default_obj_info.length = 0;
                    myContext.setCustom_obj_info("");
                    myContext.games.length = 0;
                    myContext.setFacilitation_fee(0);
                    myContext.setTravel_stay_meals(0);
                    myContext.setAddon_description("");
                    myContext.setAddon_fee(0);
                    myContext.material_cost_fees.length = 0;
                    myContext.setCreated_by("");
                    myContext.setEdit_proposal(false);
                    myContext.setProposal_id("");
                    navigate("/admin-dashboard");
                  });
                } catch (err) {
                  alert(err);
                }
              });
            }
          );
        } else {
          try {
            updateDoc(
              doc(db, CollectionName.proposals, myContext.proposal_id),
              final_data
            ).then(() => {
              alert("Draft Saved");
              myContext.setCompany_logo(null);
              myContext.setCompany_name("");
              myContext.setCreated_date("");
              myContext.setDraft(true);
              myContext.setInperson(true);
              myContext.setVirtual(false);
              myContext.setInperson_location("");
              myContext.setInperson_days(0);
              myContext.setInperson_day1_date("");
              myContext.setInperson_day1_time("");
              myContext.setInperson_day1_participants(0);
              myContext.setInperson_day2_date("");
              myContext.setInperson_day2_time("");
              myContext.setInperson_day2_participants(0);
              myContext.setVirtual_days(0);
              myContext.setVirtual_day1_date("");
              myContext.setVirtual_day1_time("");
              myContext.setVirtual_day1_participants(0);
              myContext.setVirtual_day2_date("");
              myContext.setVirtual_day2_time("");
              myContext.setVirtual_day2_participants(0);
              myContext.setDefault_obj(true);
              myContext.setCustom_obj(false);
              myContext.default_obj_info.length = 0;
              myContext.setCustom_obj_info("");
              myContext.games.length = 0;
              myContext.setFacilitation_fee(0);
              myContext.setTravel_stay_meals(0);
              myContext.setAddon_description("");
              myContext.setAddon_fee(0);
              myContext.material_cost_fees.length = 0;
              myContext.setCreated_by("");
              myContext.setEdit_proposal(false);
              myContext.setProposal_id("");
              navigate("/admin-dashboard");
            });
          } catch (err) {
            alert(err);
          }
        }
      } else {
        if (myContext.company_logo !== null) {
          const storageRef = ref(
            storage,
            "/company_logos/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              myContext.company_logo.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            myContext.company_logo
          );

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => console.log(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                final_data.company_logo = url;
                try {
                  addDoc(
                    collection(db, CollectionName.proposals),
                    final_data
                  ).then(() => {
                    alert("Draft saved");
                    myContext.setCompany_logo(null);
                    myContext.setCompany_name("");
                    myContext.setCreated_date("");
                    myContext.setDraft(true);
                    myContext.setInperson(true);
                    myContext.setVirtual(false);
                    myContext.setInperson_location("");
                    myContext.setInperson_days(0);
                    myContext.setInperson_day1_date("");
                    myContext.setInperson_day1_time("");
                    myContext.setInperson_day1_participants(0);
                    myContext.setInperson_day2_date("");
                    myContext.setInperson_day2_time("");
                    myContext.setInperson_day2_participants(0);
                    myContext.setVirtual_days(0);
                    myContext.setVirtual_day1_date("");
                    myContext.setVirtual_day1_time("");
                    myContext.setVirtual_day1_participants(0);
                    myContext.setVirtual_day2_date("");
                    myContext.setVirtual_day2_time("");
                    myContext.setVirtual_day2_participants(0);
                    myContext.setDefault_obj(true);
                    myContext.setCustom_obj(false);
                    myContext.default_obj_info.length = 0;
                    myContext.setCustom_obj_info("");
                    myContext.games.length = 0;
                    myContext.setFacilitation_fee(0);
                    myContext.setTravel_stay_meals(0);
                    myContext.setAddon_description("");
                    myContext.setAddon_fee(0);
                    myContext.material_cost_fees.length = 0;
                    myContext.setCreated_by("");
                    navigate("/admin-dashboard");
                  });
                } catch (err) {
                  alert(err);
                }
              });
            }
          );
        } else {
          try {
            addDoc(collection(db, CollectionName.proposals), final_data).then(
              () => {
                alert("Draft Saved");
                myContext.setCompany_logo(null);
                myContext.setCompany_name("");
                myContext.setCreated_date("");
                myContext.setDraft(true);
                myContext.setInperson(true);
                myContext.setVirtual(false);
                myContext.setInperson_location("");
                myContext.setInperson_days(0);
                myContext.setInperson_day1_date("");
                myContext.setInperson_day1_time("");
                myContext.setInperson_day1_participants(0);
                myContext.setInperson_day2_date("");
                myContext.setInperson_day2_time("");
                myContext.setInperson_day2_participants(0);
                myContext.setVirtual_days(0);
                myContext.setVirtual_day1_date("");
                myContext.setVirtual_day1_time("");
                myContext.setVirtual_day1_participants(0);
                myContext.setVirtual_day2_date("");
                myContext.setVirtual_day2_time("");
                myContext.setVirtual_day2_participants(0);
                myContext.setDefault_obj(true);
                myContext.setCustom_obj(false);
                myContext.default_obj_info.length = 0;
                myContext.setCustom_obj_info("");
                myContext.games.length = 0;
                myContext.setFacilitation_fee(0);
                myContext.setTravel_stay_meals(0);
                myContext.setAddon_description("");
                myContext.setAddon_fee(0);
                myContext.material_cost_fees.length = 0;
                myContext.setCreated_by("");
                navigate("/admin-dashboard");
              }
            );
          } catch (err) {
            alert(err);
          }
        }
      }
    }
  }

  function participant_limit_close() {
    // setWarn_participant_limit(false);
    alert("Participant limit is 500");
  }

  function day1_day2_close() {
    // setWarn_day1_day2(false);
    alert("Please fill all details for Day 1 and Day 2");
  }

  const onSortEnd = (orderedGames) => {
    setSelected_games_arr(orderedGames);
    //setting setMaterial_cost_games
    myContext.setMaterial_cost_games(
      orderedGames.map((game) => game.data.game_name)
    );
        /* updated by Praveen */
        console.log("updating the games uisng onSortEnd method")
    updateGameNotesBasedOnActivitySelection(myContext.material_cost_games,gamesAndNotes);
      /* updated by Praveen */

  };

  return (
    <>
      {loading && (
        <div className="center-loader " style={{ zIndex: 10 }}>
          <Oval
            height={80}
            width={80}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}

      <div className="container-fluid sec-wrap">
        <Header />
        <Dialog
          className="pop"
          open={warn_participant_limit}
          onClose={participant_limit_close}
        >
          <h5 className="popup-alert">
            Currently we don't support above 500 participants. Contact a Senior
            Consultant for a custom quotation for large groups
          </h5>
          <button
            class="btn btn-primary drawer-submit "
            onClick={participant_limit_close}
          >
            Ok
          </button>
        </Dialog>
        <Dialog className="pop" open={warn_day1_day2} onClose={day1_day2_close}>
          <h5 className="popup-alert">
            Please fill all details for Day 1 and Day 2
          </h5>
          <button
            class="btn btn-primary drawer-submit"
            onClick={day1_day2_close}
          >
            Ok
          </button>
        </Dialog>

        <div className="container-fluid head1">
          <nav className="navbar">
            <h4 class="prop-title">
              <img
                className="back-arrow"
                onClick={go_back}
                src={require("../assets/images/left.png")}
                width={20}
              ></img>
              &nbsp;Create Proposal
            </h4>
            <button class="draft" onClick={save_draft}>
              Save Draft
            </button>
          </nav>
        </div>
        <div className="container-fluid proposal-wrap">
          <Accordion
            sx={{ borderRadius: "6px" }}
            disabled={accordion1}
            expanded={expanded === 1}
            onChange={handleChange(1)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                1. Client Details
              </Typography>
              {completed1 ? (
                <img
                  className="tick"
                  src={require("../assets/images/tick.png")}
                  width={20}
                  height={20}
                ></img>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div class="form-group">
                <label for="formGroupExampleInput" className="labels">
                  Company Name
                </label>
                <input
                  type="text"
                  class="form-control mb-3"
                  id="formGroupExampleInput"
                  value={myContext.company_name}
                  onChange={(e) => myContext.setCompany_name(e.target.value)}
                ></input>
              </div>
              {warn_company_name ? (
                <p className="warning">* Company Name is too short</p>
              ) : (
                ""
              )}
              {/* <div class="form-group">
                        <label for="exampleFormControlFile1" className='labels'>Upload Company Logo</label>
                        <input type="file" class="form-control-file mb-3 upload" id="exampleFormControlFile1" onChange={(e) => myContext.setCompany_logo(e.target.files[0])}></input>
                    </div> */}
              <div className="continue">
                <button
                  class="btn btn-primary continue-button"
                  onClick={client_details_completed}
                >
                  Continue
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          <br></br>
          <Accordion
            sx={{ borderRadius: "6px" }}
            disabled={accordion2}
            expanded={expanded === 2}
            onChange={handleChange(2)}
          >
            <AccordionSummary
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                2. Objectives
              </Typography>
              {completed2 ? (
                <img
                  className="tick"
                  src={require("../assets/images/tick.png")}
                  width={20}
                  height={20}
                ></img>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div className="row mb-2">
                <div className="col">
                  <h6 className="objective-title">
                    What's the purpose of the program
                  </h6>
                  <p className="objective-description">
                    Mandatory: select any of the 04 options (or) Customise your
                    Objective
                  </p>
                </div>
                <div className="col">
                  <div class="form-check form-switch togg">
                    <input
                      class="form-check-input togg-button"
                      type="checkbox"
                      checked={myContext.custom_obj}
                      role="switch"
                      id="flexSwitchCheckDefault"
                      onChange={(e) => {
                        setCustom_obj(!custom_obj);
                        myContext.setCustom_obj(!myContext.custom_obj);
                        myContext.setDefault_obj(!myContext.default_obj);
                        setWarn_objective_state(false);
                      }}
                    ></input>
                    <label
                      class="form-check-label labels"
                      for="flexSwitchCheckDefault"
                    >
                      &nbsp;&nbsp;&nbsp;Custom Objectives
                    </label>
                  </div>
                </div>
              </div>
              {!myContext.custom_obj ? (
                <div className="row row-options">
                  <div className="col">
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDisabled"
                        onChange={(e) => add_activity(e, "Collaboration")}
                        defaultChecked={update_activity_state("Collaboration")}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckDisabled"
                      >
                        &nbsp;&nbsp;Collaboration
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled1"
                        onChange={(e) =>
                          add_activity(e, "Problem Solving Skills")
                        }
                        defaultChecked={update_activity_state(
                          "Problem Solving Skills"
                        )}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled1"
                      >
                        &nbsp;&nbsp;Problem Solving Skills
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled2"
                        onChange={(e) =>
                          add_activity(e, "Innovation and creativity")
                        }
                        defaultChecked={update_activity_state(
                          "Innovation and creativity"
                        )}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled2"
                      >
                        &nbsp;&nbsp;Innovation and creativity
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled3"
                        onChange={(e) => add_activity(e, "Communication")}
                        defaultChecked={update_activity_state("Communication")}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled3"
                      >
                        &nbsp;&nbsp;Communication
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled4"
                        onChange={(e) => add_activity(e, "Networking")}
                        defaultChecked={update_activity_state("Networking")}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled4"
                      >
                        &nbsp;&nbsp;Networking
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDisabled5"
                        onChange={(e) => add_activity(e, "Fun")}
                        defaultChecked={update_activity_state("Fun")}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckDisabled5"
                      >
                        &nbsp;&nbsp;Fun
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled6"
                        onChange={(e) => add_activity(e, "Spark Energy")}
                        defaultChecked={update_activity_state("Spark Energy")}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled6"
                      >
                        &nbsp;&nbsp;Spark Energy
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled7"
                        onChange={(e) =>
                          add_activity(e, "Big Picture Thinking")
                        }
                        defaultChecked={update_activity_state(
                          "Big Picture Thinking"
                        )}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled7"
                      >
                        &nbsp;&nbsp;Big Picture Thinking
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled8"
                        onChange={(e) => add_activity(e, "Analytical Skills")}
                        defaultChecked={update_activity_state(
                          "Analytical Skills"
                        )}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled8"
                      >
                        &nbsp;&nbsp;Analytical Skills
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckCheckedDisabled9"
                        onChange={(e) =>
                          add_activity(e, "Ownership and Accountability")
                        }
                        defaultChecked={update_activity_state(
                          "Ownership and Accountability"
                        )}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexCheckCheckedDisabled9"
                      >
                        &nbsp;&nbsp;Ownership and Accountability
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div class="form-group">
                    <label for="formGroupExampleInput" className="labels">
                      Custom Objectives
                    </label>
                    <textarea
                      class="form-control textarea"
                      style={{ padding: "0px", margin: "0px" }}
                      id="exampleFormControlTextarea1"
                      rows="8"
                      placeholder="1) To drive messages around collaboration in a fun way.
2) To work together as a team and connect well with each other.
3) To create memories and celebrate oneness."
                      onChange={(e) =>
                        myContext.setCustom_obj_info(e.target.value)
                      }
                      defaultValue={
                        myContext.custom_obj_info
                          ? myContext.custom_obj_info
                          : cust_obj
                      }
                    ></textarea>
                    <p className="objective-description">
                      Customize your objective in the given format. Only 800
                      characters are allowed
                    </p>
                  </div>
                </div>
              )}
              {warn_objective_state ? (
                <p className="warning mt-4">{warn_objective}</p>
              ) : (
                ""
              )}
              <div className="continue">
                <button
                  class="btn btn-primary continue-button"
                  onClick={objectives_completed}
                >
                  Continue
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          <br></br>
          <Accordion
            sx={{ borderRadius: "6px" }}
            disabled={accordion3}
            expanded={expanded === 3}
            onChange={handleChange(3)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                3. Event Type
              </Typography>
              {completed3 ? (
                <img
                  className="tick"
                  src={require("../assets/images/tick.png")}
                  width={20}
                  height={20}
                ></img>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              <div className="row mb-2">
                <div className="col">
                  <h6 className="objective-title">
                    Are you looking for an in-person program or a virtual one?
                  </h6>
                  <p className="objective-description">
                    Select the type of the event
                  </p>
                </div>
              </div>

              <Tabs defaultIndex={myContext.inperson ? 0 : 1}>
                <TabList>
                  <Tab value="inperson_tab">
                    <img className="types-img" src={inperson_img}></img>
                    <p className="mt-3 labels types-tab">IN PERSON</p>
                  </Tab>
                  <Tab value="virtual_tab">
                    <img className="types-img" src={virtual_img}></img>
                    <p className="mt-2 labels types-tab">VIRTUAL</p>
                  </Tab>
                </TabList>

                <TabPanel>
                  <div className="col mt-5">
                    <h6 className="objective-title">
                      Where would you like to conduct the activity?
                    </h6>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onClick={(e) => {
                          setVenue_field(false);
                          myContext.setInperson_location("Bangalore");
                          setWarn_inperson_location(false);
                        }}
                        defaultChecked={
                          myContext.inperson_location === "Bangalore"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault1"
                      >
                        &nbsp;&nbsp;Bangalore
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onClick={(e) => {
                          setVenue_field(false);
                          myContext.setInperson_location("Delhi");
                          setWarn_inperson_location(false);
                        }}
                        defaultChecked={myContext.inperson_location === "Delhi"}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault2"
                      >
                        &nbsp;&nbsp;Delhi
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                        onClick={(e) => {
                          setVenue_field(false);
                          myContext.setInperson_location("Mumbai");
                          setWarn_inperson_location(false);
                        }}
                        defaultChecked={
                          myContext.inperson_location === "Mumbai"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault3"
                      >
                        &nbsp;&nbsp;Mumbai
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault4"
                        onClick={(e) => {
                          setVenue_field(!venue_field);
                          setWarn_inperson_location(false);
                          myContext.setInperson_location("");
                        }}
                        defaultChecked={
                          myContext.inperson_location !== "Mumbai" &&
                          myContext.inperson_location !== "Bangalore" &&
                          myContext.inperson_location !== "Delhi" &&
                          myContext.inperson_location !== ""
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault4"
                      >
                        &nbsp;&nbsp;Others
                      </label>
                    </div>
                    {venue_field ||
                    (myContext.inperson_location !== "Mumbai" &&
                      myContext.inperson_location !== "Bangalore" &&
                      myContext.inperson_location !== "Delhi" &&
                      myContext.inperson_location !== "") ? (
                      <input
                        type="text"
                        class="form-control venue-field"
                        id="formGroupExampleInput"
                        onChange={(e) =>
                          myContext.setInperson_location(e.target.value)
                        }
                        defaultValue={myContext.inperson_location}
                      ></input>
                    ) : (
                      ""
                    )}
                    {warn_inperson_location ? (
                      <p className="warning mt-3">* Select the location</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col mt-4">
                    <h6 className="objective-title">
                      For how many days do you want to book the Thought Bulb
                      team?
                    </h6>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault1"
                        id="flexRadioDefault11"
                        onClick={(e) => {
                          setFacilitation_fee_draft(null);
                          setOneday(true);
                          setTwoday(false);
                          myContext.setInperson_days(1);
                          setWarn_inperson_days(false);
                        }}
                        defaultChecked={myContext.inperson_days === 1}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault11"
                      >
                        &nbsp;&nbsp;One Day
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault1"
                        id="flexRadioDefault12"
                        onClick={(e) => {
                          setFacilitation_fee_draft(null);
                          setTwoday(true);
                          setOneday(false);
                          myContext.setInperson_days(2);
                          setWarn_inperson_days(false);
                        }}
                        defaultChecked={myContext.inperson_days === 2}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault12"
                      >
                        &nbsp;&nbsp;Two Days
                      </label>
                    </div>
                    {warn_inperson_days ? (
                      <p className="warning mt-3">* Enter the number of days</p>
                    ) : (
                      ""
                    )}
                  </div>
                  {oneday || myContext.inperson_days === 1 ? (
                    <div className="col mt-4">
                      <h6 className="objective-title">
                        How much time you have for your team engagement?
                      </h6>
                      <div class="form-check activity-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault21"
                          onClick={(e) => {
                            myContext.setInperson_day1_time("Short");
                            setWarn_inperson_day1_time(false);
                          }}
                          defaultChecked={
                            myContext.inperson_day1_time === "Short"
                          }
                        ></input>
                        <label
                          class="form-check-label labels"
                          for="flexRadioDefault21"
                        >
                          &nbsp;&nbsp;Short (01 – 02 hours)
                        </label>
                      </div>
                      <div class="form-check activity-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault22"
                          onClick={(e) => {
                            myContext.setInperson_day1_time("Half Day");
                            setWarn_inperson_day1_time(false);
                          }}
                          defaultChecked={
                            myContext.inperson_day1_time === "Half Day"
                          }
                        ></input>
                        <label
                          class="form-check-label labels"
                          for="flexRadioDefault22"
                        >
                          &nbsp;&nbsp;Half day (02 – 04 hours)
                        </label>
                      </div>
                      <div class="form-check activity-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault23"
                          onClick={(e) => {
                            myContext.setInperson_day1_time("Full Day");
                            setWarn_inperson_day1_time(false);
                          }}
                          defaultChecked={
                            myContext.inperson_day1_time === "Full Day"
                          }
                        ></input>
                        <label
                          class="form-check-label labels"
                          for="flexRadioDefault23"
                        >
                          &nbsp;&nbsp;Full Day (04 – 08 hours)
                        </label>
                      </div>
                      {warn_inperson_day1_time ? (
                        <p className="warning mt-3">* Select the duration</p>
                      ) : (
                        ""
                      )}
                      <div class="form-group">
                        <h6 className="objective-title mt-4">
                          No. of Participants
                        </h6>
                        <input
                          type="number"
                          class="form-control"
                          id="formGroupExampleInput"
                          max={500}
                          onChange={(e) => {
                            myContext.setInperson_day1_participants(
                              e.target.value
                            );
                            setWarn_inperson_day1_participants(false);
                          }}
                          value={myContext.inperson_day1_participants}
                        ></input>
                        <p className="objective-description mb-3">
                          How many awesome participants do you expect?
                        </p>
                      </div>
                      {warn_inperson_day1_participants ? (
                        <p className="warning mt-3">
                          * Number of participants cannot be less than one
                        </p>
                      ) : (
                        ""
                      )}
                      <div class="form-group">
                        <h6 className="objective-title">Date of the Program</h6>
                        {/* <DatePicker defaultValue={new Date(myContext.inperson_day1_date)} onlyMonthPicker onChange={(value)=>myContext.setInperson_day1_date(moment(new Date(value)).format("YYYY-MM"))} /> */}
                        {/* <DatePicker picker="month" onChange={(date, dateString) => { myContext.setInperson_day1_date(dateString); setWarn_inperson_day1_date(false) }} /> */}
                        <input
                          type="date"
                          class="form-control"
                          id="formGroupExampleInput"
                          onChange={(e) => {
                            myContext.setInperson_day1_date(
                              moment(e.target.value).format("YYYY-MM-DD")
                            );
                            setWarn_inperson_day1_date(false);
                          }}
                          defaultValue={myContext.inperson_day1_date}
                        ></input>
                        <p className="objective-description mb-3">
                          Select the date of the program
                        </p>
                      </div>
                      {warn_inperson_day1_date ? (
                        <p className="warning mt-3">
                          * Select the date of event
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {twoday || myContext.inperson_days === 2 ? (
                    <div>
                      <h6 className="objective-title mb-4 mt-4">
                        Schedule your event
                      </h6>
                      <Tabs className="mt-4">
                        <TabList className="tablist">
                          <Tab className="days">
                            <p className="labels types-tab days-para">Day 1</p>
                          </Tab>
                          <Tab className="days">
                            <p className="labels types-tab days-para">Day 2</p>
                          </Tab>
                        </TabList>
                        <TabPanel>
                          <div className="col mt-4">
                            <h6 className="objective-title">
                              How much time you have for your team engagement?
                            </h6>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault4"
                                id="flexRadioDefault31"
                                onClick={(e) => {
                                  myContext.setInperson_day1_time("Short");
                                  setWarn_inperson_day1_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day1_time === "Short"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault31"
                              >
                                &nbsp;&nbsp;Short (01 – 02 hours)
                              </label>
                            </div>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault4"
                                id="flexRadioDefault32"
                                onClick={(e) => {
                                  myContext.setInperson_day1_time("Half Day");
                                  setWarn_inperson_day1_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day1_time === "Half Day"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault32"
                              >
                                &nbsp;&nbsp;Half day (02 – 04 hours)
                              </label>
                            </div>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault4"
                                id="flexRadioDefault33"
                                onClick={(e) => {
                                  myContext.setInperson_day1_time("Full Day");
                                  setWarn_inperson_day1_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day1_time === "Full Day"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault33"
                              >
                                &nbsp;&nbsp;Full Day (04 – 08 hours)
                              </label>
                            </div>
                            {warn_inperson_day1_time ? (
                              <p className="warning mt-3">
                                * Select the duration
                              </p>
                            ) : (
                              ""
                            )}
                            <div class="form-group">
                              <h6 className="objective-title mt-4">
                                No. of Participants
                              </h6>
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                max={500}
                                onChange={(e) => {
                                  myContext.setInperson_day1_participants(
                                    e.target.value
                                  );
                                  setWarn_inperson_day1_participants(false);
                                }}
                                value={myContext.inperson_day1_participants}
                              ></input>
                              <p className="objective-description mb-3">
                                How many awesome participants do you expect?
                              </p>
                            </div>
                            {warn_inperson_day1_participants ? (
                              <p className="warning mt-3">
                                * Number of participants cannot be less than one
                              </p>
                            ) : (
                              ""
                            )}
                            <div class="form-group">
                              <h6 className="objective-title mt-4">
                                Date of the Program
                              </h6>
                              <input
                                type="date"
                                class="form-control"
                                id="formGroupExampleInput"
                                onChange={(e) => {
                                  myContext.setInperson_day1_date(
                                    moment(e.target.value).format("YYYY-MM-DD")
                                  );
                                  setWarn_inperson_day1_date(false);
                                }}
                                defaultValue={myContext.inperson_day1_date}
                              ></input>

                              <p className="objective-description mb-3">
                                Select the date of the program
                              </p>
                            </div>
                            {warn_inperson_day1_date ? (
                              <p className="warning mt-3">
                                * Select the date of event
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div className="col mt-4">
                            <h6 className="objective-title">
                              How much time you have for your team engagement?
                            </h6>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault5"
                                id="flexRadioDefault41"
                                onClick={(e) => {
                                  myContext.setInperson_day2_time("Short");
                                  setWarn_inperson_day2_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day2_time === "Short"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault41"
                              >
                                &nbsp;&nbsp;Short (01 – 02 hours)
                              </label>
                            </div>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault5"
                                id="flexRadioDefault42"
                                onClick={(e) => {
                                  myContext.setInperson_day2_time("Half Day");
                                  setWarn_inperson_day2_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day2_time === "Half Day"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault42"
                              >
                                &nbsp;&nbsp;Half day (02 – 04 hours)
                              </label>
                            </div>
                            <div class="form-check activity-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault5"
                                id="flexRadioDefault43"
                                onClick={(e) => {
                                  myContext.setInperson_day2_time("Full Day");
                                  setWarn_inperson_day2_time(false);
                                }}
                                defaultChecked={
                                  myContext.inperson_day2_time === "Full Day"
                                }
                              ></input>
                              <label
                                class="form-check-label labels"
                                for="flexRadioDefault43"
                              >
                                &nbsp;&nbsp;Full Day (04 – 08 hours)
                              </label>
                            </div>
                            {warn_inperson_day2_time ? (
                              <p className="warning mt-3">
                                * Select the duration
                              </p>
                            ) : (
                              ""
                            )}
                            <div class="form-group">
                              <h6 className="objective-title mt-4">
                                No. of Participants
                              </h6>
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                max={500}
                                onChange={(e) => {
                                  myContext.setInperson_day2_participants(
                                    e.target.value
                                  );
                                  setWarn_inperson_day2_participants(false);
                                }}
                                value={myContext.inperson_day2_participants}
                              ></input>
                              <p className="objective-description mb-3">
                                How many awesome participants do you expect?
                              </p>
                            </div>
                            {warn_inperson_day2_participants ? (
                              <p className="warning mt-3">
                                * Number of participants cannot be less than one
                              </p>
                            ) : (
                              ""
                            )}
                            <div class="form-group">
                              <h6 className="objective-title mt-4">
                                Date of the Program
                              </h6>
                              <input
                                type="date"
                                class="form-control"
                                id="formGroupExampleInput"
                                onChange={(e) => {
                                  myContext.setInperson_day2_date(
                                    moment(e.target.value).format("YYYY-MM-DD")
                                  );
                                  setWarn_inperson_day2_date(false);
                                }}
                                defaultValue={myContext.inperson_day2_date}
                              ></input>

                              <p className="objective-description mb-3">
                                Select the date of the program
                              </p>
                            </div>
                            {warn_inperson_day2_date ? (
                              <p className="warning mt-3">
                                * Select the date of event
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </TabPanel>
                      </Tabs>
                      {warn_inperson_day2 ? (
                        <p className="warning mt-3">
                          * All details are required
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="d-flex" style={{ flexDirection: "column" }}>
                    <h6 className="objective-title mt-4">
                      Proposal configurations
                    </h6>
                    <div
                      className="form-check col-lg-10 activity-check"
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formSelectOnlyMonth"
                        onChange={(e) => {
                          myContext.setdisplay_month_only(
                            !myContext.display_month_only
                          );
                        }}
                        defaultChecked={myContext.display_month_only}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formSelectOnlyMonth"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Display only month in date section
                      </label>
                    </div>
                    <div
                      className="form-check col-lg-10 activity-check "
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formProgramFlow"
                        onChange={(e) => {
                          myContext.setremove_program_flow(
                            !myContext.remove_program_flow
                          );
                        }}
                        defaultChecked={myContext.remove_program_flow}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formProgramFlow"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Omit program flow
                      </label>
                    </div>
                    <div
                      className="form-check col-lg-10 activity-check "
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formOnActuals"
                        onChange={(e) => {
                          myContext.seton_actuals(!myContext.on_actuals);
                        }}
                        defaultChecked={myContext.on_actuals}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formOnActuals"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Travel on actuals
                      </label>
                    </div>
                  </div>
                  <div
                    className="continue col-lg-2 mt-0 mb-4"
                    style={{ float: "right" }}
                  >
                    <button
                      class="btn btn-primary continue-button"
                      onClick={event_type_inperson_completed}
                    >
                      Continue
                    </button>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="col mt-5">
                    <div className="col mt-4">
                      <h6 className="objective-title">
                        For how many days do you want to book the Thought Bulb
                        team?
                      </h6>
                      <div class="form-check activity-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault1"
                          id="flexRadioDefault1"
                          onClick={(e) => {
                            setOneday_virtual(true);
                            setTwoday_virtual(false);
                            myContext.setVirtual_days(1);
                            setWarn_virtual_days(false);
                          }}
                          defaultChecked={myContext.virtual_days === 1}
                        ></input>
                        <label
                          class="form-check-label labels"
                          for="flexRadioDefault1"
                        >
                          &nbsp;&nbsp;One Day
                        </label>
                      </div>
                      <div class="form-check activity-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault1"
                          id="flexRadioDefault2"
                          onClick={(e) => {
                            setTwoday_virtual(true);
                            setOneday_virtual(false);
                            myContext.setVirtual_days(2);
                            setWarn_virtual_days(false);
                          }}
                          defaultChecked={myContext.virtual_days === 2}
                        ></input>
                        <label
                          class="form-check-label labels"
                          for="flexRadioDefault2"
                        >
                          &nbsp;&nbsp;Two Days
                        </label>
                      </div>
                      {warn_virtual_days ? (
                        <p className="warning mt-3">
                          * Enter the number of days
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    {oneday_virtual || myContext.virtual_days === 1 ? (
                      <div className="col mt-4">
                        <h6 className="objective-title">
                          How much time you have for your team engagement?
                        </h6>
                        <div class="form-check activity-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault2"
                            id="flexRadioDefault11"
                            onClick={(e) => {
                              myContext.setVirtual_day1_time("Short");
                              setWarn_virtual_day1_time(false);
                            }}
                            defaultChecked={
                              myContext.virtual_day1_time === "Short"
                            }
                          ></input>
                          <label
                            class="form-check-label labels"
                            for="flexRadioDefault11"
                          >
                            &nbsp;&nbsp;Short program (45 – 60 mins)
                          </label>
                        </div>
                        <div class="form-check activity-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault2"
                            id="flexRadioDefault12"
                            onClick={(e) => {
                              myContext.setVirtual_day1_time("Extended");
                              setWarn_virtual_day1_time(false);
                            }}
                            defaultChecked={
                              myContext.virtual_day1_time === "Extended"
                            }
                          ></input>
                          <label
                            class="form-check-label labels"
                            for="flexRadioDefault12"
                          >
                            &nbsp;&nbsp;Extended program (75 – 120 mins)
                          </label>
                        </div>
                        {warn_virtual_day1_time ? (
                          <p className="warning mt-3">* Select the duration</p>
                        ) : (
                          ""
                        )}
                        <div class="form-group">
                          <h6 className="objective-title mt-4">
                            No. of Participants
                          </h6>
                          <input
                            type="number"
                            class="form-control"
                            id="formGroupExampleInput"
                            max={500}
                            onChange={(e) => {
                              myContext.setVirtual_day1_participants(
                                e.target.value
                              );
                              setWarn_virtual_day1_participants(false);
                            }}
                            value={myContext.virtual_day1_participants}
                          ></input>
                          <p className="objective-description mb-3">
                            How many awesome participants do you expect?
                          </p>
                        </div>
                        {warn_virtual_day1_participants ? (
                          <p className="warning mt-3">
                            * Number of participants cannot be less than one
                          </p>
                        ) : (
                          ""
                        )}
                        <div class="form-group">
                          <h6 className="objective-title mt-4">
                            Date of the Program
                          </h6>
                          <input
                            type="date"
                            class="form-control"
                            id="formGroupExampleInput"
                            onChange={(e) => {
                              myContext.setVirtual_day1_date(
                                moment(e.target.value).format("YYYY-MM-DD")
                              );
                              setWarn_virtual_day1_date(false);
                            }}
                            defaultValue={myContext.virtual_day1_date}
                          ></input>

                          <p className="objective-description mb-3">
                            Select the date of the program
                          </p>
                        </div>
                        {warn_virtual_day1_date ? (
                          <p className="warning mt-3">
                            * Select the date of event
                          </p>
                        ) : (
                          ""
                        )}
                        {warn_virtual_day1 ? (
                          <p className="warning mt-3">
                            * All details are required
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {twoday_virtual || myContext.virtual_days === 2 ? (
                      <div>
                        <h6 className="objective-title mb-4 mt-4">
                          Schedule your event
                        </h6>
                        <Tabs className="mt-4">
                          <TabList className="tablist">
                            <Tab className="days">
                              <p className="labels types-tab days-para">
                                Day 1
                              </p>
                            </Tab>
                            <Tab className="days">
                              <p className="labels types-tab days-para">
                                Day 2
                              </p>
                            </Tab>
                          </TabList>
                          <TabPanel>
                            <div className="col mt-4">
                              <h6 className="objective-title">
                                How much time you have for your team engagement?
                              </h6>
                              <div class="form-check activity-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault2"
                                  id="flexRadioDefault21"
                                  onClick={(e) => {
                                    myContext.setVirtual_day1_time("Short");
                                    setWarn_virtual_day1_time(false);
                                  }}
                                  defaultChecked={
                                    myContext.virtual_day1_time === "Short"
                                  }
                                ></input>
                                <label
                                  class="form-check-label labels"
                                  for="flexRadioDefault21"
                                >
                                  &nbsp;&nbsp;Short program (45 – 60 mins)
                                </label>
                              </div>
                              <div class="form-check activity-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault2"
                                  id="flexRadioDefault22"
                                  onClick={(e) => {
                                    myContext.setVirtual_day1_time("Extended");
                                    setWarn_virtual_day1_time(false);
                                  }}
                                  defaultChecked={
                                    myContext.virtual_day1_time === "Extended"
                                  }
                                ></input>
                                <label
                                  class="form-check-label labels"
                                  for="flexRadioDefault22"
                                >
                                  &nbsp;&nbsp;Extended program (75 – 120 mins)
                                </label>
                              </div>
                              {warn_virtual_day1_time ? (
                                <p className="warning mt-3">
                                  * Select the duration
                                </p>
                              ) : (
                                ""
                              )}
                              <div class="form-group">
                                <h6 className="objective-title mt-4">
                                  No. of Participants
                                </h6>
                                <input
                                  type="number"
                                  class="form-control"
                                  id="formGroupExampleInput"
                                  max={500}
                                  onChange={(e) => {
                                    myContext.setVirtual_day1_participants(
                                      e.target.value
                                    );
                                    setWarn_virtual_day1_participants(false);
                                  }}
                                  value={myContext.virtual_day1_participants}
                                ></input>
                                <p className="objective-description mb-3">
                                  How many awesome participants do you expect?
                                </p>
                              </div>
                              {warn_virtual_day1_participants ? (
                                <p className="warning mt-3">
                                  * Number of participants cannot be less than
                                  one
                                </p>
                              ) : (
                                ""
                              )}
                              <div class="form-group">
                                <h6 className="objective-title mt-4">
                                  Date of the Program
                                </h6>
                                <input
                                  type="date"
                                  class="form-control"
                                  id="formGroupExampleInput"
                                  onChange={(e) => {
                                    myContext.setVirtual_day1_date(
                                      moment(e.target.value).format(
                                        "YYYY-MM-DD"
                                      )
                                    );
                                    setWarn_virtual_day1_date(false);
                                  }}
                                  defaultValue={myContext.virtual_day1_date}
                                ></input>

                                <p className="objective-description mb-3">
                                  Select the date of the program
                                </p>
                              </div>
                              {warn_virtual_day1_date ? (
                                <p className="warning mt-3">
                                  * Select the date of event
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </TabPanel>
                          <TabPanel>
                            <div className="col mt-4">
                              <h6 className="objective-title">
                                How much time you have for your team engagement?
                              </h6>
                              <div class="form-check activity-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault2"
                                  id="flexRadioDefault31"
                                  onClick={(e) => {
                                    myContext.setVirtual_day2_time("Short");
                                    setWarn_virtual_day2_time(false);
                                  }}
                                  defaultChecked={
                                    myContext.virtual_day2_time === "Short"
                                  }
                                ></input>
                                <label
                                  class="form-check-label labels"
                                  for="flexRadioDefault31"
                                >
                                  &nbsp;&nbsp;Short program (45 – 60 mins)
                                </label>
                              </div>
                              <div class="form-check activity-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault2"
                                  id="flexRadioDefault32"
                                  onClick={(e) => {
                                    myContext.setVirtual_day2_time("Extended");
                                    setWarn_virtual_day2_time(false);
                                  }}
                                  defaultChecked={
                                    myContext.virtual_day2_time === "Extended"
                                  }
                                ></input>
                                <label
                                  class="form-check-label labels"
                                  for="flexRadioDefault32"
                                >
                                  &nbsp;&nbsp;Extended program (75 – 120 mins)
                                </label>
                              </div>
                              {warn_virtual_day2_time ? (
                                <p className="warning mt-3">
                                  * Select the duration
                                </p>
                              ) : (
                                ""
                              )}
                              <div class="form-group">
                                <h6 className="objective-title mt-4">
                                  No. of Participants
                                </h6>
                                <input
                                  type="number"
                                  class="form-control"
                                  id="formGroupExampleInput"
                                  max={500}
                                  onChange={(e) => {
                                    myContext.setVirtual_day2_participants(
                                      e.target.value
                                    );
                                    setWarn_virtual_day2_participants(false);
                                  }}
                                  value={myContext.virtual_day2_participants}
                                ></input>
                                <p className="objective-description mb-3">
                                  How many awesome participants do you expect?
                                </p>
                              </div>
                              {warn_virtual_day2_participants ? (
                                <p className="warning mt-3">
                                  * Number of participants cannot be less than
                                  one
                                </p>
                              ) : (
                                ""
                              )}
                              <div class="form-group">
                                <h6 className="objective-title mt-4">
                                  Date of the Program
                                </h6>
                                <input
                                  type="date"
                                  class="form-control"
                                  id="formGroupExampleInput"
                                  onChange={(e) => {
                                    myContext.setVirtual_day2_date(
                                      moment(e.target.value).format(
                                        "YYYY-MM-DD"
                                      )
                                    );
                                    setWarn_virtual_day2_date(false);
                                  }}
                                  defaultValue={myContext.virtual_day2_date}
                                ></input>

                                <p className="objective-description mb-3">
                                  Select the date of the program
                                </p>
                              </div>
                              {warn_virtual_day2_date ? (
                                <p className="warning mt-3">
                                  * Select the date of event
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </TabPanel>
                        </Tabs>
                        {warn_virtual_day2 ? (
                          <p className="warning mt-3">
                            * All details are required
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="d-flex" style={{ flexDirection: "column" }}>
                    <h6 className="objective-title mt-4">
                      Proposal configurations
                    </h6>
                    <div
                      className="form-check col-lg-10 activity-check "
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formSelectOnlyMonthVirtual"
                        onChange={(e) => {
                          myContext.setdisplay_month_only(
                            !myContext.display_month_only
                          );
                        }}
                        defaultChecked={myContext.display_month_only}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formSelectOnlyMonthVirtual"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Display only month in date section
                      </label>
                    </div>
                    <div
                      className="form-check col-lg-10 activity-check "
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formProgramFlowVirtual"
                        onChange={(e) => {
                          myContext.setremove_program_flow(
                            !myContext.remove_program_flow
                          );
                        }}
                        defaultChecked={myContext.remove_program_flow}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formProgramFlowVirtual"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Omit program flow
                      </label>
                    </div>
                    <div
                      className="form-check col-lg-10 activity-check "
                      style={{ paddingBottom: "4px" }}
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name=""
                        id="formOnActualVirtual"
                        onChange={(e) => {
                          myContext.seton_actuals(!myContext.on_actuals);
                        }}
                        defaultChecked={myContext.on_actuals}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formOnActualVirtual"
                        style={{ marginTop: "4px", padding: 0 }}
                      >
                        &nbsp;&nbsp;Travel on actuals
                      </label>
                    </div>
                  </div>
                  <div
                    className="continue col-lg-2 mt-0 mb-4"
                    style={{ float: "right" }}
                  >
                    <button
                      class="btn btn-primary continue-button"
                      onClick={event_type_virtual_completed}
                    >
                      Continue
                    </button>
                  </div>
                </TabPanel>
              </Tabs>
            </AccordionDetails>
          </Accordion>
          <br></br>
          <Accordion
            sx={{ borderRadius: "6px" }}
            disabled={accordion4}
            expanded={expanded === 4}
            onChange={handleChange(4)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                4. Activity selection
              </Typography>
              {completed4 ? (
                <img
                  className="tick"
                  src={require("../assets/images/tick.png")}
                  width={20}
                  height={20}
                ></img>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              {myContext.inperson ? (
                <div className="row activities-tab">
                  <div className="col-9 act-tabs">
                    <ToggleButtonGroup
                      color="primary"
                      value={inperson_alignment}
                      exclusive
                      onChange={handleInpersonToggleChange}
                      aria-label="Platform1"
                    >
                      <ToggleButton className="categ" value="groupa">
                        <p className="labels types-tab days-para">Group A</p>
                        <p className="objective-description types-tab days-para">
                          (Indoor/Outdoor)
                        </p>
                      </ToggleButton>
                      <ToggleButton className="categ" value="groupb">
                        <p className="labels types-tab days-para">Group B</p>
                        <p className="objective-description types-tab days-para">
                          (Indoor/Outdoor)
                        </p>
                      </ToggleButton>
                      <ToggleButton className="categ" value="outdoor">
                        <p className="labels types-tab days-para">Outdoor</p>
                        <p className="objective-description types-tab days-para">
                          &nbsp;
                        </p>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  <div className="col-3 search-col">
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
                  <h6 className="acti-title">
                    Select within {activity_count} activities
                  </h6>
                  {warn_act_count ? (
                    <p className="warning">
                      * Only {activity_count} activities are allowed for the
                      selected duration and participants
                    </p>
                  ) : (
                    ""
                  )}
                  {inperson_alignment === null ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {inperson_games
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {inperson_alignment === "groupa" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {group_a_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {inperson_alignment === "groupb" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {group_b_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {inperson_alignment === "outdoor" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {outdoor_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="row activities-tab">
                  <div className="col-9 act-tabs">
                    <ToggleButtonGroup
                      color="primary"
                      value={virtual_alignment}
                      exclusive
                      onChange={handleVirtualToggleChange}
                      aria-label="Platform2"
                    >
                      <ToggleButton className="categ" value="teambased">
                        <p className="labels types-tab days-para">Team Based</p>
                      </ToggleButton>
                      <ToggleButton className="categ" value="oneway">
                        <p className="labels types-tab days-para">
                          One-way flow
                        </p>
                      </ToggleButton>
                      <ToggleButton className="categ" value="weblink">
                        <p className="labels types-tab days-para">
                          Web-link based
                        </p>
                        <p className="objective-description types-tab days-para">
                          &nbsp;
                        </p>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  <div className="col-3 search-col">
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
                  <h6 className="acti-title">
                    Select any {activity_count} activities
                  </h6>
                  {warn_act_count ? (
                    <p className="warning">
                      * Only {activity_count} activities are allowed for the
                      selected duration and participants
                    </p>
                  ) : (
                    ""
                  )}
                  {virtual_alignment === null ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {virtual_games
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {virtual_alignment === "teambased" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {teambased_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {virtual_alignment === "oneway" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {oneway_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {virtual_alignment === "weblink" ? (
                    <div className="container mt-2">
                      <div className="row activity-row">
                        {weblink_data
                          .filter((value) => {
                            if (search_field === "") {
                              return value;
                            } else if (
                              value.data.game_name
                                .toLowerCase()
                                .includes(search_field.toLowerCase())
                            ) {
                              return value;
                            }
                          })
                          .map((row) => (
                            <div
                              className="col-4 activities mt-3 mb-3"
                              onClick={(e) => select_game(row.id)}
                              style={{
                                backgroundColor: selected_games[
                                  selected_games.findIndex((object) => {
                                    return object.id === row.id;
                                  })
                                ].selected
                                  ? "#FE7300"
                                  : restrict ||
                                    isselectedGamesCountMacthingActiveCount()
                                  ? "#C0C0C0"
                                  : "#F1F2F6",
                              }}
                            >
                              <div className="row pt-4 pb-4 act-title">
                                <div className="col-4">
                                  <img
                                    src={row.data.game_logo}
                                    width={65}
                                    height={65}
                                  ></img>
                                </div>
                                <div className="col-8 activity-heading">
                                  <p
                                    className="objective-title activity-head"
                                    style={{
                                      color: selected_games[
                                        selected_games.findIndex((object) => {
                                          return object.id === row.id;
                                        })
                                      ].selected
                                        ? "white"
                                        : "#1C2C40",
                                    }}
                                  >
                                    {row.data.game_name}
                                  </p>
                                  <br></br>
                                  <div className="act-link">
                                    <a href={row.data.game_url} target="_blank">
                                      <img
                                        src={require("../assets/images/play.png")}
                                        width={20}
                                        height={20}
                                      ></img>
                                    </a>
                                    <p
                                      className="objective-description obj-video"
                                      style={{
                                        color: selected_games[
                                          selected_games.findIndex((object) => {
                                            return object.id === row.id;
                                          })
                                        ].selected
                                          ? "white"
                                          : "#1C2C40",
                                      }}
                                    >
                                      &nbsp;&nbsp;Watch Video
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
              <div className="continue">
                <button
                  class="btn btn-primary continue-button"
                  onClick={activities_completed}
                >
                  Continue
                </button>
              </div>
            </AccordionDetails>
          </Accordion>

          <br></br>
                <Accordion   sx={{ borderRadius: '6px' }}disabled={accordion5} expanded={expanded === 5} onChange={handleChange(5)}>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography fontSize={20} className='accordion-title'>5. Custom Notes</Typography>
                        {completed5 ? <img className='tick' src={require('../assets/images/tick.png')} width={20} height={20}></img> : ""}
                    </AccordionSummary>
                    <AccordionDetails>
                <Notes gamesList={gamesAndNotes} onGamesListUpdate={handleGamesListUpdate} />
                   <div className='continue'><button class="btn btn-primary continue-button" onClick={notes_completed}>Continue</button></div>
                    </AccordionDetails>
                </Accordion>


          <br></br>
          <Accordion
            sx={{ borderRadius: "6px" }}
            disabled={accordion5}
            expanded={expanded === 6}
            onChange={handleChange(6)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                6. Pricing
              </Typography>
              {completed5 ? (
                <img
                  className="tick"
                  src={require("../assets/images/tick.png")}
                  width={20}
                  height={20}
                ></img>
              ) : (
                ""
              )}
            </AccordionSummary>
            <AccordionDetails>
              {myContext.inperson ? (
                <TableContainer component={Paper}>
                  <Table
                    size="larger"
                    aria-label="a dense table"
                    className="table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className="text-nowrap tab-width">
                          FACILITATION FEE
                        </TableCell>
                        <TableCell className="text-nowrap tab-width1">
                          FEE
                        </TableCell>
                        <TableCell>&nbsp;</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell>Facilitation Fee</TableCell>
                        <TableCell>
                          {!change_fac_fee ? (
                            facilitation_fee_draft ? (
                              facilitation_fee_draft
                            ) : myContext.facilitation_fee === "" ? (
                              "0"
                            ) : (
                              myContext.facilitation_fee
                            )
                          ) : (
                            <input
                              type="number"
                              class="form-control"
                              id="formGroupExampleInput"
                              value={
                                facilitation_fee_draft
                                  ? facilitation_fee_draft
                                  : fac_fee
                              }
                              onChange={(e) => {
                                setFacilitation_fee_draft(null);
                                setFac_fee(e.target.value);
                              }}
                            ></input>
                          )}
                        </TableCell>
                        <TableCell>
                          {!change_fac_fee ? (
                            <img
                              alt=""
                              className="edit-table-icons"
                              onClick={(e) => {
                                setFac_fee(
                                  myContext.facilitation_fee === ""
                                    ? "0"
                                    : myContext.facilitation_fee
                                );

                                setChange_fac_fee(true);
                              }}
                              src={require("../assets/images/edit.png")}
                              width={20}
                              height={20}
                            ></img>
                          ) : (
                            <div className="edit-table">
                              <img
                                onClick={(e) => {
                                  myContext.setFacilitation_fee(fac_fee);
                                  setChange_fac_fee(false);
                                }}
                                className="edit-table-icons"
                                src={require("../assets/images/table-tick.png")}
                                width={15}
                                height={15}
                              ></img>
                              <img
                                onClick={(e) => setChange_fac_fee(false)}
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
                        <TableCell>Travel and Stay</TableCell>
                        <TableCell>
                          {myContext.on_actuals ? (
                            "Travel on actuals"
                          ) : !change_trav_fee ? (
                            myContext.travel_stay_meals === "" ? (
                              "0"
                            ) : (
                              myContext.travel_stay_meals
                            )
                          ) : (
                            <input
                              type="number"
                              class="form-control"
                              id="formGroupExampleInput"
                              value={trav_fee}
                              onChange={(e) => {
                                // if (e.target.value === "") {
                                //   setTrav_fee("0");
                                // } else {
                                setTrav_fee(e.target.value);
                                // }
                              }}
                            ></input>
                          )}
                        </TableCell>
                        <TableCell>
                          {myContext.on_actuals ? (
                            ""
                          ) : !change_trav_fee ? (
                            <img
                              className="edit-table-icons"
                              onClick={(e) => {
                                setTrav_fee(
                                  myContext.travel_stay_meals === ""
                                    ? "0"
                                    : myContext.travel_stay_meals
                                );

                                setChange_trav_fee(true);
                              }}
                              src={require("../assets/images/edit.png")}
                              width={20}
                              height={20}
                            ></img>
                          ) : (
                            <div className="edit-table">
                              <img
                                onClick={(e) => {
                                  myContext.setTravel_stay_meals(trav_fee);
                                  setChange_trav_fee(false);
                                }}
                                className="edit-table-icons"
                                src={require("../assets/images/table-tick.png")}
                                width={15}
                                height={15}
                              ></img>
                              <img
                                onClick={(e) => setChange_trav_fee(false)}
                                className="edit-table-icons"
                                src={require("../assets/images/table-cancel.png")}
                                width={15}
                                height={15}
                              ></img>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>

                      {!change_addon && addon_val ? (
                        <TableRow>
                          <TableCell>{myContext.addon_description}</TableCell>
                          <TableCell>
                            {myContext.addon_fee === ""
                              ? "0"
                              : myContext.addon_fee}
                          </TableCell>
                          <TableCell>
                            {!change_addon_value ? (
                              <div className="edit-table-style">
                                <img
                                  className="edit-table-icons"
                                  onClick={(e) => {
                                    setAddon_price(
                                      myContext.addon_fee === ""
                                        ? "0"
                                        : myContext.addon_fee
                                    );
                                    setFromEdit(true);
                                    setAddon_val(false);
                                    setChange_addon(true);
                                  }}
                                  src={require("../assets/images/edit.png")}
                                  width={20}
                                  height={20}
                                ></img>
                                <img
                                  onClick={(e) => {
                                    myContext.setAddon_description("");
                                    myContext.setAddon_fee(0);
                                    setChange_addon(false);
                                    setAddon_val(false);
                                    setAddon_desc("");
                                    setAddon_price(0);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/delete.png")}
                                  width={14}
                                  height={15}
                                ></img>
                              </div>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAddon_description(fac_fee);
                                    setChange_fac_fee(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => {
                                    setChange_fac_fee(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      )}
                    </TableBody>
                  </Table>
                  {!change_addon && !addon_val ? (
                    <p
                      onClick={(e) => setChange_addon(true)}
                      className="addons"
                    >
                      Add Ons (Optional)
                    </p>
                  ) : (
                    ""
                  )}
                  {change_addon && !addon_val ? (
                    <div className="change-addon-form">
                      <div class="form-group">
                        <label for="formGroupExampleInput" className="labels">
                          Add On Title
                        </label>
                        <input
                          type="text"
                          class="form-control mb-3"
                          id="formGroupExampleInput"
                          onChange={(e) => setAddon_desc(e.target.value)}
                          value={addon_desc}
                        ></input>
                      </div>
                      <div class="form-group">
                        <label for="formGroupExampleInput" className="labels">
                          Add On Price
                        </label>
                        <input
                          type="number"
                          class="form-control mb-3"
                          id="formGroupExampleInput"
                          onChange={(e) => {
                            setAddon_price(e.target.value);
                          }}
                          value={addon_price}
                        ></input>
                      </div>
                      {addon_desc === "" && saveClicked && (
                        <p className="warning mt-3">
                          *Please enter a title for the add on{" "}
                        </p>
                      )}
                      <div className="drawer-buttons">
                        <div className="continue">
                          <button
                            class="btn btn-primary drawer-cancel mb-2"
                            onClick={(e) => {
                              setSaveClicked(false);

                              if (fromEdit) {
                                setChange_addon(false);
                                setAddon_val(true);

                                setFromEdit(false);
                              } else {
                                setAddon_val(false);
                                setChange_addon(false);
                                myContext.setAddon_fee(0);
                                setAddon_price(0);
                                setAddon_desc("");
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="continue">
                          <button
                            class="btn btn-primary drawer-submit"
                            onClick={(e) => {
                              if (addon_desc === "") {
                                setSaveClicked(true);
                              } else {
                                setSaveClicked(false);

                                myContext.setAddon_description(addon_desc);
                                myContext.setAddon_fee(addon_price);
                                setAddon_val(true);
                                setChange_addon(false);
                              }
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </TableContainer>
              ) : (
                ""
              )}

              <TableContainer component={Paper}>
                <Table
                  size="larger"
                  aria-label="a dense table"
                  className="table mt-4"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-nowrap tab-width">
                        {myContext.inperson ? "MATERIAL COST" : "PROGRAM FEE"}
                        <span style={{ fontWeight: "400" }}>
                          {" ( Drag and drop to arrange activities )"}
                        </span>
                      </TableCell>
                      <TableCell className="text-nowrap tab-width1">
                        FEE
                      </TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <SortableList
                    items={selected_games_arr}
                    onSortEnd={onSortEnd}
                    change_material_cost={change_material_cost}
                    material_cost_fees={myContext.material_cost_fees}
                    local_material_cost={local_material_cost}
                    setLocal_material_cost={setLocal_material_cost}
                    setChange_material_cost={setChange_material_cost}
                  />
                  {/* <SortableTable /> */}
                  {/* <TableBody>
                    {selected_games
                      .filter((game) => {
                        if (game.selected === true) {
                          return game;
                        }
                      })
                      .map((row, index) => {})}
                  </TableBody> */}
                  {/* <TableBody>
                    {selected_games
                      .filter((game) => {
                        if (game.selected === true) {
                          return game;
                        }
                      })
                      .map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.data.game_name}</TableCell>
                          <TableCell>
                            {!change_material_cost[index] ? (
                              myContext.material_cost_fees[index] === "" ? (
                                "0"
                              ) : (
                                myContext.material_cost_fees[index]
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={local_material_cost[index]}
                                onChange={(e) => {
                                  // local_material_cost[index] = e.target.value;
                                  setLocal_material_cost((prevState) =>
                                    prevState.map((s, i) => {
                                      if (i === index) {
                                        return e.target.value;
                                      }
                                      return s;
                                    })
                                  );
                                }}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_material_cost[index] ? (
                              <img
                                alt=""
                                className="edit-table-icons"
                                onClick={(e) => {
                                  // local_material_cost[index] =
                                  //   myContext.material_cost_fees[index] === ""
                                  //     ? "0"
                                  //     : myContext.material_cost_fees[index];
                                  setLocal_material_cost((prevState) =>
                                    prevState.map((s, i) => {
                                      if (i === index) {
                                        return myContext.material_cost_fees[
                                          index
                                        ] === ""
                                          ? "0"
                                          : myContext.material_cost_fees[index];
                                      }
                                      return s;
                                    })
                                  );

                                  // change_material_cost[index] = true;
                                  setChange_material_cost((prevState) =>
                                    prevState.map((s, i) => {
                                      if (i === index) {
                                        return true;
                                      }
                                      return s;
                                    })
                                  );
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  alt=""
                                  onClick={(e) => {
                                    myContext.material_cost_fees[index] =
                                      local_material_cost[index];
                                    // change_material_cost[index] = false;
                                    setChange_material_cost((prevState) =>
                                      prevState.map((s, i) => {
                                        if (i === index) {
                                          return false;
                                        }
                                        return s;
                                      })
                                    );
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  alt=""
                                  onClick={(e) =>
                                    // (change_material_cost[index] = false)
                                    setChange_material_cost((prevState) =>
                                      prevState.map((s, i) => {
                                        if (i === index) {
                                          return false;
                                        }
                                        return s;
                                      })
                                    )
                                  }
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody> */}
                </Table>
              </TableContainer>
              <div className="continue">
                <button
                  onClick={generate_pdf}
                  class="btn btn-primary continue-button"
                >
                  {loading ? (
                    <div class="spinner-border spinner-border-sm"></div>
                  ) : (
                    "Generate PDF"
                  )}
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <Drawer
          visible={venue_drawer}
          title="Enter the event venue"
          closable={false}
        >
          <div class="form-group">
            <label for="formGroupExampleInput" className="labels">
              Venue
            </label>
            <input
              type="text"
              class="form-control mb-3"
              id="formGroupExampleInput"
              onChange={(e) => setDrawer_venue(e.target.value)}
            ></input>
          </div>
          {warn_custom_location ? (
            <p className="warning">* Enter the location</p>
          ) : (
            ""
          )}
          <div className="drawer-buttons">
            <div className="continue">
              <button
                class="btn btn-primary drawer-cancel"
                onClick={(e) => setVenue_drawer(false)}
              >
                Cancel
              </button>
            </div>
            <div className="continue">
              <button class="btn btn-primary drawer-submit" onClick={set_venue}>
                Submit
              </button>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
}

export default Proposal;
