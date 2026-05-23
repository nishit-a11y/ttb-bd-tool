import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import inperson_img from "../../assets/images/inperson.svg";
import virtual_img from "../../assets/images/virtual.svg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import isUrl from "is-url";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FilerobotImageEditor from "react-filerobot-image-editor";
import Paper from "@mui/material/Paper";
import "cropperjs/dist/cropper.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "react-tabs/style/react-tabs.css";
import {
  setGameName,
  setGameURL,
  setMaterialCost,
  setCategory,
  setProgramFee,
  setImagesLogo,
  setImagesActivity,
  setImagesSpecial,
  setSpecialActivity,
  setgame_type,
  setImageCover,
} from "./CreateActivitySlice";
import {
  inpersonButtonClass,
  inpersonSelectCategoryItems,
  programFeeTableData,
  virtualButtonClass,
  virtualSelectCategoryItems,
} from "./constant";

const ActivityBrief = ({
  completed,
  expanded,
  disabled,
  setComleted,
  setExpanded,
  setDisabled,
  handleContinue,
}) => {
  const dispatch = useDispatch();
  const [gameType, setGameType] = useState("Inperson");
  const inpersonButtonClass =
    gameType === "Inperson" ? "tab-button--selected" : "";
  const virtualButtonClass =
    gameType === "Virtual" ? "tab-button--selected" : "";

  const SelectCategory = () => {
    const dispatch = useDispatch();
    const { category } = useSelector((state) => state.createActivity);
    let typeArr = [];
    switch (gameType) {
      case "Inperson": {
        typeArr = inpersonSelectCategoryItems;
        break;
      }
      case "Virtual": {
        typeArr = virtualSelectCategoryItems;
        break;
      }
      default: {
        typeArr = inpersonSelectCategoryItems;
        break;
      }
    }

    return (
      <div className="col mt-5">
        <h6 className="objective-title">Select Category *</h6>
        {typeArr.map((item, index) => {
          return (
            <>
              <div class="form-check activity-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id={`radio-${index}`}
                  name="activity"
                  value={item}
                  checked={category === item}
                  onChange={(e) => {
                    dispatch(setCategory(e.target.value));
                  }}
                  style={{ cursor: "pointer" }}
                ></input>
                <label
                  class="form-check-label labels"
                  htmlFor={`radio-${index}`}
                  style={{ cursor: "pointer" }}
                >
                  &nbsp;&nbsp; {item}
                </label>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  //handles Activity Name, Video Link, Material Cost Per Team, Program Fee
  const ActivityDetails = () => {
    const dispatch = useDispatch();
    const { game_name, game_type, material_cost, program_fee, game_url } =
      useSelector((state) => state.createActivity);
    const [isEditing, setisEditing] = useState(null);
    const [CurrentFeeValue, setCurrentFeeValue] = useState(0);

    return (
      <>
        {" "}
        <div class="form-group">
          <h6 className="objective-title mt-4">Activity Name *</h6>
          <input
            type="text"
            class="form-control mb-3"
            id="formGroupExampleInput"
            value={game_name}
            onChange={(e) => {
              dispatch(setGameName(e.target.value));
            }}
          ></input>
        </div>
        <div class="form-group">
          <h6 className="objective-title mt-4">Video Link</h6>
          <input
            type="url"
            class="form-control mb-3"
            id="formGroupExampleInput"
            value={game_url}
            onChange={(e) => {
              dispatch(setGameURL(e.target.value));
            }}
          ></input>
        </div>
        {gameType === "Inperson" ? (
          <>
            {" "}
            <div class="form-group">
              <h6 className="objective-title mt-4">Material Cost Per Team *</h6>
              <input
                type="text"
                class="form-control mb-3"
                id="formGroupExampleInput"
                value={material_cost}
                onChange={(e) => {
                  const re = /^[0-9]*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    dispatch(setMaterialCost(e.target.value));
                  }
                }}
              ></input>
            </div>
          </>
        ) : (
          <>
            {" "}
            <h6 className="objective-title mt-4 mb-3">Program Fee</h6>
            <TableContainer component={Paper}>
              <Table size="larger" aria-label="a dense table" className="table">
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
                  {programFeeTableData.map((rowData, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{rowData}</TableCell>
                        <TableCell>
                          {isEditing != null && isEditing === index ? (
                            <input
                              type="text"
                              className="form-control"
                              id="formGroupExampleInput"
                              value={CurrentFeeValue}
                              onChange={(e) => {
                                const re = /^[0-9]*$/;
                                if (
                                  e.target.value === "" ||
                                  re.test(e.target.value)
                                ) {
                                  setCurrentFeeValue(
                                    e.target.value === ""
                                      ? ""
                                      : Math.max(0, e.target.value)
                                  );
                                }
                              }}
                            />
                          ) : (
                            program_fee?.[index]
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing != null && isEditing === index ? (
                            <>
                              <img
                                onClick={() => {
                                  dispatch(
                                    setProgramFee(
                                      program_fee.map((item, i) => {
                                        if (i === index) {
                                          return CurrentFeeValue || 0;
                                        }
                                        return item;
                                      })
                                    )
                                  );

                                  setisEditing(null);
                                }}
                                className="edit-table-icons"
                                src={require("../../assets/images/table-tick.png")}
                                width={15}
                                height={15}
                              />
                              <img
                                onClick={() => {
                                  setisEditing(null);
                                }}
                                className="edit-table-icons"
                                src={require("../../assets/images/table-cancel.png")}
                                width={15}
                                height={15}
                              />
                            </>
                          ) : (
                            <img
                              onClick={() => {
                                setisEditing(index);
                                setCurrentFeeValue(program_fee[index]);
                              }}
                              className="edit-table-icons"
                              src={require("../../assets/images/edit.png")}
                              width={20}
                              height={20}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </>
    );
  };

  //handles all image uploads
  const UploadImages = () => {
    const dispatch = useDispatch();
    const {
      specialActivity,
      firebaseURLLogo,
      firebaseURLActivity,
      firebaseURLSpecial,
      imagesLogo,
      imagesActivity,
      imagesSpecial,
      imageCover
    } = useSelector((state) => state.createActivity);
    let imageType = [
      { name: "Upload Cover Image", size: "460px x 820px", subtitle: "" },
      { name: "Upload Activity logo *", size: "100px x 100px", subtitle: "" },
      {
        name: "Upload Activity images *",
        size: "340px x 230px",
        subtitle: "You must upload 3 images",
      }
    ];
    const [imageTypeState, setImageTypeState] = useState([]);
    const [openFileCropper, setOpenFileCropper] = useState(null);
    const [ReplaceTypeIndex, setReplaceTypeIndex] = useState({
      type: null,
      index: null,
    });
    const [source, setSource] = useState(null);
    const editorRef = useRef(null);

    useEffect(() => {
      if (specialActivity) {
        if (
          imageType.indexOf("Upload Special Activity images") === -1 &&
          !imageType[3]
        ) {
          imageType.push({
            name: "Upload Special Activity images",
            size: "1440px x 810px",
            subtitle: "upload upto 4 images",
          });
        }
      } else {
        imageType.splice(3, 1);
      }

      setImageTypeState(imageType);
    }, [specialActivity]);
    useEffect(() => {
      if (source && source != "") {
        console.log(source);
        console.log(openFileCropper);
      }
    }, [source]);

    //when image is saved
    function setImageinState(image, index, prevState) {
      const { type, index: replaceIndex } = ReplaceTypeIndex;
      if (type !== null && replaceIndex !== null) {
        switch (index) {
          case 0: {
            let newArray = [...type];
            console.log(newArray)
            newArray[replaceIndex] = image.imageBase64;
            dispatch(setImageCover(newArray));
            break;
          }
          case 1: {
            let newArray = [...type];
            newArray[replaceIndex] = image.imageBase64;
            dispatch(setImagesLogo(newArray));
            break;
          }
          case 2: {
            let newArray = [...type];
            newArray[replaceIndex] = image.imageBase64;
            dispatch(setImagesActivity(newArray));
            break;
          }
          case 3: {
            let newArray = [...type];
            newArray[replaceIndex] = image.imageBase64;
            dispatch(setImagesSpecial(newArray));
            break;
          }
          default:
            break;
        }
      } else {
        switch (index) {
          case 0: {
            let temp = [...prevState];
            console.log(temp)
            temp.push(image.imageBase64);
            dispatch(setImageCover(temp));
            break;
          }
          case 1: {
            let temp = [...prevState];
            temp.push(image.imageBase64);
            dispatch(setImagesLogo(temp));
            break;
          }
          case 2: {
            let temp = [...prevState];
            temp.push(image.imageBase64);
            dispatch(setImagesActivity(temp));
            break;
          }
          case 3: {
            let temp = [...prevState];
            temp.push(image.imageBase64);
            dispatch(setImagesSpecial(temp));
            break;
            break;
          }
          default:
            break;
        }
      }
    }

    return (
      <>
        <div className="d-flex">
          <div className="form-check col-lg-10 activity-check cursor-pointer">
            &nbsp;
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              name=""
              id="formSelectOnlyMonth"
              onChange={(e) => {
                dispatch(setSpecialActivity(!specialActivity));
              }}
              defaultChecked={specialActivity}
              checked={specialActivity}
            ></input>
            <label class="form-check-label labels" for="formSelectOnlyMonth">
              &nbsp;&nbsp;Special Activity
            </label>
          </div>
        </div>
        {imageTypeState?.map((type, index) => {

          const filteredImageCover = imageCover.filter((image) => image && image !== "");
          console.log("cover images size", filteredImageCover.length)

          const filteredImagesLogo = imagesLogo.filter((image) => image !== "");

          const filteredImagesActivity = imagesActivity.filter(
            (image) => image !== ""
          );
          const filteredImagesSpecial = imagesSpecial.filter(
            (image) => image !== ""
          );

          let imageType =
            index === 0
              ? filteredImageCover
              : index === 1
                ? filteredImagesLogo
                :index ===2
                ? filteredImagesActivity
                : filteredImagesSpecial;

          return (
            <React.Fragment key={index}>
              <div class="form-group ">
                <h6 className="objective-title mt-4 ">{type.name}</h6>
                <p className="objective-description mb-2">{type.subtitle} </p>
                <label
                  id={`fileLabel${index}`}
                  htmlFor={`fileInput${index}`}
                  className={`btn btn-primary ${
                    index === 0
                      ? filteredImageCover.length > 0
                        ? "disabled"
                        : ""
                      : index === 1
                        ? filteredImagesLogo.length > 0
                          ? "disabled"
                          : ""
                          :index === 2
                        ? filteredImagesActivity.length > 2
                          ? "disabled"
                          : ""
                        : filteredImagesSpecial.length > 3
                          ? "disabled"
                          : ""
                    }`}
                  style={{ width: "130px" }}
                >
                  Upload Image
                </label>
                <input
                  accept="image/png, image/gif, image/jpeg"
                  type="file"
                  id={`fileInput${index}`}
                  key={`fileInput${index}`}
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      if (reader.readyState === FileReader.DONE) {
                        const image = new Image();
                        image.onload = () => {
                          setSource(image);
                          setOpenFileCropper(index);
                        };
                        image.src = reader.result;
                      }
                    };

                    if (file) {
                      if (file.size > 1024 * 1024) {
                        alert("File size should be less than 1 MB");
                        return;
                      }
                      reader.readAsDataURL(file);
                    }
                    event.target.value = null;
                  }}
                />
                {openFileCropper === index && source && (
                  <div className="py-2">
                    <FilerobotImageEditor
                      ref={editorRef}
                      source={source && source.src}
                      onClose={() => {
                        setSource(null);
                        setOpenFileCropper(null);

                        setReplaceTypeIndex({
                          type: null,
                          index: null,
                        });
                        if (editorRef.current) {
                          editorRef.current.clear();
                        }
                      }}
                      Crop={{
                        presetsItems: [
                          {
                            titleKey: "cover image",
                            descriptionKey: "460:820",
                            ratio: 460 / 820,
                          },
                          {
                            titleKey: "logo image",
                            descriptionKey: "1:1",
                            ratio: 1 / 1,
                          },
                          {
                            titleKey: "activity image",
                            descriptionKey: "340:230",
                            ratio: 340 / 230,
                          },
                          {
                            titleKey: "special image",
                            descriptionKey: "1440:810",
                            ratio: 1440 / 810,
                          },
                        ],
                      }}
                      onSave={(image) => {
                        setImageinState(image, index, imageType);
                        setOpenFileCropper(null);
                        setReplaceTypeIndex({
                          type: null,
                          index: null,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="container">
                {imageType?.map((image, i) => (
                  <div
                    class=" image-container mt-3 px-1"
                    key={`${imageType}-${i}`}
                  >
      
                      <img src={image} class="image" width={200} height={150} />
              
                    <span
                      class="cross-icon"
                      onClick={(e) => {
                        let newArray = [...imageType];
                        newArray.splice(i, 1);
                        index === 0
                          ? dispatch(setImageCover(newArray))
                          : index === 1
                            ? dispatch(setImagesLogo(newArray))
                            :index === 2
                            ? dispatch(setImagesActivity(newArray))
                            : dispatch(setImagesSpecial(newArray));
                      }}
                    >
                      X
                    </span>
                    <span
                      class="replace-icon mt-3"
                      onClick={(e) => {
                        setReplaceTypeIndex({
                          type: imageType,
                          index: i,
                        });
                        const element = document.getElementById(
                          `fileInput${index}`
                        );
                        if (element) {
                          element.click();
                        }
                      }}
                    >
                      Replace
                    </span>
                  </div>
                ))}
              </div>
              <p className="objective-description mb-3">
                Recommended size: {type.size}
              </p>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const TabPanelTemplate = ({ setType }) => {
    const dispatch = useDispatch();
    const {
      game_name,
      material_cost,
      game_type,
      game_url,
      category,
      program_fee,
      imagesLogo,
      imageCover,
      imagesActivity,
      editActivityData,
    } = useSelector((state) => state.createActivity);

    function validateActivityBrief() {
      const filteredImagesLogo = imagesLogo.filter((image) => image !== "");
      const filteredImageCover = imageCover.filter((image) => image !== "");

      const filteredImagesActivity = imagesActivity.filter(
        (image) => image !== ""
      );
      dispatch(setgame_type(gameType));
      if (!category || category === "") {
        alert("Please select a category ");
        return false;
      } else if (!game_name || game_name === "") {
        alert("Please enter activity name");
        return false;
      } else if (!isUrl(game_url) && game_url.length !== 0) {
        alert("Please enter a valid video link URL");
        return false;
      } else if (
        gameType === "Inperson" &&
        (!material_cost || material_cost === 0)
      ) {
        alert("Please enter material cost");
        return false;
      } else if (
        gameType === "Virtual" &&
        (!program_fee ||
          program_fee.length === 0 ||
          program_fee.every((element) => element === 0))
      ) {
        alert("Please enter program fee");
        return false;
      }
       else if (!filteredImagesLogo || filteredImagesLogo.length < 1) {
        alert("Please upload an activity logo");
        return false;
      } else if (!filteredImagesActivity || filteredImagesActivity.length < 3) {
        alert("Please upload atleast 3 activity images");
        return false;
      } else {
        return true;
      }
    }
    useEffect(() => {
      setType(game_type);
    }, []);
    return (
      <>
        {" "}
        <SelectCategory />
        <ActivityDetails />
        <UploadImages />
        <div className="continue">
          <button
            class="btn btn-primary continue-button"
            onClick={() => {
              if (validateActivityBrief()) {
                handleContinue();
              }
            }}
          >
            Continue
          </button>
        </div>
      </>
    );
  };

  return (
    <Accordion
      disabled={disabled}
      expanded={expanded}
      onChange={() => {
        let answer = false;
        // if (
        //   imagesLogo.length > 0 ||
        //   imagesActivity.length > 0 ||
        //   imagesSpecial.length > 0
        // ) {
        //   answer = window.confirm(
        //     "Uploaded images will be lost.  Do you want to continue?"
        //   );
        //   if (answer) setExpanded(!expanded);
        // } else {
        setExpanded(!expanded);
        // }
      }}
    >
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Typography fontSize={20} className="accordion-title">
          1. Activity Brief
        </Typography>
        {completed && (
          <img
            className="tick"
            src={require("../../assets/images/tick.png")}
            width={20}
            height={20}
          ></img>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <h6 className="objective-title">
          What kind of program would you like to add?
        </h6>
        <p className="objective-description">Select the type of the event</p>

        <div className="button-container">
          <button
            className={`tab-button inperson ${inpersonButtonClass}`}
            onClick={() => {
              setGameType("Inperson");
              dispatch(setgame_type("Inperson"));
              dispatch(setCategory(""));
              dispatch(setProgramFee([0, 0, 0, 0, 0]));
            }}
          >
            <img className="types-img" src={inperson_img}></img>
            <p className="mt-3 labels types-tab">IN PERSON</p>
          </button>
          <button
            className={`tab-button virtual ${virtualButtonClass}`}
            onClick={() => {
              setGameType("Virtual");
              dispatch(setgame_type("Virtual"));
              dispatch(setCategory(""));
              dispatch(setMaterialCost(0));
            }}
          >
            <img className="types-img" src={virtual_img}></img>
            <p className="mt-2 labels types-tab">VIRTUAL</p>
          </button>
          {
            <TabPanelTemplate
              setType={(type) => {
                setGameType(type);
              }}
            />
          }
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
export default ActivityBrief;
