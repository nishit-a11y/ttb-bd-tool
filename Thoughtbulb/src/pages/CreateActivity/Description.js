import React, { useState, useContext, useEffect, useRef } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import "cropperjs/dist/cropper.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "react-tabs/style/react-tabs.css";
import { Oval } from "react-loader-spinner";

import { reset, setDescriptionData } from "./CreateActivitySlice";
import { useNavigate } from "react-router-dom";

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
import moment from "moment";
import { CollectionName } from "../collection_config";
import {fire} from "../../components/Firebase";
import { pushToFBStorage } from "./utils";

const Description = ({
  completed,
  expanded,
  disabled,
  setComleted,
  setExpanded,
  setDisabled,
  handleContinue,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore(fire);
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const descriptionHeadings = [1, 2, 3];
  const {
    game_name,
    objectiveData,
    descriptionData,
    game_url,
    material_cost,
    game_type,
    category,
    program_fee,
    firebaseURLLogo,
    firebaseURLActivity,
    firebaseURLSpecial,
    imagesLogo,
    imagesActivity,
    editActivity,
    imagesSpecial,
  } = useSelector((state) => state.createActivity);

  async function pushDataToDB() {
    const groupedURLs = await pushToFBStorage();

    const finalData = {
      game_name: game_name ?? "",
      game_name_small: game_name?.toLowerCase() ?? "",
      game_url: game_url ?? "",
      material_cost: material_cost ?? 0,
      category: category ?? "",
      program_fee: program_fee ?? [0, 0, 0, 0, 0],
      game_objective: objectiveData ?? "",
      key_title1: descriptionData?.title?.[0] ?? "",
      key_title2: descriptionData?.title?.[1] ?? "",
      key_title3: descriptionData?.title?.[2] ?? "",
      key_description1: descriptionData?.description?.[0] ?? "",
      key_description2: descriptionData?.description?.[1] ?? "",
      key_description3: descriptionData?.description?.[2] ?? "",
      game_type: game_type ?? "Inperson",
      isDeleted: false,
      created_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
      game_image: groupedURLs["games_activity"]?.[0] ?? "",
      game_image1: groupedURLs["games_activity"]?.[1] ?? "",
      game_image2: groupedURLs["games_activity"]?.[2] ?? "",
      game_logo: groupedURLs["games_logo"][0] ?? "",
      special_images: groupedURLs["games_special"] ?? [],
      game_cover: (groupedURLs.games_cover && groupedURLs.games_cover[0]) ?? ""
    };
    finalData["draft"] = false;
    if (editActivity != null) {
      updateDoc(doc(db, CollectionName.games, editActivity), finalData).then(
        (doc) => {
          dispatch(reset());
          alert("Activity created Successfully");
          navigate("/activities");
        }
      );
    } else {
      addDoc(collection(db, CollectionName.games), finalData).then((doc) => {
        dispatch(reset());
        // setLoading(false);
        alert("Activity created Successfully");
        navigate("/activities");
      });
    }
    setIsLoading(false);
  }

  function validateDescription() {
    console.log(descriptionData.title, descriptionData.description);
    if (
      !descriptionData ||
      descriptionData?.title.includes("") ||
      descriptionData?.description.includes("") ||
      descriptionData?.title.some((title) => title.length < 3) ||
      descriptionData?.description.some((description) => description.length < 3)
    ) {
      alert("Please fill all the outcomes and description");
      return false;
    } else if (descriptionData?.title.some((title) => title.length > 15)) {
      alert("All Outcomes should be less than 15 characters");
      return false;
    } else if (
      descriptionData?.description.some(
        (description) => description.length > 120
      )
    ) {
      alert("All Descriptions should be less than 120 characters");
      return false;
    } else {
      return true;
    }
  }
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
      <Accordion
        disabled={disabled}
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
        }}
      >
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography fontSize={20} className="accordion-title">
            3. Description
          </Typography>
          {completed ? (
            <img
              className="tick"
              src={require("../../assets/images/tick.png")}
              width={20}
              height={20}
            ></img>
          ) : (
            ""
          )}
        </AccordionSummary>
        <AccordionDetails>
          {descriptionHeadings.map((data, index) => {
            return (
              <div className="change-addon-form row mt-4">
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Outcome {index + 1} *
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={descriptionData?.title?.[index]}
                    onChange={(e) => {
                      dispatch(
                        setDescriptionData({
                          ...descriptionData,
                          title: [
                            ...descriptionData?.title.slice(0, index),
                            e.target.value,
                            ...descriptionData?.title.slice(index + 1),
                          ],
                        })
                      );
                    }}
                  ></textarea>
                  <p className="objective-description mb-3 mt-2">
                    Outcome should be a 2-3 word phrase
                    <span className="char-count">
                      {descriptionData?.title?.[index]?.length}
                      /15
                    </span>
                  </p>
                </div>
                <div class="form-group col">
                  <label for="formGroupExampleInput" className="labels">
                    Description {index + 1} *
                  </label>
                  <textarea
                    class="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => {
                      dispatch(
                        setDescriptionData({
                          ...descriptionData,
                          description: [
                            ...descriptionData?.description.slice(0, index),
                            e.target.value,
                            ...descriptionData?.description.slice(index + 1),
                          ],
                        })
                      );
                    }}
                    value={descriptionData?.description[index]}
                  ></textarea>
                  <p className="objective-description char-count mb-3 mt-2">
                    {descriptionData?.description?.[index]?.length}/120
                  </p>
                </div>
              </div>
            );
          })}

          <div className="continue">
            <button
              class="btn btn-primary continue-button"
              onClick={() => {
                if (validateDescription()) {
                  setIsLoading(true);
                  pushDataToDB();
                }
              }}
            >
              {isLoading ? (
                <div class="spinner-border spinner-border-sm"></div>
              ) : (
                "Submit"
              )}{" "}
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
export default Description;
