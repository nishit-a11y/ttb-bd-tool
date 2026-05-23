import {
  faUser,
  faFile,
  faGear,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const sidebar_menu_items = [
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

export const sidebar_menu_items_bd = [
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
