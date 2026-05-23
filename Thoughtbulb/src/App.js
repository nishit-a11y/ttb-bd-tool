import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import Admin_dashboard from "./pages/Admin-dashboard_new";
import Forgot from "./pages/Forgot";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AppContext from "./components/AppContext";
// import Activities from "./pages/Activities";
import Activities from "./pages/Activities/index";

import Users from "./pages/Users";
// import Users from "./pages/Users/index";

import Create_activity from "./pages/Create-activity";
import CreateActivity from "./pages/CreateActivity/index";
import Create_user from "./pages/Create-user";
import Settings from "./pages/Settings";
import moment from "moment";
import "@fontsource/inter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useUserAuthenticator from "./userAuthenticator";

function App() {
  //Proposal Data
 /**Added by Praveen for the autologout feature */
  useUserAuthenticator();
 
  const [company_logo, setCompany_logo] = useState(null);
  const [company_name, setCompany_name] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [draft, setDraft] = useState(true);
  const [inperson, setInperson] = useState(true);
  const [virtual, setVirtual] = useState(false);
  const [inperson_location, setInperson_location] = useState("");
  const [inperson_days, setInperson_days] = useState(0);
  const [inperson_day1_date, setInperson_day1_date] = useState("");
  const [inperson_day1_time, setInperson_day1_time] = useState("");
  const [inperson_day1_participants, setInperson_day1_participants] =
    useState(0);
  const [inperson_day2_date, setInperson_day2_date] = useState("");
  const [inperson_day2_time, setInperson_day2_time] = useState("");
  const [inperson_day2_participants, setInperson_day2_participants] =
    useState(0);
  const [virtual_days, setVirtual_days] = useState(0);
  const [virtual_day1_date, setVirtual_day1_date] = useState("");
  const [virtual_day1_time, setVirtual_day1_time] = useState("");
  const [virtual_day1_participants, setVirtual_day1_participants] = useState(0);
  const [virtual_day2_date, setVirtual_day2_date] = useState("");
  const [virtual_day2_time, setVirtual_day2_time] = useState("");
  const [virtual_day2_participants, setVirtual_day2_participants] = useState(0);
  const [default_obj, setDefault_obj] = useState(true);
  const [custom_obj, setCustom_obj] = useState(false);
  const [default_obj_info, setDefault_obj_info] = useState([]);
  const [custom_obj_info, setCustom_obj_info] = useState("");
  const [games, setGames] = useState([]);
  const [facilitation_fee, setFacilitation_fee] = useState(0);
  const [travel_stay_meals, setTravel_stay_meals] = useState(0);
  const [addon_description, setAddon_description] = useState("");
  const [addon_fee, setAddon_fee] = useState(0);
  const [material_cost_fees, setMaterial_cost_fees] = useState([]);
  const [material_cost_games, setMaterial_cost_games] = useState([]);
  const [final_data, setFinal_data] = useState([]);
  const [created_by, setCreated_by] = useState("");
  const [display_month_only, setdisplay_month_only] = useState(false);
  const [on_actuals, seton_actuals] = useState(false);
  const [remove_program_flow, setremove_program_flow] = useState(false);

  //Activity Data

  const [game_type, setGame_type] = useState("Inperson");
  const [inperson_game_category, setInperson_game_category] = useState("");
  const [virtual_game_category, setVirtual_game_category] = useState("");
  const [inperson_game_name, setInperson_game_name] = useState("");
  const [virtual_game_name, setVirtual_game_name] = useState("");
  const [inperson_game_url, setInperson_game_url] = useState("");
  const [virtual_game_url, setVirtual_game_url] = useState("");
  const [inperson_game_cost, setInperson_game_cost] = useState(0);
  const [virtual_game_cost, setVirtual_game_cost] = useState(0);
  const [inperson_game_logo, setInperson_game_logo] = useState(null);
  const [inperson_game_cover, setInperson_game_cover] = useState(null);
  const [virtual_game_logo, setVirtual_game_logo] = useState(null);
  const [virtual_game_cover, setVirtual_game_cover] = useState(null);
  const [inperson_game_thumbnail, setInperson_game_thumbnail] = useState(null);
  const [virtual_game_thumbnail, setVirtual_game_thumbnail] = useState(null);
  const [inperson_game_images, setInperson_game_images] = useState(null);
  const [inperson_specialgame_images, setInperson_specialgame_images] =
    useState(null);
  const [virtual_specialgame_images, setVirtual_specialgame_images] =
    useState(null);
  const [virtual_game_images, setVirtual_game_images] = useState(null);
  const [game_objective, setGame_objective] = useState("");
  const [key_title1, setKey_title1] = useState("");
  const [key_title2, setKey_title2] = useState("");
  const [key_title3, setKey_title3] = useState("");
  const [key_description1, setKey_description1] = useState("");
  const [key_description2, setKey_description2] = useState("");
  const [key_description3, setKey_description3] = useState("");
  const [inperson_logo, setInperson_logo] = useState("");
  const [virtual_logo, setVirtual_logo] = useState("");
  const [inperson_image, setInperson_image] = useState("");
  const [inperson_image1, setInperson_image1] = useState("");
  const [inperson_image2, setInperson_image2] = useState("");
  const [virtual_image, setVirtual_image] = useState("");
  const [virtual_image1, setVirtual_image1] = useState("");
  const [virtual_image2, setVirtual_image2] = useState("");
  const [act_slab1, setAct_slab1] = useState(0);
  const [act_slab2, setAct_slab2] = useState(0);
  const [act_slab3, setAct_slab3] = useState(0);
  const [act_slab4, setAct_slab4] = useState(0);
  const [act_slab5, setAct_slab5] = useState(0);

  // User Data

  const [username, setUsername] = useState("");
  const [user_email, setUser_email] = useState("");
  const [password, setPassword] = useState("");
  const [profile_picture, setProfile_picture] = useState(null);
  const [designation, setDesignation] = useState("");
  const [user_image, setUser_image] = useState("");

  // Fee Settings

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

    // Custom Notes for selected games/activities
  const [custom_notes_for_games, setCustomNotesForGames] = useState();

  // Temporary states

  const [edit_proposal, setEdit_proposal] = useState(false);
  const [proposal_id, setProposal_id] = useState("");
  const [edit_activity, setEdit_activity] = useState(false);
  const [activity_id, setActivity_id] = useState("");
  const [edit_user, setEdit_user] = useState(false);
  const [user_id, setUser_id] = useState("");
  const [loggedin_username, setLoggedin_username] = useState("");
  const [loggedin_user_image, setLoggedin_user_image] = useState("");

  const userSettings = {
    company_name: company_name,
    company_logo: company_logo,
    created_date: created_date,
    draft,
    default_obj: default_obj,
    custom_obj: custom_obj,
    custom_obj_info: custom_obj_info,
    default_obj_info: default_obj_info,
    inperson: inperson,
    virtual: virtual,
    inperson_location: inperson_location,
    inperson_days: inperson_days,
    inperson_day1_time: inperson_day1_time,
    inperson_day1_participants: inperson_day1_participants,
    inperson_day1_date: inperson_day1_date,
    inperson_day2_time: inperson_day2_time,
    inperson_day2_participants: inperson_day2_participants,
    inperson_day2_date: inperson_day2_date,
    virtual_days: virtual_days,
    virtual_day1_time: virtual_day1_time,
    virtual_day1_participants: virtual_day1_participants,
    virtual_day1_date: virtual_day1_date,
    virtual_day2_time: virtual_day2_time,
    virtual_day2_participants: virtual_day2_participants,
    virtual_day2_date: virtual_day2_date,
    games: games,
    facilitation_fee: facilitation_fee,
    travel_stay_meals: travel_stay_meals,
    addon_description: addon_description,
    addon_fee: addon_fee,
    material_cost_games: material_cost_games,
    material_cost_fees: material_cost_fees,
    final_data: final_data,
    game_type: game_type,
    inperson_game_category: inperson_game_category,
    virtual_game_category: virtual_game_category,
    inperson_game_name: inperson_game_name,
    virtual_game_name: virtual_game_name,
    inperson_game_url: inperson_game_url,
    virtual_game_url: virtual_game_url,
    inperson_game_cost: inperson_game_cost,
    virtual_game_cost: virtual_game_cost,
    inperson_game_logo: inperson_game_logo,
    virtual_game_logo: virtual_game_logo,
    inperson_game_cover: inperson_game_cover,
    virtual_game_cover: virtual_game_cover,
    inperson_game_thumbnail: inperson_game_thumbnail,
    virtual_game_thumbnail: virtual_game_thumbnail,
    inperson_game_images: inperson_game_images,
    inperson_specialgame_images: inperson_specialgame_images,
    virtual_specialgame_images: virtual_specialgame_images,
    virtual_game_images: virtual_game_images,
    game_objective: game_objective,
    key_title1: key_title1,
    key_title2: key_title2,
    key_title3: key_title3,
    key_description1: key_description1,
    key_description2: key_description2,
    key_description3: key_description3,
    act_slab1: act_slab1,
    act_slab2: act_slab2,
    act_slab3: act_slab3,
    act_slab4: act_slab4,
    act_slab5: act_slab5,
    username: username,
    profile_picture: profile_picture,
    designation: designation,
    user_email: user_email,
    password: password,
    edit_proposal: edit_proposal,
    proposal_id: proposal_id,
    edit_activity: edit_activity,
    activity_id: activity_id,
    people_per_team: people_per_team,
    day1_slab1: day1_slab1,
    day1_slab2: day1_slab2,
    day1_slab3: day1_slab3,
    day1_slab4: day1_slab4,
    day1_slab5: day1_slab5,
    day2_slab1: day2_slab1,
    day2_slab2: day2_slab2,
    day2_slab3: day2_slab3,
    day2_slab4: day2_slab4,
    day2_slab5: day2_slab5,
    team_slab1: team_slab1,
    team_slab2: team_slab2,
    team_slab3: team_slab3,
    team_slab4: team_slab4,
    team_slab5: team_slab5,
    oneway_slab1: oneway_slab1,
    oneway_slab2: oneway_slab2,
    oneway_slab3: oneway_slab3,
    oneway_slab4: oneway_slab4,
    oneway_slab5: oneway_slab5,
    weblink_slab1: weblink_slab1,
    weblink_slab2: weblink_slab2,
    weblink_slab3: weblink_slab3,
    weblink_slab4: weblink_slab4,
    weblink_slab5: weblink_slab5,
    inperson_logo: inperson_logo,
    virtual_logo: virtual_logo,
    inperson_image: inperson_image,
    inperson_image1: inperson_image1,
    inperson_image2: inperson_image2,
    virtual_image: virtual_image,
    virtual_image1: virtual_image1,
    virtual_image2: virtual_image2,
    loggedin_user_image: loggedin_user_image,
    loggedin_username: loggedin_username,
    created_by: created_by,
    edit_user: edit_user,
    user_id: user_id,
    user_image: user_image,
    display_month_only: display_month_only,
    on_actuals: on_actuals,
    remove_program_flow: remove_program_flow,
    custom_notes_for_games:custom_notes_for_games,
    setCompany_name,
    setCompany_logo,
    setCreated_date,
    setDraft,
    setDefault_obj,
    setCustom_obj,
    setCustom_obj_info,
    setDefault_obj_info,
    setInperson,
    setVirtual,
    setInperson_location,
    setInperson_days,
    setInperson_day1_time,
    setInperson_day1_participants,
    setInperson_day1_date,
    setInperson_day2_time,
    setInperson_day2_participants,
    setInperson_day2_date,
    setVirtual_days,
    setVirtual_day1_time,
    setVirtual_day1_participants,
    setVirtual_day1_date,
    setVirtual_day2_time,
    setVirtual_day2_participants,
    setVirtual_day2_date,
    setGames,
    setFacilitation_fee,
    setTravel_stay_meals,
    setAddon_description,
    setAddon_fee,
    setMaterial_cost_games,
    setMaterial_cost_fees,
    setFinal_data,
    setGame_type,
    setInperson_game_category,
    setVirtual_game_category,
    setInperson_game_name,
    setVirtual_game_name,
    setInperson_game_url,
    setVirtual_game_url,
    setInperson_game_cost,
    setVirtual_game_cost,
    setInperson_game_logo,
    setVirtual_game_logo,
    setInperson_game_cover,
    setVirtual_game_cover,
    setInperson_game_thumbnail,
    setVirtual_game_thumbnail,
    setInperson_game_images,
    setInperson_specialgame_images,
    setVirtual_specialgame_images,
    setVirtual_game_images,
    setGame_objective,
    setKey_title1,
    setKey_title2,
    setKey_title3,
    setKey_description1,
    setKey_description2,
    setKey_description3,
    setProfile_picture,
    setDesignation,
    setUser_email,
    setUsername,
    setPassword,
    setEdit_proposal,
    setProposal_id,
    setActivity_id,
    setEdit_activity,
    setPeople_per_team,
    setDay1_slab1,
    setDay1_slab2,
    setDay1_slab3,
    setDay1_slab4,
    setDay1_slab5,
    setDay2_slab1,
    setDay2_slab2,
    setDay2_slab3,
    setDay2_slab4,
    setDay2_slab5,
    setTeam_slab1,
    setTeam_slab2,
    setTeam_slab3,
    setTeam_slab4,
    setTeam_slab5,
    setoneway_slab1,
    setoneway_slab2,
    setoneway_slab3,
    setoneway_slab4,
    setoneway_slab5,
    setWeblink_slab1,
    setWeblink_slab2,
    setWeblink_slab3,
    setWeblink_slab4,
    setWeblink_slab5,
    setInperson_logo,
    setInperson_image,
    setInperson_image1,
    setInperson_image2,
    setVirtual_logo,
    setVirtual_image,
    setVirtual_image1,
    setVirtual_image2,
    setLoggedin_user_image,
    setLoggedin_username,
    setCreated_by,
    setAct_slab1,
    setAct_slab2,
    setAct_slab3,
    setAct_slab4,
    setAct_slab5,
    setUser_id,
    setEdit_user,
    setUser_image,
    setdisplay_month_only,
    setremove_program_flow,
    seton_actuals,
    setCustomNotesForGames,
  };
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif !important`,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={userSettings}>
        <div className="App">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/reset-password" element={<Forgot />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/create-proposal" element={<Proposal />} />
                <Route path="/activities" element={<Activities />} />

                <Route path="/admin-dashboard" element={<Admin_dashboard />} />
                {/* <Route path="/create-activity" element={<Create_activity />} /> */}
                <Route path="/create-activity" element={<CreateActivity />} />

                <Route path="/users" element={<Users />} />
                <Route path="/create-user" element={<Create_user />} />
                <Route path="/fee-settings" element={<Settings />} />
              </Route>
            </Routes>
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
