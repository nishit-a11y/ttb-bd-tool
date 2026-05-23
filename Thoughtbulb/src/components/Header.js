import React, { useContext } from "react";
import "./Header.css";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import {fire} from "./Firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import AppContext from "../components/AppContext";

function Header() {
  let navigate = useNavigate();
  const auth = getAuth(fire);
  const myContext = useContext(AppContext);

  function logout_user() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("super-admin-auth");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_image");
    window.location.reload(true);
    auth.signOut();
    navigate("/");
  }

  return (
    <div className="container-fluid head">
      <nav className="navbar">
        <a className="navbar-brand">
          <img
            src={require("../assets/images/logo1.png")}
            width="60"
            alt=""
          ></img>
        </a>
        <div className="profile">
          <Avatar
            src={
              localStorage.getItem("profile_image")
                ? localStorage.getItem("profile_image")
                : "/broken-image.jpg"
            }
          ></Avatar>
          <p className="username">
            {localStorage.getItem("username")
              ? localStorage.getItem("username")
              : ""}
          </p>
          <PopupState
            variant="popover"
            popupId="demo-popup-menu"
            className="popup"
          >
            {(popupState) => (
              <React.Fragment>
                <img
                  {...bindTrigger(popupState)}
                  className="drop"
                  src={require("../assets/images/down.png")}
                  height="6"
                ></img>

                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={logout_user}>Logout</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
      </nav>
    </div>
  );
}

export default Header;
