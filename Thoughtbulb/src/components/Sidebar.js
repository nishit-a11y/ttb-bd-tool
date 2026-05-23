import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
function Sidebar({
  sideBarMenuItems = [],
  sidebarClassName = "",
  sideBarListClassName = "",
  ...props
}) {
  const navigate = useNavigate();
  const menuItems =
    sideBarMenuItems.map((menuItem) => {
      return (
        <div
          className={
            "sideBarList " +
            (menuItem.isActive ? "active " : "") +
            sideBarListClassName
          }
          onClick={(e) => {
            if (menuItem.onClick) {
              menuItem.onClick(e);
            }
            if (menuItem.navigateOnClick) {
              navigate(menuItem.navigateOnClick);
            }
          }}
          key={menuItem.label}
        >
          <div className={menuItem.isActive ? "active-pre" : ""}></div>
          <div className="menuIcon">{menuItem.icon}</div>
          <div className="lableName"> {menuItem.label}</div>
          
         
        </div>
      );
    }) || [];
  return (
    // <div style={{ position: "relative" }}>
    <div id="sidebarMenu" className={"adminSidebar " + sidebarClassName}>
      <div style={{ position: "sticky", top: "2em", alignSelf: "flex-start" }}>
        {menuItems}
      </div>
    </div>
  );
}

export default Sidebar;
