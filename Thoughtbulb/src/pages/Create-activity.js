import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import "./Create-activity.css";
import { Oval } from "react-loader-spinner";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import inperson_img from "../assets/images/inperson.svg";
import virtual_img from "../assets/images/virtual.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import isUrl from "is-url";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  Timestamp,
  addDoc,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import {fire} from "../components/Firebase";
import AppContext from "../components/AppContext";
import moment from "moment";
import detectBackButton from "detect-browser-back-navigation";
import { CollectionName } from "./collection_config";
import { debounce } from "@mui/material";
import { parseNonNullablePickerDate } from "@mui/x-date-pickers/internals";

function Create_activity() {
  let navigate = useNavigate();
  const db = getFirestore(fire);
  const storage = getStorage(fire);
  const myContext = useContext(AppContext);
  const [venue_drawer, setVenue_drawer] = useState(false);
  const [venue_field, setVenue_field] = useState(false);
  const [drawer_venue, setDrawer_venue] = useState("");
  const [venue, setVenue] = useState("");
  const [expanded, setExpanded] = useState(1);
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [completed3, setCompleted3] = useState(false);
  const [completed4, setCompleted4] = useState(false);
  const [data, setData] = useState([]);
  const [group_a_data, setGroup_a_data] = useState([]);
  const [group_b_data, setGroup_b_data] = useState([]);
  const [outdoor_data, setOutdoor_data] = useState([]);
  const [teambased_data, setTeambased_data] = useState([]);
  const [oneway_data, setOneway_data] = useState([]);
  const [weblink_data, setWeblink_data] = useState([]);
  const [inperson_alignment, setInperson_alignment] = useState("groupa");
  const [virtual_alignment, setVirtual_alignment] = useState("teambased");
  const [virtual_games, setVirtual_games] = useState([]);
  const [inperson_games, setInperson_games] = useState([]);
  const [selected_games, setSelected_games] = useState([]);
  const [fac_fee, setFac_fee] = useState(0);
  const [trav_fee, setTrav_fee] = useState(0);
  const [change_addon, setChange_addon] = useState(false);
  const [addon_desc, setAddon_desc] = useState("");
  const [addon_price, setAddon_price] = useState(0);
  const [addon_val, setAddon_val] = useState(false);
  const [activity_count, setActivity_count] = useState(0);
  const [warn_act_count, setWarn_act_count] = useState(false);
  const [fees_data, setFees_data] = useState([]);
  const [fac_day1_inperson, setFac_day1_inperson] = useState(0);
  const [fac_day2_inperson, setFac_day2_inperson] = useState(0);
  const [warn_objective_state, setWarn_objective_state] = useState(false);
  const [warn_objective, setWarn_objective] = useState("");
  const [warn_custom_location, setWarn_custom_location] = useState(false);
  const [people_per_team, setPeople_per_team] = useState(0);
  const [local_material_cost, setLocal_material_cost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [game_name_warning, setGame_name_warning] = useState("");
  const [game_images_warning, setGame_images_warning] = useState("");
  const [specialgame_images_warning, setspecialGame_images_warning] =
    useState("");

  const [game_logo_warning, setGame_logo_warning] = useState("");
  const [warn_inperson_game_category, setWarn_inperson_game_category] =
    useState(false);
  const [warn_inperson_game_name, setWarn_inperson_game_name] = useState(false);

  const [warn_inperson_game_url, setWarn_inperson_game_url] = useState(false);
  const [warn_inperson_invalid_url, setWarn_inperson_invalid_url] =
    useState(false);
  const [warn_inperson_game_cost, setWarn_inperson_game_cost] = useState(false);
  const [warn_inperson_game_logo, setWarn_inperson_game_logo] = useState(false);
  const [warn_inperson_game_images, setWarn_inperson_game_images] =
    useState(false);
  const [
    warn_inperson_specialgame_images,
    setWarn_inperson_specialgame_images,
  ] = useState(false);
  const [warn_virtual_specialgame_images, setWarn_virtual_specialgame_images] =
    useState(false);
  const [warn_virtual_game_category, setWarn_virtual_game_category] =
    useState(false);
  const [warn_virtual_game_name, setWarn_virtual_game_name] = useState(false);
  const [warn_virtual_game_url, setWarn_virtual_game_url] = useState(false);
  const [warn_virtual_invalid_url, setWarn_virtual_invalid_url] =
    useState(false);
  const [warn_virtual_game_cost, setWarn_virtual_game_cost] = useState(false);
  const [warn_virtual_game_logo, setWarn_virtual_game_logo] = useState(false);
  const [warn_virtual_game_images, setWarn_virtual_game_images] =
    useState(false);
  const [warn_inperson_days, setWarn_inperson_days] = useState(false);
  const [warn_inperson_day1, setWarn_inperson_day1] = useState(false);
  const [warn_inperson_day2, setWarn_inperson_day2] = useState(false);
  const [warn_virtual_days, setWarn_virtual_days] = useState(false);
  const [warn_virtual_day1, setWarn_virtual_day1] = useState(false);
  const [warn_virtual_day2, setWarn_virtual_day2] = useState(false);
  const [warn_outcome1, setWarn_outcome1] = useState(false);
  const [warn_outcome2, setWarn_outcome2] = useState(false);
  const [warn_outcome3, setWarn_outcome3] = useState(false);
  const [warn_description1, setWarn_description1] = useState(false);
  const [warn_description2, setWarn_description2] = useState(false);
  const [warn_description3, setWarn_description3] = useState(false);
  const [warn_desc1, setWarn_desc1] = useState("");
  const [warn_desc2, setWarn_desc2] = useState("");
  const [warn_desc3, setWarn_desc3] = useState("");
  const [warn_desc4, setWarn_desc4] = useState("");
  const [warn_desc5, setWarn_desc5] = useState("");
  const [warn_desc6, setWarn_desc6] = useState("");
  const [accordion1, setAccordion1] = useState(false);
  const [accordion2, setAccordion2] = useState(true);
  const [accordion3, setAccordion3] = useState(true);

  const [loading, setLoading] = useState(false);
  const [change_slab1, setChange_slab1] = useState(false);
  const [change_slab2, setChange_slab2] = useState(false);
  const [change_slab3, setChange_slab3] = useState(false);
  const [change_slab4, setChange_slab4] = useState(false);
  const [change_slab5, setChange_slab5] = useState(false);
  const [slab1, setSlab1] = useState(0);
  const [slab2, setSlab2] = useState(0);
  const [slab3, setSlab3] = useState(0);
  const [slab4, setSlab4] = useState(0);
  const [slab5, setSlab5] = useState(0);
  const [croppingLogo1, setCroppingLogo1] = useState(null);
  const [uploadedLogo1, setUploadedLogo1] = useState(null);
  const [croppingImage1, setCroppingImage1] = useState(null);
  const [croppingImageV1, setCroppingImageV1] = useState(null);

  const [uploadedImage1, setUploadedImage1] = useState([]);
  const [uploadedImageV1, setUploadedImageV1] = useState([]);

  const [croppingLogo2, setCroppingLogo2] = useState(null);
  const [uploadedLogo2, setUploadedLogo2] = useState(null);
  const [croppingImage2, setCroppingImage2] = useState(null);
  const [uploadedImage2, setUploadedImage2] = useState(null);
  const [uploadedImageV2, setUploadedImageV2] = useState(null);

  const [croppingSpecial1, setCroppingSpecial1] = useState(null);
  const [uploadedSpecial1, setUploadedSpecial1] = useState([]);
  const [croppingSpecial2, setCroppingSpecial2] = useState(null);
  const [uploadedSpecial2, setUploadedSpecial2] = useState([]);
  const [specialActivity1, setSpecialActivity1] = useState(false);
  const [specialActivity2, setSpecialActivity2] = useState(false);
  const [toReplaceImage1, setToReplaceImage1] = useState(null);
  const [toReplaceImageV1, setToReplaceImageV1] = useState(null);

  const [toReplaceSpecialImage1, setToReplaceSpecialImage1] = useState(null);
  const [toReplaceSpecialImage2, setToReplaceSpecialImage2] = useState(null);

  const [updateCount, setUpdateCount] = useState(0);
  const [updateCount2, setUpdateCount2] = useState(0);
  const [updateCount3, setUpdateCount3] = useState(0);
  const [updateCount4, setUpdateCount4] = useState(0);

  useEffect(() => {
    const labelElement = document.querySelector('label[for="fileInput2"]');
    if (toReplaceImage1 != null) {
      labelElement?.click();
    }
  }, [toReplaceImage1, updateCount]);
  useEffect(() => {
    const labelElement = document.querySelector('label[for="fileInput5"]');
    if (toReplaceSpecialImage1 != null) {
      labelElement?.click();
    }
  }, [toReplaceSpecialImage1, updateCount2]);
  useEffect(() => {
    const labelElement = document.querySelector('label[for="fileInputV3"]');
    if (toReplaceImageV1 != null) {
      labelElement?.click();
    }
  }, [toReplaceImageV1, updateCount3]);
  useEffect(() => {
    const labelElement = document.querySelector('label[for="fileInputV5"]');
    if (toReplaceSpecialImage2 != null) {
      labelElement?.click();
    }
  }, [toReplaceSpecialImage2, updateCount4]);

  const cropperRef1 = useRef(null);
  const cropperRef2 = useRef(null);

  const cropperRef5 = useRef(null);
  const cropperRefV1 = useRef(null);
  const cropperRefV2 = useRef(null);
  const cropperRefV5 = useRef(null);
  const [cropper1, setCropper1] = useState();

  const handleZoomIn = () => {
    cropper1.zoom(0.1);
  };

  const handleZoomOut = () => {
    cropper1.zoom(-0.1);
  };
  const handleFitHeight = () => {
    const cropper = cropperRef1.current?.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const image = cropper.getImageData();

    const ratio = image.naturalHeight / image.naturalWidth;
    const newCropBoxData = {
      ...cropBoxData,
      height: cropBoxData.width * ratio,
    };
    cropper.setCropBoxData(newCropBoxData);
  };

  const handleFitWidth = () => {
    const cropper = cropperRef1.current?.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const image = cropper.getImageData();
    const ratio = image.naturalWidth / image.naturalHeight;
    const newCropBoxData = {
      ...cropBoxData,
      width: cropBoxData.height * ratio,
    };
    cropper.setCropBoxData(newCropBoxData);
  };
  const handleCrop1 = () => {
    const cropper = cropperRef1.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 100,
      minWidth: 100,
      minHeight: 100,
      maxHeight: 100,
    });
    let croppedImg = croppedCanvas.toDataURL();
    let tempArr = uploadedLogo1;
    setUploadedLogo1(croppedImg);
    setCroppingLogo1(null);
    myContext.setInperson_game_logo(croppedImg);
    setWarn_inperson_game_logo(false);
  };

  const handleCrop2 = () => {
    let tempArr = uploadedImage1;
    const cropper = cropperRef2.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 340,
      minWidth: 340,
      minHeight: 230,
      maxHeight: 230,
    });
    let croppedImg = croppedCanvas.toDataURL();
    if (toReplaceImage1 != null) {
      tempArr[toReplaceImage1] = croppedImg;
    } else {
      tempArr.push(croppedImg);
    }
    setUploadedImage1(tempArr);
    setCroppingImage1(null);
    myContext.setInperson_game_images(tempArr);
    setWarn_inperson_game_images(false);
    setToReplaceImage1(null);
  };

  const handleCrop5 = () => {
    const cropper = cropperRef5.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 1400,
      minWidth: 1400,
      minHeight: 900,
      maxHeight: 900,
    });
    let croppedImg = croppedCanvas.toDataURL();
    let tempArr = uploadedSpecial1;
    if (toReplaceSpecialImage1 != null) {
      tempArr[toReplaceSpecialImage1] = croppedImg;
    } else {
      tempArr.push(croppedImg);
    }
    setUploadedSpecial1(tempArr);
    myContext.setInperson_specialgame_images(tempArr);
    setWarn_inperson_specialgame_images(false);

    setCroppingSpecial1(null);
    setToReplaceSpecialImage1(null);
  };
  const handleCropV1 = () => {
    const cropper = cropperRefV1.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 100,
      minWidth: 100,
      minHeight: 100,
      maxHeight: 100,
    });
    let croppedImg = croppedCanvas.toDataURL();
    let tempArr = uploadedLogo2;
    setUploadedLogo2(croppedImg);
    setCroppingLogo2(null);
    myContext.setVirtual_game_logo(croppedImg);
    setWarn_virtual_game_logo(false);
  };

  const handleCropV2 = () => {
    const cropper = cropperRefV2.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 340,
      minWidth: 340,
      minHeight: 230,
      maxHeight: 230,
    });
    let croppedImg = croppedCanvas.toDataURL();
    let tempArr = uploadedImageV1;
    if (toReplaceImageV1 != null) {
      tempArr[toReplaceImageV1] = croppedImg;
    } else {
      tempArr.push(croppedImg);
    }
    setUploadedImageV1(tempArr);
    setCroppingImageV1(null);
    myContext.setVirtual_game_images(tempArr);
    setWarn_virtual_game_images(false);
    setToReplaceImageV1(null);
  };

  const handleCropV5 = () => {
    const cropper = cropperRefV5.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 1400,
      minWidth: 1400,
      minHeight: 900,
      maxHeight: 900,
    });
    let croppedImg = croppedCanvas.toDataURL();
    let tempArr = uploadedSpecial2;
    if (toReplaceSpecialImage2 != null) {
      tempArr[toReplaceSpecialImage2] = croppedImg;
    } else {
      tempArr.push(croppedImg);
    }
    setUploadedSpecial2(tempArr);
    myContext.setVirtual_specialgame_images(tempArr);
    setWarn_virtual_specialgame_images(false);

    setCroppingSpecial2(null);
    setToReplaceSpecialImage2(null);
  };

  useEffect(() => {
    detectBackButton(() => {
      if (window.confirm("Continue without saving changes ?")) {
        resetContexts();
        navigate("/activities");
      }
    });
  }, []);

  useEffect(() => {
    setSlab1(myContext.act_slab1);
    setSlab2(myContext.act_slab2);
    setSlab3(myContext.act_slab3);
    setSlab4(myContext.act_slab4);
    setSlab5(myContext.act_slab5);
  }, []);

  function go_back() {
    if (window.confirm("Continue without saving changes ?")) {
      resetContexts();
      navigate("/activities");
    }
  }
  useEffect(() => {
    if (myContext.edit_activity) {
      if (myContext.inperson_image) {
        myContext.setInperson_game_images([myContext.inperson_image]);
        setUploadedImage1([myContext.inperson_image]);
      }
      if (myContext.inperson_image1) {
        myContext.setInperson_game_images([
          myContext.inperson_image,
          myContext.inperson_image1,
        ]);
        setUploadedImage1([
          myContext.inperson_image,
          myContext.inperson_image1,
        ]);
      }
      if (myContext.inperson_image2) {
        myContext.setInperson_game_images([
          myContext.inperson_image,
          myContext.inperson_image1,
          myContext.inperson_image2,
        ]);
        setUploadedImage1([
          myContext.inperson_image,
          myContext.inperson_image1,
          myContext.inperson_image2,
        ]);
      }

      if (myContext.inperson_logo) {
        setUploadedLogo1([myContext.inperson_logo]);
        myContext.setInperson_game_logo(myContext.inperson_logo);
      }
    }

    if (
      myContext.inperson_specialgame_images &&
      myContext.inperson_specialgame_images.length > 0
    ) {
      setSpecialActivity1(true);
      setUploadedSpecial1(myContext.inperson_specialgame_images);
      myContext.setInperson_specialgame_images(
        myContext.inperson_specialgame_images
      );
    }
  }, []);

  useEffect(() => {
    if (myContext.edit_activity) {
      if (myContext.virtual_image) {
        myContext.setVirtual_game_images([myContext.virtual_image]);
        setUploadedImageV1([myContext.virtual_image]);
      }
      if (myContext.virtual_image1) {
        myContext.setVirtual_game_images([
          myContext.virtual_image,
          myContext.virtual_image1,
        ]);
        setUploadedImageV1([myContext.virtual_image, myContext.virtual_image1]);
      }
      if (myContext.virtual_image2) {
        myContext.setVirtual_game_images([
          myContext.virtual_image,
          myContext.virtual_image1,
          myContext.virtual_image2,
        ]);
        setUploadedImageV1([
          myContext.virtual_image,
          myContext.virtual_image1,
          myContext.virtual_image2,
        ]);
      }

      if (myContext.virtual_logo) {
        setUploadedLogo2([myContext.virtual_logo]);
        myContext.setVirtual_game_logo(myContext.virtual_logo);
      }
    }
    if (
      myContext.virtual_specialgame_images &&
      myContext.virtual_specialgame_images.length > 0
    ) {
      setSpecialActivity2(true);
      setUploadedSpecial2(myContext.virtual_specialgame_images);
      myContext.setVirtual_specialgame_images(
        myContext.virtual_specialgame_images
      );
    }
  }, []);

  function inperson_game_details_completed() {
    let returnFlag = false;

    nullifyWarnings();
    const file_types = ["image/jpg", "image/png", "image/jpeg"];
    let q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false),

      where("game_name_small", "in", [
        myContext.inperson_game_name.toLowerCase(),
      ])
    );

    getDocs(q)
      .then((docs) => {
        if (docs.docs.length > 0 && !myContext.edit_activity) {
          setGame_name_warning("* Activity Name already exists");
          setWarn_inperson_game_name(true);

          returnFlag = true;
        }
      })
      .then(() => {
        if (!returnFlag) {
          if (myContext.inperson_game_category.length === 0) {
            setWarn_inperson_game_category(true);
          } else if (myContext.inperson_game_name.length === 0) {
            setGame_name_warning("* Enter the Activity name");
            setWarn_inperson_game_name(true);
          } else if (myContext.inperson_game_name.length <= 2) {
            setGame_name_warning("* Activity name is too short");
            setWarn_inperson_game_name(true);
          } else if (
            !isUrl(myContext.inperson_game_url) &&
            myContext.inperson_game_url.length !== 0
          ) {
            setWarn_inperson_invalid_url(true);
          } else if (myContext.inperson_game_cost === 0) {
            setWarn_inperson_game_cost(true);
          } else if (
            myContext.inperson_game_logo === null &&
            !myContext.edit_activity
          ) {
            setGame_logo_warning("* Activity logo is required");
            setWarn_inperson_game_logo(true);
          } else if (
            myContext.inperson_game_images === null &&
            !myContext.edit_activity
          ) {
            setGame_images_warning("* Activity images are required");
            setWarn_inperson_game_images(true);
          } else if (
            myContext.inperson_game_images !== null &&
            myContext.inperson_game_images.length !== 3
          ) {
            setGame_images_warning("* Upload exactly 3 images");
            setWarn_inperson_game_images(true);
          } else if (
            (myContext.inperson_specialgame_images === null ||
              (myContext.inperson_specialgame_images.length === 0 &&
                !myContext.edit_activity)) &&
            specialActivity1
          ) {
            setspecialGame_images_warning(
              "* Special Activity images are required"
            );
            setWarn_inperson_specialgame_images(true);
          } else {
            setCompleted1(true);
            setAccordion2(false);
            setExpanded(2);
          }
        }
      });
  }
  function nullifyWarnings() {
    setWarn_inperson_game_category(false);
    setGame_name_warning(null);
    setWarn_inperson_game_name(false);
    setWarn_inperson_invalid_url(false);
    setWarn_inperson_game_cost(false);
    setGame_logo_warning(null);
    setWarn_inperson_game_logo(false);
    setGame_images_warning(null);
    setWarn_inperson_game_images(false);
    setWarn_inperson_game_images(false);
    setWarn_inperson_specialgame_images(false);
    setWarn_virtual_game_category(false);
    setWarn_virtual_game_name(false);
    setWarn_virtual_invalid_url(false);
    setWarn_virtual_game_cost(false);
    setWarn_virtual_game_logo(false);
    setWarn_virtual_game_images(false);
    setspecialGame_images_warning(null);
    setWarn_virtual_specialgame_images(false);
  }
  function virtual_game_details_completed() {
    let returnFlag = false;

    nullifyWarnings();

    const file_types = ["image/jpg", "image/png", "image/jpeg"];

    myContext.setGame_type("Virtual");
    let q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false),

      where("game_name_small", "in", [
        myContext.virtual_game_name.toLowerCase(),
      ])
    );

    getDocs(q)
      .then((docs) => {
        if (docs.docs.length > 0 && !myContext.edit_activity) {
          setGame_name_warning("* Activity Name already exists");
          setWarn_virtual_game_name(true);

          returnFlag = true;
        }
      })
      .then(() => {
        if (!returnFlag) {
          if (myContext.virtual_game_category.length === 0) {
            setWarn_virtual_game_category(true);
          } else if (myContext.virtual_game_name.length === 0) {
            setGame_name_warning("* Enter the Activity name");
            setWarn_virtual_game_name(true);
          } else if (myContext.virtual_game_name.length <= 2) {
            setGame_name_warning("* Activity name is too short");
            setWarn_virtual_game_name(true);
          } else if (
            !isUrl(myContext.virtual_game_url) &&
            myContext.virtual_game_url.length !== 0
          ) {
            setWarn_virtual_invalid_url(true);
          } else if (
            myContext.act_slab1 === 0 ||
            myContext.act_slab2 === 0 ||
            myContext.act_slab3 === 0 ||
            myContext.act_slab4 === 0 ||
            myContext.act_slab5 === 0
          ) {
            setWarn_virtual_game_cost(true);
          } else if (
            myContext.virtual_game_logo === null &&
            !myContext.edit_activity
          ) {
            setGame_logo_warning("* Activity logo is required");
            setWarn_virtual_game_logo(true);
          } else if (
            myContext.virtual_game_images === null &&
            !myContext.edit_activity
          ) {
            setGame_images_warning("* Activity images are required");
            setWarn_virtual_game_images(true);
          } else if (
            myContext.virtual_game_images !== null &&
            myContext.virtual_game_images.length !== 3
          ) {
            setGame_images_warning("* Upload exactly 3 images");
            setWarn_virtual_game_images(true);
          } else if (
            (myContext.virtual_specialgame_images === null ||
              (myContext.virtual_specialgame_images.length === 0 &&
                !myContext.edit_activity)) &&
            specialActivity2
          ) {
            setspecialGame_images_warning(
              "* Special Activity images are required"
            );
            setWarn_virtual_specialgame_images(true);
          } else {
            setCompleted1(true);
            setAccordion2(false);
            setExpanded(2);
          }
        }
      });
  }

  function resetContexts() {
    myContext.setGame_type("Inperson");
    myContext.setInperson_game_category("");
    myContext.setVirtual_game_category("");
    myContext.setInperson_game_name("");
    myContext.setVirtual_game_name("");
    myContext.setInperson_game_url("");
    myContext.setVirtual_game_url("");
    myContext.setInperson_game_cost(0);
    myContext.setVirtual_game_cost(0);
    myContext.setInperson_game_logo(null);
    myContext.setVirtual_game_logo(null);
    myContext.setInperson_game_thumbnail(null);
    myContext.setVirtual_game_thumbnail(null);
    myContext.setInperson_game_images(null);
    myContext.setVirtual_game_images(null);
    myContext.setInperson_specialgame_images(null);
    myContext.setVirtual_specialgame_images(null);
    myContext.setInperson_logo(null);
    myContext.setVirtual_logo(null);
    myContext.setInperson_logo(null);
    myContext.setVirtual_logo(null);
    myContext.setInperson_image(null);
    myContext.setVirtual_image(null);
    myContext.setInperson_image1(null);
    myContext.setVirtual_image1(null);
    myContext.setInperson_image2(null);
    myContext.setVirtual_image2(null);
    myContext.setGame_objective("");
    myContext.setKey_title1("");
    myContext.setKey_title2("");
    myContext.setKey_title3("");
    myContext.setKey_description1("");
    myContext.setKey_description2("");
    myContext.setKey_description3("");
    myContext.setAct_slab1(0);
    myContext.setAct_slab2(0);
    myContext.setAct_slab3(0);
    myContext.setAct_slab4(0);
    myContext.setAct_slab5(0);
  }
  function objectives_completed() {
    if (myContext.game_objective.length === 0) {
      setWarn_objective("* Enter the objective");
      setWarn_objective_state(true);
    } else if (myContext.game_objective.length >= 380) {
      setWarn_objective("* Only 380 characters are allowed");
      setWarn_objective_state(true);
    } else {
      setWarn_objective_state(false);
      setCompleted2(true);
      setAccordion3(false);
      setExpanded(3);
    }
  }

  function description_completed() {
    if (myContext.key_title1.length === 0) {
      setWarn_desc1("* Enter the outcome");
      setWarn_outcome1(true);
    } else if (myContext.key_title1.length >= 15) {
      setWarn_desc1("* Only 15 characters are allowed");
      setWarn_outcome1(true);
    } else if (myContext.key_title2.length === 0) {
      setWarn_desc2("* Enter the outcome");
      setWarn_outcome2(true);
    } else if (myContext.key_title2.length >= 15) {
      setWarn_desc2("* Only 15 characters are allowed");
      setWarn_outcome2(true);
    } else if (myContext.key_title3.length === 0) {
      setWarn_desc3("* Enter the outcome");
      setWarn_outcome3(true);
    } else if (myContext.key_title3.length >= 15) {
      setWarn_desc3("* Only 15 characters are allowed");
      setWarn_outcome3(true);
    } else if (myContext.key_description1.length === 0) {
      setWarn_desc4("* Enter the description");
      setWarn_description1(true);
    } else if (myContext.key_description1.length >= 120) {
      setWarn_desc4("* Only 120 characters are allowed");
      setWarn_description1(true);
    } else if (myContext.key_description2.length === 0) {
      setWarn_desc5("* Enter the description");
      setWarn_description2(true);
    } else if (myContext.key_description2.length >= 120) {
      setWarn_desc5("* Only 120 characters are allowed");
      setWarn_description2(true);
    } else if (myContext.key_description3.length === 0) {
      setWarn_desc6("* Enter the description");
      setWarn_description3(true);
    } else if (myContext.key_description3.length >= 120) {
      setWarn_desc6("* Only 120 characters are allowed");
      setWarn_description3(true);
    } else {
      save_activity("save");
    }
  }
  function saveDraft_completed() {
    let returnFlag = false;
    let q = query(
      collection(db, CollectionName.games),
      where("isDeleted", "==", false),

      where("game_name_small", "in", [
        myContext.inperson_game_name.toLowerCase(),
        myContext.virtual_game_name.toLowerCase(),
      ])
    );

    getDocs(q)
      .then((docs) => {
        if (docs.docs.length > 0 && !myContext.edit_activity) {
          setGame_name_warning("* Activity Name already exists");
          if (myContext.game_type === "Inperson") {
            setWarn_inperson_game_name(true);
          } else {
            setWarn_virtual_game_name(true);
          }
          returnFlag = true;
        }
      })
      .then(() => {
        if (myContext.game_type === "Inperson" && !returnFlag) {
          if (myContext.inperson_game_name.length === 0) {
            setGame_name_warning("* Enter the Activity name");
            setWarn_inperson_game_name(true);
          } else if (
            myContext.inperson_game_images &&
            myContext.inperson_game_images.length > 0 &&
            myContext.inperson_game_images.length !== 3
          ) {
            setGame_images_warning("* Upload exactly 3 images");
            setWarn_inperson_game_images(true);
          } else {
            save_activity("draft");
          }
        }
        if (myContext.game_type === "Virtual" && !returnFlag) {
          if (myContext.virtual_game_name.length === 0) {
            setGame_name_warning("* Enter the Activity name");
            setWarn_virtual_game_name(true);
          } else if (
            myContext.virtual_game_images &&
            myContext.virtual_game_images.length > 0 &&
            myContext.virtual_game_images.length !== 3
          ) {
            setGame_images_warning("* Upload exactly 3 images");
            setWarn_virtual_game_images(true);
          } else {
            save_activity("draft");
          }
        }
      });
  }
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  function save_activity(status) {
    setIsLoading(true);

    const final_data = {
      game_objective: myContext.game_objective,
      key_title1: myContext.key_title1,
      key_title2: myContext.key_title2,
      key_title3: myContext.key_title3,
      key_description1: myContext.key_description1,
      key_description2: myContext.key_description2,
      key_description3: myContext.key_description3,
      game_type: myContext.game_type,
      isDeleted: false,
      draft: status === "draft" ? true : false,
      created_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
    };

    let logo_image,
      activityImage,
      activityImage1,
      activityImage2 = null;
    let specialImageArr = [];
    let specialImageArr2 = [];

    let uploadTask = null;
    let uploadTask1 = null;
    let uploadTask2 = null;
    let uploadTask3 = null;
    if (myContext.game_type === "Inperson") {
      final_data.game_name = myContext.inperson_game_name;
      final_data.game_name_small = myContext.inperson_game_name.toLowerCase();

      final_data.game_url = myContext.inperson_game_url;
      final_data.category = myContext.inperson_game_category;
      final_data.material_cost = myContext.inperson_game_cost;
      if (myContext.inperson_game_logo) {
        if (!myContext.inperson_game_logo?.startsWith("https")) {
          logo_image = dataURLtoFile(
            myContext.inperson_game_logo,
            myContext.inperson_game_name + "-logo.png"
          );
          const storageRef = ref(
            storage,
            "/game_logos/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              logo_image.name
          );
          uploadTask = uploadBytesResumable(storageRef, logo_image);
        }
      } else {
        myContext.setInperson_game_logo(null);
        final_data.game_logo = null;
      }
      if (myContext.inperson_game_images?.[0]) {
        if (!myContext.inperson_game_images?.[0]?.startsWith("https")) {
          activityImage = dataURLtoFile(
            myContext.inperson_game_images[0],
            myContext.inperson_game_name + "-image.png"
          );

          const storageRef = ref(
            storage,
            "/game_images/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage.name
          );
          uploadTask1 = uploadBytesResumable(storageRef, activityImage);
        }
      } else {
        myContext.setInperson_game_images(null);
        final_data.game_image = null;
      }
      if (myContext.inperson_game_images?.[1]) {
        if (!myContext.inperson_game_images?.[1]?.startsWith("https")) {
          activityImage1 = dataURLtoFile(
            myContext.inperson_game_images[1],
            myContext.inperson_game_name + "-image01.png"
          );
          const storageRef = ref(
            storage,
            "/game_images1/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage1.name
          );
          uploadTask2 = uploadBytesResumable(storageRef, activityImage1);
        }
      } else {
        myContext.setInperson_game_images(null);
        final_data.game_image1 = null;
      }
      if (myContext.inperson_game_images?.[2]) {
        if (!myContext.inperson_game_images?.[2]?.startsWith("https")) {
          activityImage2 = dataURLtoFile(
            myContext.inperson_game_images[2],
            myContext.inperson_game_name + "-image02.png"
          );
          const storageRef = ref(
            storage,
            "/game_images2/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage2.name
          );
          uploadTask3 = uploadBytesResumable(storageRef, activityImage2);
        }
      } else {
        myContext.setInperson_game_images(null);
        final_data.game_image2 = null;
      }

      myContext.inperson_specialgame_images?.map((specialImage, index) => {
        if (!specialImage?.startsWith("https")) {
          const temp = dataURLtoFile(
            specialImage,
            myContext.inperson_game_name + "-special" + index + ".png"
          );
          specialImageArr.push({ image: temp, index: index });
        } else {
          specialImageArr2.push({ image: specialImage, index: index });
        }
      });
    }
    if (myContext.game_type === "Virtual") {
      final_data.game_name = myContext.virtual_game_name;
      final_data.game_name_small = myContext.virtual_game_name.toLowerCase();
      final_data.program_fee = [
        myContext.act_slab1,
        myContext.act_slab2,
        myContext.act_slab3,
        myContext.act_slab4,
        myContext.act_slab5,
      ];
      final_data.game_url = myContext.virtual_game_url;
      final_data.category = myContext.virtual_game_category;
      final_data.material_cost = myContext.virtual_game_cost;
      if (myContext.virtual_game_logo) {
        if (!myContext.virtual_game_logo?.startsWith("https")) {
          logo_image = dataURLtoFile(
            myContext.virtual_game_logo,
            myContext.virtual_game_name + "-logo.png"
          );
          const storageRef = ref(
            storage,
            "/game_logos/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              logo_image.name
          );
          uploadTask = uploadBytesResumable(storageRef, logo_image);
        }
      } else {
        myContext.setVirtual_game_logo(null);
        final_data.game_logo = null;
      }
      if (myContext.virtual_game_images?.[0]) {
        if (!myContext.virtual_game_images?.[0]?.startsWith("https")) {
          activityImage = dataURLtoFile(
            myContext.virtual_game_images[0],
            myContext.virtual_game_name + "-image.png"
          );

          const storageRef = ref(
            storage,
            "/game_images/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage.name
          );
          uploadTask1 = uploadBytesResumable(storageRef, activityImage);
        }
      } else {
        myContext.setVirtual_game_images(null);
        final_data.game_image = null;
      }
      if (myContext.virtual_game_images?.[1]) {
        if (!myContext.virtual_game_images?.[1]?.startsWith("https")) {
          activityImage1 = dataURLtoFile(
            myContext.virtual_game_images[1],
            myContext.virtual_game_name + "-image01.png"
          );
          const storageRef = ref(
            storage,
            "/game_images1/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage1.name
          );
          uploadTask2 = uploadBytesResumable(storageRef, activityImage1);
        }
      } else {
        myContext.setVirtual_game_images(null);
        final_data.game_image1 = null;
      }
      if (myContext.virtual_game_images?.[2]) {
        if (!myContext.virtual_game_images?.[2]?.startsWith("https")) {
          activityImage2 = dataURLtoFile(
            myContext.virtual_game_images[2],
            myContext.virtual_game_name + "-image02.png"
          );
          const storageRef = ref(
            storage,
            "/game_images2/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              activityImage2.name
          );
          uploadTask3 = uploadBytesResumable(storageRef, activityImage2);
        }
      } else {
        myContext.setVirtual_game_images(null);
        final_data.game_image2 = null;
      }
      myContext.virtual_specialgame_images?.map((specialImage, index) => {
        if (!specialImage?.startsWith("https")) {
          const temp = dataURLtoFile(
            specialImage,
            myContext.virtual_game_name + "-special" + index + ".png"
          );
          specialImageArr.push({ image: temp, index: index });
        } else {
          specialImageArr2.push({ image: specialImage, index: index });
        }
      });
    }

    const promises = [];
    if (uploadTask) {
      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => reject(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              final_data.game_logo = url;
              resolve();
            });
          }
        );
      });
      promises.push(promise);
    }
    if (uploadTask1) {
      const promise = new Promise((resolve, reject) => {
        uploadTask1.on(
          "state_changed",
          (snapshot) => {},
          (err) => reject(err),
          () => {
            getDownloadURL(uploadTask1.snapshot.ref).then((url) => {
              final_data.game_image = url;
              resolve();
            });
          }
        );
      });
      promises.push(promise);
    }

    if (uploadTask2) {
      const promise = new Promise((resolve, reject) => {
        uploadTask2.on(
          "state_changed",
          (snapshot) => {},
          (err) => reject(err),
          () => {
            getDownloadURL(uploadTask2.snapshot.ref).then((url) => {
              final_data.game_image1 = url;
              resolve();
            });
          }
        );
      });
      promises.push(promise);
    }
    if (uploadTask3) {
      const promise = new Promise((resolve, reject) => {
        uploadTask3.on(
          "state_changed",
          (snapshot) => {},
          (err) => reject(err),
          () => {
            getDownloadURL(uploadTask3.snapshot.ref).then((url) => {
              final_data.game_image2 = url;
              resolve();
            });
          }
        );
      });
      promises.push(promise);
    }
    const tempArr = [];

    if (specialImageArr.length > 0) {
      specialImageArr.forEach((specialImage) => {
        const storageRef = ref(
          storage,
          "special_images/" +
            Date.now() +
            Math.floor(Math.random() * 9999) +
            specialImage.image.name
        );
        const uploadTask = uploadBytesResumable(storageRef, specialImage.image);
        const promise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  tempArr[specialImage.index] = url;
                  resolve();
                })
                .catch((error) => reject(error));
            }
          );
        });
        promises.push(promise);
      });
    }
    Promise.all(promises).then(() => {
      specialImageArr2.map((special) => {
        tempArr[special.index] = special.image;
      });
      // const newArr = specialImageArr2.concat(tempArr);

      final_data.special_images = tempArr;

      try {
        if (myContext.edit_activity) {
          updateDoc(
            doc(db, CollectionName.games, myContext.activity_id),
            final_data
          ).then((doc) => {
            resetContexts();

            setLoading(false);
            if (status === "draft") {
              alert("Draft Saved");
            } else {
              alert("Changes made Successfully");
            }
            setIsLoading(false);
            navigate("/activities");
          });
        } else {
          addDoc(collection(db, CollectionName.games), final_data).then(
            (doc) => {
              resetContexts();

              setLoading(false);
              alert("Activity created Successfully");
              navigate("/activities");
            }
          );
        }
      } catch (err) {
        alert(err);
      }
    });
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {isLoading && (
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

      <div className="container-fluid  sec-wrap z-2" style={{ zIndex: 2 }}>
        <Header />
        <div className="container-fluid head1">
          <nav className="navbar">
            <h4 class="prop-title">
              <img
                className="back-arrow"
                onClick={go_back}
                src={require("../assets/images/left.png")}
                width={20}
              ></img>
              &nbsp;Create Activity
            </h4>
            <button
              onClick={() => {
                saveDraft_completed();
              }}
              class="draft"
            >
              Save Draft
            </button>
          </nav>
        </div>
        <div className="container-fluid proposal-wrap">
          <Accordion
            disabled={accordion1}
            expanded={expanded === 1}
            onChange={handleChange(1)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                1. Activity Brief
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
              <h6 className="objective-title">
                What kind of program would you like to add?
              </h6>
              <p className="objective-description">
                Select the type of the event
              </p>
              <Tabs
                defaultIndex={myContext.game_type === "Inperson" ? 0 : 1}
                onSelect={(e) => {
                  myContext.setGame_type(e === 0 ? "Inperson" : "Virtual");
                }}
              >
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
                    <h6 className="objective-title">Select Category</h6>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onClick={(e) => {
                          myContext.setInperson_game_category("Group A");
                          setWarn_inperson_game_category(false);
                        }}
                        defaultChecked={
                          myContext.inperson_game_category === "Group A"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault1"
                      >
                        &nbsp;&nbsp;Group A (Indoor/Outdoor)
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onClick={(e) => {
                          myContext.setInperson_game_category("Group B");
                          setWarn_inperson_game_category(false);
                        }}
                        defaultChecked={
                          myContext.inperson_game_category === "Group B"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault2"
                      >
                        &nbsp;&nbsp;Group B (Indoor/Outdoor)
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                        onClick={(e) => {
                          myContext.setInperson_game_category("Outdoor");
                          setWarn_inperson_game_category(false);
                        }}
                        defaultChecked={
                          myContext.inperson_game_category === "Outdoor"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault3"
                      >
                        &nbsp;&nbsp;Outdoor
                      </label>
                    </div>
                    {warn_inperson_game_category ? (
                      <p className="warning mt-3">* Select the category</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="form-group">
                    <h6 className="objective-title mt-4">Activity Name</h6>
                    <input
                      type="text"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.inperson_game_name}
                      onChange={(e) => {
                        myContext.setInperson_game_name(e.target.value);
                        setWarn_inperson_game_name(false);
                      }}
                    ></input>
                  </div>
                  {warn_inperson_game_name ? (
                    <p className="warning mt-3">{game_name_warning}</p>
                  ) : (
                    ""
                  )}
                  <div class="form-group">
                    <h6 className="objective-title mt-4">Video Link</h6>
                    <input
                      type="url"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.inperson_game_url}
                      onChange={(e) => {
                        myContext.setInperson_game_url(e.target.value);
                        setWarn_inperson_game_url(false);
                        setWarn_inperson_invalid_url(false);
                      }}
                    ></input>
                  </div>
                  {warn_inperson_game_url ? (
                    <p className="warning mt-3">* Enter Activity Video URL</p>
                  ) : (
                    ""
                  )}
                  {warn_inperson_invalid_url ? (
                    <p className="warning mt-3">* URL is invalid</p>
                  ) : (
                    ""
                  )}
                  <div class="form-group">
                    <h6 className="objective-title mt-4">
                      Material Cost Per Team
                    </h6>
                    <input
                      type="number"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.inperson_game_cost}
                      onChange={(e) => {
                        myContext.setInperson_game_cost(e.target.value);
                        setWarn_inperson_game_cost(false);
                      }}
                    ></input>
                  </div>
                  {warn_inperson_game_cost ? (
                    <p className="warning mt-3">
                      * Material cost cannot be zero
                    </p>
                  ) : (
                    ""
                  )}
                  <div className="d-flex">
                    <div className="form-check col-lg-10 activity-check cursor-pointer">
                      &nbsp;
                      <input
                        class="form-check-input cursor-pointer"
                        type="checkbox"
                        name=""
                        id="formSelectOnlyMonth"
                        onChange={(e) => {
                          setSpecialActivity1(!specialActivity1);
                        }}
                        defaultChecked={specialActivity1}
                        checked={specialActivity1}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formSelectOnlyMonth"
                      >
                        &nbsp;&nbsp;Special Activity
                      </label>
                    </div>
                  </div>

                  <div class="form-group ">
                    <h6 className="objective-title mt-4 ">
                      Upload Activity logo
                    </h6>

                    <label
                      htmlFor="fileInput1"
                      className="btn btn-primary"
                      style={{ width: "130px" }}
                    >
                      Upload Image
                    </label>
                    <input
                      accept="image/png, image/gif, image/jpeg"
                      type="file"
                      id="fileInput1"
                      style={{ display: "none" }}
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={(e) => {
                        setCroppingLogo1(e.target.files[0]);
                      }}
                    />
                    {croppingLogo1 && (
                      <div className="py-2">
                        <Cropper
                          src={URL.createObjectURL(croppingLogo1)}
                          autoCropArea={1}
                          style={{ height: 400, width: "100%" }}
                          guides={false}
                          wheelZoomRatio={0.1}
                          aspectRatio={100 / 100}
                          initialAspectRatio={100 / 100}
                          ref={cropperRef1}
                        />
                        <div className="mt-2">fixed to 100px x 100px</div>

                        <button
                          className="btn btn-primary mt-2"
                          style={{ width: "130px" }}
                          onClick={handleCrop1}
                        >
                          Crop
                        </button>
                      </div>
                    )}

                    <div class="container">
                      {uploadedLogo1 && (
                        <div class="image-container mt-3 px-1">
                          <img
                            src={uploadedLogo1}
                            class="image"
                            width={200}
                            height={150}
                          />
                          <span
                            class="cross-icon mb-5"
                            onClick={(e) => {
                              setUploadedLogo1(null);
                              myContext.setInperson_game_logo(null);
                            }}
                          >
                            X
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="objective-description mb-3">
                    Recommended size: 100px x 100px
                  </p>

                  {warn_inperson_game_logo ? (
                    <p className="warning mt-3">{game_logo_warning}</p>
                  ) : (
                    ""
                  )}
                  <div class="form-group ">
                    <h6 className="objective-title mt-5">
                      Upload Activity images (
                      {uploadedImage1.length + " out of 3"})
                    </h6>
                    <p className="objective-description mb-2">
                      You must upload 3 images
                    </p>
                    <label
                      htmlFor="fileInput2"
                      className={`btn btn-primary ${
                        uploadedImage1.length >= 3 ? "disabled" : ""
                      }`}
                      style={{ width: "130px" }}
                    >
                      Upload Image
                    </label>
                    <input
                      className="toReplaceImage1"
                      accept="image/png, image/gif, image/jpeg"
                      type="file"
                      id="fileInput2"
                      style={{ display: "none" }}
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={(e) => {
                        if (e.target.files.length === 0) {
                        } else {
                          setCroppingImage1(e.target.files[0]);
                        }
                      }}
                    />
                    {croppingImage1 && (
                      <div className="py-2">
                        <Cropper
                          src={URL.createObjectURL(croppingImage1)}
                          style={{ height: 400, width: "100%" }}
                          guides={false}
                          wheelZoomRatio={0.1}
                          aspectRatio={340 / 230}
                          initialAspectRatio={340 / 230}
                          ref={cropperRef2}
                        />

                        <div className="mt-2">fixed to 340px x 230px</div>

                        <button
                          className="btn btn-primary mt-2"
                          style={{ width: "130px" }}
                          onClick={handleCrop2}
                        >
                          Crop
                        </button>
                      </div>
                    )}
                    <div class="container">
                      {" "}
                      {uploadedImage1.length > 0 &&
                        uploadedImage1.map((file, index) => {
                          return (
                            <div class="image-container mt-3 px-1">
                              <img
                                src={file}
                                class="image"
                                width={200}
                                height={150}
                              ></img>
                              <span
                                class="cross-icon"
                                onClick={(e) => {
                                  let tempArr = uploadedImage1;
                                  tempArr = tempArr.filter(
                                    (item) => item !== file
                                  );
                                  setUploadedImage1(tempArr);
                                  myContext.setInperson_game_images(tempArr);
                                }}
                              >
                                X
                              </span>
                              <span
                                class="replace-icon mt-3"
                                onClick={(e) => {
                                  setToReplaceImage1(index);
                                  setUpdateCount(updateCount + 1);
                                }}
                              >
                                Replace
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <p className="objective-description mb-3">
                    Recommended size: 340px x 230px
                  </p>

                  {warn_inperson_game_images ? (
                    <p className="warning mt-3">{game_images_warning}</p>
                  ) : (
                    ""
                  )}

                  {specialActivity1 && (
                    <>
                      <div class="form-group ">
                        <h6 className="objective-title mt-5">
                          Upload Special Activity images
                        </h6>
                        <p className="objective-description">
                          upload upto 4 images
                        </p>
                        <label
                          htmlFor="fileInput5"
                          className={`btn btn-primary ${
                            uploadedSpecial1.length >= 4 ? "disabled" : ""
                          }`}
                          style={{ width: "130px" }}
                        >
                          Upload Image
                        </label>
                        <input
                          accept="image/png, image/gif, image/jpeg"
                          type="file"
                          id="fileInput5"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            setCroppingSpecial1(e.target.files[0]);
                            e.target.value = null;
                          }}
                        />
                        {croppingSpecial1 && (
                          <div className="py-2">
                            <Cropper
                              src={URL.createObjectURL(croppingSpecial1)}
                              style={{ height: 400, width: "100%" }}
                              initialAspectRatio={1400 / 900}
                              guides={false}
                              wheelZoomRatio={0.1}
                              aspectRatio={1400 / 900}
                              ref={cropperRef5}
                            />
                            <div className="mt-2">fixed to 1400px x 900px</div>
                            <button
                              className="btn btn-primary mt-2"
                              style={{ width: "130px" }}
                              onClick={handleCrop5}
                            >
                              Crop
                            </button>
                          </div>
                        )}
                        <div class="container">
                          {" "}
                          {uploadedSpecial1.length > 0 &&
                            uploadedSpecial1.map((file, index) => {
                              return (
                                <div class="image-container mt-3 px-1">
                                  <img
                                    src={file}
                                    class="image"
                                    width={200}
                                    height={150}
                                  />
                                  <span
                                    class="cross-icon mb-5"
                                    onClick={(e) => {
                                      let tempArr = uploadedSpecial1;
                                      tempArr = tempArr.filter(
                                        (item) => item !== file
                                      );
                                      setUploadedSpecial1(tempArr);
                                      myContext.setInperson_specialgame_images(
                                        tempArr
                                      );
                                    }}
                                  >
                                    X
                                  </span>
                                  <span
                                    class="replace-icon mt-3"
                                    onClick={(e) => {
                                      setToReplaceSpecialImage1(index);
                                      setUpdateCount2(updateCount2 + 1);
                                    }}
                                  >
                                    Replace
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <p className="objective-description mb-3">
                        Recommended size: 1400px x 900px
                      </p>
                    </>
                  )}
                  {warn_inperson_specialgame_images ? (
                    <p className="warning mt-3">{specialgame_images_warning}</p>
                  ) : (
                    ""
                  )}

                  <div className="continue">
                    <button
                      class="btn btn-primary continue-button"
                      onClick={inperson_game_details_completed}
                    >
                      Continue
                    </button>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="col mt-5">
                    <h6 className="objective-title">Select Category</h6>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onClick={(e) => {
                          myContext.setVirtual_game_category("Team Based");
                          setWarn_virtual_game_category(false);
                        }}
                        defaultChecked={
                          myContext.virtual_game_category === "Team Based"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault1"
                      >
                        &nbsp;&nbsp;Team Based
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onClick={(e) => {
                          myContext.setVirtual_game_category("One-way flow");
                          setWarn_virtual_game_category(false);
                        }}
                        defaultChecked={
                          myContext.virtual_game_category === "One-way flow"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault2"
                      >
                        &nbsp;&nbsp;One-way Flow
                      </label>
                    </div>
                    <div class="form-check activity-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                        onClick={(e) => {
                          myContext.setVirtual_game_category("Web-link based");
                          setWarn_virtual_game_category(false);
                        }}
                        defaultChecked={
                          myContext.virtual_game_category === "Web-link based"
                        }
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="flexRadioDefault3"
                      >
                        &nbsp;&nbsp;Web-link Based
                      </label>
                    </div>
                    {warn_virtual_game_category ? (
                      <p className="warning mt-3">* Select the category</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="form-group">
                    <h6 className="objective-title mt-4">Activity Name</h6>
                    <input
                      type="text"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.virtual_game_name}
                      onChange={(e) => {
                        myContext.setVirtual_game_name(e.target.value);
                        setWarn_virtual_game_name(false);
                      }}
                    ></input>
                  </div>
                  {warn_virtual_game_name ? (
                    <p className="warning mt-3">{game_name_warning}</p>
                  ) : (
                    ""
                  )}
                  <div class="form-group">
                    <h6 className="objective-title mt-4">Video Link</h6>
                    <input
                      type="url"
                      class="form-control mb-3"
                      id="formGroupExampleInput"
                      value={myContext.virtual_game_url}
                      onChange={(e) => {
                        myContext.setVirtual_game_url(e.target.value);
                        setWarn_virtual_game_url(false);
                        setWarn_virtual_invalid_url(false);
                      }}
                    ></input>
                  </div>
                  {warn_virtual_game_url ? (
                    <p className="warning mt-3">* Enter Activity Video URL</p>
                  ) : (
                    ""
                  )}
                  {warn_virtual_invalid_url ? (
                    <p className="warning mt-3">* URL is invalid</p>
                  ) : (
                    ""
                  )}
                  <h6 className="objective-title mt-4 mb-3">Program Fee</h6>
                  <TableContainer component={Paper}>
                    <Table
                      size="larger"
                      aria-label="a dense table"
                      className="table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-nowrap tab-width">
                            PARTICIPANT COUNT
                          </TableCell>
                          <TableCell className="text-nowrap tab-width1">
                            FEE
                          </TableCell>
                          <TableCell>&nbsp;</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <TableCell>1 - 50 Pax</TableCell>
                          <TableCell>
                            {!change_slab1 ? (
                              myContext.act_slab1 === "" ? (
                                "0"
                              ) : (
                                myContext.act_slab1
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={slab1}
                                onChange={(e) => setSlab1(e.target.value)}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_slab1 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setSlab1(
                                    myContext.act_slab1 === ""
                                      ? "0"
                                      : myContext.act_slab1
                                  );
                                  setChange_slab1(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAct_slab1(slab1);
                                    setChange_slab1(false);
                                    setWarn_virtual_game_cost(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_slab1(false)}
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
                          <TableCell>51 - 100 Pax</TableCell>
                          <TableCell>
                            {!change_slab2 ? (
                              myContext.act_slab2 === "" ? (
                                "0"
                              ) : (
                                myContext.act_slab2
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={slab2}
                                onChange={(e) => setSlab2(e.target.value)}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_slab2 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setSlab2(
                                    myContext.act_slab2 === ""
                                      ? "0"
                                      : myContext.act_slab2
                                  );
                                  setChange_slab2(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAct_slab2(slab2);
                                    setChange_slab2(false);
                                    setWarn_virtual_game_cost(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_slab2(false)}
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
                          <TableCell>101 - 200 Pax</TableCell>
                          <TableCell>
                            {!change_slab3 ? (
                              myContext.act_slab3 === "" ? (
                                "0"
                              ) : (
                                myContext.act_slab3
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={slab3}
                                onChange={(e) => setSlab3(e.target.value)}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_slab3 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setSlab3(
                                    myContext.act_slab3 === ""
                                      ? "0"
                                      : myContext.act_slab3
                                  );
                                  setChange_slab3(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAct_slab3(slab3);
                                    setChange_slab3(false);
                                    setWarn_virtual_game_cost(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_slab3(false)}
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
                          <TableCell>201 - 350 Pax</TableCell>
                          <TableCell>
                            {!change_slab4 ? (
                              myContext.act_slab4 === "" ? (
                                "0"
                              ) : (
                                myContext.act_slab4
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={slab4}
                                onChange={(e) => setSlab4(e.target.value)}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_slab4 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setSlab4(
                                    myContext.act_slab4 === ""
                                      ? "0"
                                      : myContext.act_slab4
                                  );
                                  setChange_slab4(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAct_slab4(slab4);
                                    setChange_slab4(false);
                                    setWarn_virtual_game_cost(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_slab4(false)}
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
                          <TableCell>351 - 500 Pax</TableCell>
                          <TableCell>
                            {!change_slab5 ? (
                              myContext.act_slab5 === "" ? (
                                "0"
                              ) : (
                                myContext.act_slab5
                              )
                            ) : (
                              <input
                                type="number"
                                class="form-control"
                                id="formGroupExampleInput"
                                value={slab5}
                                onChange={(e) => setSlab5(e.target.value)}
                              ></input>
                            )}
                          </TableCell>
                          <TableCell>
                            {!change_slab5 ? (
                              <img
                                className="edit-table-icons"
                                onClick={(e) => {
                                  setSlab5(
                                    myContext.act_slab5 === ""
                                      ? "0"
                                      : myContext.act_slab5
                                  );
                                  setChange_slab5(true);
                                }}
                                src={require("../assets/images/edit.png")}
                                width={20}
                                height={20}
                              ></img>
                            ) : (
                              <div className="edit-table">
                                <img
                                  onClick={(e) => {
                                    myContext.setAct_slab5(slab5);
                                    setChange_slab5(false);
                                    setWarn_virtual_game_cost(false);
                                  }}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-tick.png")}
                                  width={15}
                                  height={15}
                                ></img>
                                <img
                                  onClick={(e) => setChange_slab5(false)}
                                  className="edit-table-icons"
                                  src={require("../assets/images/table-cancel.png")}
                                  width={15}
                                  height={15}
                                ></img>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {warn_virtual_game_cost ? (
                    <p className="warning mt-3">* Program Fee cannot be zero</p>
                  ) : (
                    ""
                  )}
                  <div className="d-flex">
                    <div className="form-check col-lg-10 activity-check cursor-pointer">
                      &nbsp;
                      <input
                        class="form-check-input cursor-pointer"
                        type="checkbox"
                        name=""
                        id="formSelectOnlyMonth"
                        onChange={(e) => {
                          setSpecialActivity2(!specialActivity2);
                        }}
                        defaultChecked={specialActivity2}
                        checked={specialActivity2}
                      ></input>
                      <label
                        class="form-check-label labels"
                        for="formSelectOnlyMonth"
                      >
                        &nbsp;&nbsp;Special Activity
                      </label>
                    </div>
                  </div>

                  <div class="form-group ">
                    <h6 className="objective-title mt-4">
                      Upload Activity logo
                    </h6>

                    <label
                      htmlFor="fileInput1"
                      className="btn btn-primary"
                      style={{ width: "130px" }}
                    >
                      Upload Image
                    </label>
                    <input
                      accept="image/png, image/gif, image/jpeg"
                      type="file"
                      id="fileInput1"
                      style={{ display: "none" }}
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={(e) => {
                        setCroppingLogo2(e.target.files[0]);
                      }}
                    />
                    {croppingLogo2 && (
                      <div className="py-2">
                        <Cropper
                          src={URL.createObjectURL(croppingLogo2)}
                          style={{ height: 400, width: "100%" }}
                          guides={false}
                          wheelZoomRatio={0.1}
                          aspectRatio={100 / 100}
                          initialAspectRatio={100 / 100}
                          ref={cropperRefV1}
                        />
                        <div className="mt-2">fixed to 100px x 100px</div>

                        <button
                          className="btn btn-primary mt-2"
                          style={{ width: "130px" }}
                          onClick={handleCropV1}
                        >
                          Crop
                        </button>
                      </div>
                    )}

                    <div class="container">
                      {uploadedLogo2 && (
                        <div class="image-container mt-3 px-1">
                          <img
                            src={uploadedLogo2}
                            class="image"
                            width={200}
                            height={150}
                          />
                          <span
                            class="cross-icon mb-5"
                            onClick={(e) => {
                              setUploadedLogo2(null);
                              myContext.setVirtual_game_logo(null);
                            }}
                          >
                            X
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="objective-description mb-3">
                    Recommended size: 100px x 100px
                  </p>

                  {warn_virtual_game_logo ? (
                    <p className="warning mt-3">{game_logo_warning}</p>
                  ) : (
                    ""
                  )}

                  <div class="form-group ">
                    <h6 className="objective-title mt-5">
                      Upload Activity images (
                      {uploadedImageV1.length + " out of 3"})
                    </h6>
                    <p className="objective-description">
                      You must upload 3 images
                    </p>
                    <label
                      htmlFor="fileInputV3"
                      className={`btn btn-primary ${
                        uploadedImageV1.length >= 3 ? "disabled" : ""
                      }`}
                      style={{ width: "130px" }}
                    >
                      Upload Image
                    </label>
                    <input
                      className="toReplaceImageV1"
                      accept="image/png, image/gif, image/jpeg"
                      type="file"
                      id="fileInputV3"
                      style={{ display: "none" }}
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                      onChange={(e) => {
                        setCroppingImageV1(e.target.files[0]);
                      }}
                    />
                    {croppingImageV1 && (
                      <div className="py-2">
                        <Cropper
                          src={URL.createObjectURL(croppingImageV1)}
                          style={{ height: 400, width: "100%" }}
                          guides={false}
                          cropBoxResizable={false}
                          wheelZoomRatio={0.1}
                          aspectRatio={340 / 230}
                          initialAspectRatio={340 / 230}
                          ref={cropperRefV2}
                        />
                        <div className="mt-2">fixed to 340px x 230px</div>

                        <button
                          className="btn btn-primary mt-2"
                          style={{ width: "130px" }}
                          onClick={handleCropV2}
                        >
                          Crop
                        </button>
                      </div>
                    )}
                    <div class="container">
                      {" "}
                      {uploadedImageV1.length > 0 &&
                        uploadedImageV1.map((file, index) => {
                          return (
                            <div class="image-container mt-3 px-1">
                              <img
                                src={file}
                                class="image"
                                width={200}
                                height={150}
                              ></img>
                              <span
                                class="cross-icon"
                                onClick={(e) => {
                                  let tempArr = uploadedImageV1;
                                  tempArr = tempArr.filter(
                                    (item) => item !== file
                                  );
                                  setUploadedImageV1(tempArr);
                                  myContext.setVirtual_game_images(tempArr);
                                }}
                              >
                                X
                              </span>
                              <span
                                class="replace-icon mt-3"
                                onClick={(e) => {
                                  setToReplaceImageV1(index);
                                  setUpdateCount3(updateCount + 1);
                                }}
                              >
                                Replace
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <p className="objective-description mb-3">
                    Recommended size: 340px x 230px
                  </p>

                  {warn_virtual_game_images ? (
                    <p className="warning mt-3">{game_images_warning}</p>
                  ) : (
                    ""
                  )}

                  {specialActivity2 && (
                    <>
                      {/* <div class="form-group ">
                      <h6 className="objective-title mt-5">
                        Upload Special Activity images
                      </h6>
                      <p className="objective-description">
                        upload upto 4 images
                      </p>
                      <label
                        htmlFor="fileInput5"
                        className={`btn btn-primary ${
                          uploadedSpecial2.length >= 4 ? "disabled" : ""
                        }`}
                        style={{ width: "130px" }}
                      >
                        Upload Image
                      </label>
                      <input
                        accept="image/png, image/gif, image/jpeg"
                        type="file"
                        id="fileInput5"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          setCroppingSpecial2(e.target.files[0]);
                          e.target.value = null;
                        }}
                      />
                      {croppingSpecial2 && (
                        <div>
                          <Cropper
                            src={URL.createObjectURL(croppingSpecial2)}
                            style={{ height: 400, width: "100%" }}
                            initialAspectRatio={16 / 9}
                            guides={false}
                            ref={cropperRefV5}
                          />
                          <button
                            style={{ width: "120px" }}
                            className="mt-2"
                            onClick={handleCropV5}
                          >
                            Crop
                          </button>
                        </div>
                      )}
                      <div class="container">
                        {" "}
                        {uploadedSpecial2.length > 0 &&
                          uploadedSpecial2.map((file) => {
                            return (
                              <div class="image-container mt-3 px-1">
                                <img
                                  src={file}
                                  class="image"
                                  width={150}
                                  height={100}
                                ></img>
                                <span
                                  class="cross-icon"
                                  onClick={(e) => {
                                    let tempArr = uploadedSpecial2;
                                    tempArr = tempArr.filter(
                                      (item) => item !== file
                                    );
                                    setUploadedSpecial2(tempArr);
                                    myContext.setVirtual_specialgame_images(
                                      tempArr
                                    );
                                  }}
                                >
                                  X
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div> */}
                      <div class="form-group ">
                        <h6 className="objective-title mt-5">
                          Upload Special Activity images
                        </h6>
                        <p className="objective-description">
                          upload upto 4 images
                        </p>
                        <label
                          htmlFor="fileInputV5"
                          className={`btn btn-primary ${
                            uploadedSpecial2.length >= 4 ? "disabled" : ""
                          }`}
                          style={{ width: "130px" }}
                        >
                          Upload Image
                        </label>
                        <input
                          accept="image/png, image/gif, image/jpeg"
                          type="file"
                          id="fileInputV5"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            setCroppingSpecial2(e.target.files[0]);
                            e.target.value = null;
                          }}
                        />
                        {croppingSpecial2 && (
                          <div className="py-2">
                            <Cropper
                              src={URL.createObjectURL(croppingSpecial2)}
                              style={{ height: 400, width: "100%" }}
                              initialAspectRatio={1400 / 900}
                              guides={false}
                              wheelZoomRatio={0.1}
                              aspectRatio={1400 / 900}
                              ref={cropperRefV5}
                            />
                            <div className="mt-2">fixed to 1400px x 900px</div>
                            <button
                              className="btn btn-primary mt-2"
                              style={{ width: "130px" }}
                              onClick={handleCropV5}
                            >
                              Crop
                            </button>
                          </div>
                        )}
                        <div class="container">
                          {" "}
                          {uploadedSpecial2.length > 0 &&
                            uploadedSpecial2.map((file, index) => {
                              return (
                                <div class="image-container mt-3 px-1">
                                  <img
                                    src={file}
                                    class="image"
                                    width={200}
                                    height={150}
                                  />
                                  <span
                                    class="cross-icon"
                                    onClick={(e) => {
                                      let tempArr = uploadedSpecial2;
                                      tempArr = tempArr.filter(
                                        (item) => item !== file
                                      );
                                      setUploadedSpecial2(tempArr);
                                      myContext.setVirtual_specialgame_images(
                                        tempArr
                                      );
                                    }}
                                  >
                                    X
                                  </span>
                                  <span
                                    class="replace-icon mt-3"
                                    onClick={(e) => {
                                      setToReplaceSpecialImage2(index);
                                      setUpdateCount4(updateCount2 + 1);
                                    }}
                                  >
                                    Replace
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <p className="objective-description mb-3">
                        Recommended size: 1400px x 900px
                      </p>
                    </>
                  )}
                  {warn_virtual_specialgame_images ? (
                    <p className="warning mt-3">{specialgame_images_warning}</p>
                  ) : (
                    ""
                  )}

                  <div className="continue">
                    <button
                      class="btn btn-primary continue-button"
                      onClick={virtual_game_details_completed}
                    >
                      Continue
                    </button>
                  </div>
                </TabPanel>
              </Tabs>
            </AccordionDetails>
          </Accordion>

          <Accordion
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
              <div>
                <div class="form-group">
                  <label for="formGroupExampleInput" className="labels">
                    Objective
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="6"
                    onChange={(e) => {
                      myContext.setGame_objective(e.target.value);
                      setWarn_objective_state(false);
                    }}
                    value={myContext.game_objective}
                  ></textarea>
                </div>
                <p className="objective-description char-count mb-3 mt-2">
                  {myContext.game_objective.length}/380
                </p>
              </div>
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
          <Accordion
            disabled={accordion3}
            expanded={expanded === 3}
            onChange={handleChange(3)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontSize={20} className="accordion-title">
                3. Description
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
              <div className="change-addon-form row mt-4">
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Outcome 1
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_title1(e.target.value);
                      setWarn_outcome1(false);
                    }}
                    value={myContext.key_title1}
                  ></textarea>
                  <p className="objective-description mb-3 mt-2">
                    Outcome should be a 2-3 word phrase
                    <span className="char-count">
                      {myContext.key_title1.length}/15
                    </span>
                  </p>
                  {warn_outcome1 ? (
                    <p className="warning mt-4">{warn_desc1}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Description 1
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_description1(e.target.value);
                      setWarn_description1(false);
                    }}
                    value={myContext.key_description1}
                  ></textarea>
                  <p className="objective-description char-count mb-3 mt-2">
                    {myContext.key_description1.length}/120
                  </p>
                  {warn_description1 ? (
                    <p className="warning mt-4">{warn_desc4}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="change-addon-form row mt-4">
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Outcome 2
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_title2(e.target.value);
                      setWarn_outcome2(false);
                    }}
                    value={myContext.key_title2}
                  ></textarea>
                  <p className="objective-description mb-3 mt-2">
                    Outcome should be a 2-3 word phrase
                    <span className="char-count">
                      {myContext.key_title2.length}/15
                    </span>
                  </p>
                  {warn_outcome2 ? (
                    <p className="warning mt-4">{warn_desc2}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Description 2
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_description2(e.target.value);
                      setWarn_description2(false);
                    }}
                    value={myContext.key_description2}
                  ></textarea>
                  <p className="objective-description char-count mb-3 mt-2">
                    {myContext.key_description2.length}/120
                  </p>
                  {warn_description2 ? (
                    <p className="warning mt-4">{warn_desc5}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="change-addon-form row mt-4">
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Outcome 3
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_title3(e.target.value);
                      setWarn_outcome3(false);
                    }}
                    value={myContext.key_title3}
                  ></textarea>
                  <p className="objective-description mb-3 mt-2">
                    Outcome should be a 2-3 word phrase
                    <span className="char-count">
                      {myContext.key_title3.length}/15
                    </span>
                  </p>
                  {warn_outcome3 ? (
                    <p className="warning mt-4">{warn_desc3}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Description 3
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      myContext.setKey_description3(e.target.value);
                      setWarn_description3(false);
                    }}
                    value={myContext.key_description3}
                  ></textarea>
                  <p className="objective-description char-count mb-3 mt-2">
                    {myContext.key_description3.length}/120
                  </p>
                  {warn_description3 ? (
                    <p className="warning mt-4">{warn_desc6}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="continue">
                <button
                  class="btn btn-primary continue-button"
                  onClick={description_completed}
                >
                  {loading ? (
                    <div class="spinner-border spinner-border-sm"></div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Create_activity;
