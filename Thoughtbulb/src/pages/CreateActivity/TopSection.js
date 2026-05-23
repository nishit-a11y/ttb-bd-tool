import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "./CreateActivitySlice";
import { Oval } from "react-loader-spinner";
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { CollectionName } from "../collection_config";
import {fire} from "../../components/Firebase";
import { pushToFBStorage } from "./utils";

const TopSection = () => {
  const db = getFirestore(fire);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    game_name,
    objectiveData,
    descriptionData,
    game_url,
    material_cost,
    game_type,
    category,
    program_fee,
    editActivity,
  } = useSelector((state) => state.createActivity);
  const [isLoading, setIsLoading] = useState(false);

  async function pushDraftDataToDB() {
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
      game_logo: groupedURLs["games_logo"]?.[0] ?? "",
      game_cover: (groupedURLs.games_cover && groupedURLs.games_cover[0]) ?? "",
      special_images: groupedURLs["games_special"] ?? [],
    };
    finalData["draft"] = true;
    console.log(finalData);
    if (editActivity != null) {
      updateDoc(doc(db, CollectionName.games, editActivity), finalData).then(
        (doc) => {
          dispatch(reset());
          alert("Activity draft created Successfully");
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

  function validateDraft() {
    if (!game_name || game_name === "") {
      alert("Please enter activity name");
      return false;
    } else {
      return true;
    }
  }

  function go_back() {
    if (window.confirm("Continue without saving changes ?")) {
      navigate("/activities");
      dispatch(reset());
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
      <div className="container-fluid head1">
        <nav className="navbar">
          <h4 class="prop-title">
            <img
              className="back-arrow mb-1"
              onClick={go_back}
              src={require("../../assets/images/left.png")}
              width={20}
            ></img>
            &nbsp;&nbsp;Create Activity
          </h4>
          <button
            onClick={() => {
              if (validateDraft()) {
                setIsLoading(true);
                pushDraftDataToDB();
              }
            }}
            class="draft"
          >
            {isLoading ? (
              <div class="spinner-border spinner-border-sm"></div>
            ) : (
              "Save Draft"
            )}
          </button>
        </nav>
      </div>
    </>
  );
};
export default TopSection;
