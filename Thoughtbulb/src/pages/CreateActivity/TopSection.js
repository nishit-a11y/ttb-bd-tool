import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "./CreateActivitySlice";
import { Oval } from "react-loader-spinner";
import { saveActivity } from "./saveActivity";

const TopSection = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { game_name } = useSelector((state) => state.createActivity);
  const [isLoading, setIsLoading] = useState(false);

  async function pushDraftDataToDB() {
    try {
      await saveActivity({ draft: true });
      dispatch(reset());
      alert("Activity draft saved");
      navigate("/activities");
    } catch (e) {
      alert("Could not save the draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
