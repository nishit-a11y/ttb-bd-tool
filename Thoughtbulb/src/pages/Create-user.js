import React, { useState, useContext, useEffect } from "react";
import "./Create-user.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import inperson_img from "../assets/images/inperson.svg";
import virtual_img from "../assets/images/virtual.svg";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import validator from "validator";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  Timestamp,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {fire} from "../components/Firebase";
import AppContext from "../components/AppContext";
import moment from "moment";
import detectBackButton from "detect-browser-back-navigation";

function Create_user() {
  let navigate = useNavigate();
  const db = getFirestore(fire);
  const storage = getStorage(fire);
  const auth = getAuth(fire);
  const myContext = useContext(AppContext);
  const [expanded, setExpanded] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accordion1, setAccordion1] = useState(false);
  const [warn_username, setWarn_username] = useState(false);
  const [username_warning, setUsername_warning] = useState("");
  const [warn_mail, setWarn_mail] = useState(false);
  const [mail_warning, setMail_warning] = useState("");
  const [warn_password, setWarn_password] = useState(false);
  const [password_warning, setPassword_warning] = useState("");
  const [warn_role, setWarn_role] = useState(false);
  const [warn_image, setWarn_image] = useState(false);

  useEffect(() => {
    detectBackButton(() => {
      if (window.confirm("Continue without saving changes ?")) {
        myContext.setUsername("");
        myContext.setPassword("");
        myContext.setUser_email("");
        myContext.setDesignation("");
        myContext.setProfile_picture(null);
        myContext.setEdit_user(false);
        myContext.setUser_id("");
        myContext.setUser_image("");
        navigate("/users");
      }
    });
  }, []);

  function go_back() {
    if (window.confirm("Continue without saving changes ?")) {
      myContext.setUsername("");
      myContext.setPassword("");
      myContext.setUser_email("");
      myContext.setDesignation("");
      myContext.setProfile_picture(null);
      myContext.setEdit_user(false);
      myContext.setUser_id("");
      myContext.setUser_image("");
      navigate("/users");
    }
  }

  function create_user() {
    const file_types = ["image/jpg", "image/png", "image/jpeg"];

    if (myContext.username.length === 0) {
      setUsername_warning("* Enter username");
      setWarn_username(true);
    } else if (
      myContext.profile_picture !== null &&
      !file_types.includes(myContext.profile_picture.type)
    ) {
      setWarn_image(true);
    } else if (myContext.username.length < 3) {
      setUsername_warning("* Username is too short");
      setWarn_username(true);
    } else if (myContext.user_email.length === 0) {
      setMail_warning("* Enter email");
      setWarn_mail(true);
    } else if (!validator.isEmail(myContext.user_email)) {
      setMail_warning("* Invalid email");
      setWarn_mail(true);
    } else if (myContext.password.length === 0) {
      setPassword_warning("* Enter password");
      setWarn_password(true);
    } else if (myContext.password.length < 8) {
      setPassword_warning("* Password must have 8 characters");
      setWarn_password(true);
    } else if (myContext.designation.length === 0) {
      setWarn_role(true);
    } else {
      if (myContext.edit_user) {
        const email = document.querySelector("#mail-input").value;

        const password = document.querySelector("#pass-input").value;

        //const nodeEndpoint = "http:localhost:8089/"
        axios
          .post("https://api.bd.eskoops.com/api/update_password", {
            email,
            password,
          })
          .then((response) => {
            // Handle success response
            //
            navigate("/users");
          })
          .catch((error) => {
            // Handle error response
            console.error(error);
            alert("Password update failed");
            navigate("/users");
          });
        setLoading(true);
        const final_data = {
          username: myContext.username,
          username_small: myContext.username.toLowerCase(),

          designation: myContext.designation,
          created_on: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
          draft: false,
        };

        if (myContext.profile_picture !== null) {
          const storageRef = ref(
            storage,
            "/profile_images/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              myContext.profile_picture.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            myContext.profile_picture
          );

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => alert(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                final_data.profile_image = url;
                try {
                  // localStorage.setItem("profile_image", url);
                  updateDoc(doc(db, "users", myContext.user_id), final_data)
                    .then((doc) => {
                      myContext.setUsername("");
                      myContext.setPassword("");
                      myContext.setUser_email("");
                      myContext.setDesignation("");
                      myContext.setProfile_picture(null);
                      myContext.setEdit_user(false);
                      myContext.setUser_id("");
                      myContext.setUser_image("");
                      setLoading(false);
                      alert("Changes made successfully");
                      navigate("/users");
                    })
                    .catch((err) => {
                      setLoading(false);
                      alert(err);
                    });
                } catch (err) {
                  setLoading(false);
                  alert(err);
                }
              });
            }
          );
        } else {
          try {
            updateDoc(doc(db, "users", myContext.user_id), final_data)
              .then((doc) => {
                myContext.setUsername("");
                myContext.setPassword("");
                myContext.setUser_email("");
                myContext.setDesignation("");
                myContext.setProfile_picture(null);
                myContext.setEdit_user(false);
                myContext.setUser_id("");
                myContext.setUser_image("");
                setLoading(false);
                alert("Changes made successfully");
                navigate("/users");
              })
              .catch((err) => {
                setLoading(false);
                alert(err);
              });
          } catch (err) {
            setLoading(false);
            alert(err);
          }
        }
      } else {
        setLoading(true);
        const final_data = {
          username: myContext.username,
          username_small: myContext.username.toLowerCase(),

          email: String(myContext.user_email).toLocaleLowerCase(),
          designation: myContext.designation,
          created_on: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
          draft: false,
        };

        if (myContext.profile_picture !== null) {
          const storageRef = ref(
            storage,
            "/profile_images/" +
              Date.now() +
              Math.floor(Math.random() * 9999) +
              myContext.profile_picture.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            myContext.profile_picture
          );

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => alert(err),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                final_data.profile_image = url;
                try {
                  createUserWithEmailAndPassword(
                    auth,
                    myContext.user_email,
                    myContext.password
                  )
                    .then((res) => {
                      addDoc(collection(db, "users"), final_data)
                        .then((doc) => {
                          myContext.setUsername("");
                          myContext.setPassword("");
                          myContext.setUser_email("");
                          myContext.setDesignation("");
                          myContext.setProfile_picture(null);
                          setLoading(false);
                          alert("User created successfully");
                          navigate("/users");
                        })
                        .catch((err) => {
                          setLoading(false);
                          alert(err);
                        });
                    })
                    .catch((err) => {
                      setLoading(false);
                      alert(err);
                    });
                } catch (err) {
                  setLoading(false);
                  alert(err);
                }
              });
            }
          );
        } else {
          try {
            createUserWithEmailAndPassword(
              auth,
              String(myContext.user_email).toLocaleLowerCase(),
              myContext.password
            )
              .then((res) => {
                addDoc(collection(db, "users"), final_data)
                  .then((doc) => {
                    myContext.setUsername("");
                    myContext.setPassword("");
                    myContext.setUser_email("");
                    myContext.setDesignation("");
                    myContext.setProfile_picture(null);
                    setLoading(false);
                    alert("User created successfully");
                    navigate("/users");
                  })
                  .catch((err) => {
                    setLoading(false);
                    alert(err);
                  });
              })
              .catch((err) => {
                setLoading(false);
                alert(err);
              });
          } catch (err) {
            setLoading(false);
            alert(err);
          }
        }
      }
    }
  }

  function save_draft() {
    if (myContext.edit_user) {
      setLoading(true);
      const final_data = {
        username: myContext.username,
        username_small: myContext.username.toLowerCase(),

        designation: myContext.designation,
        created_on: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        draft: true,
      };

      if (myContext.profile_picture !== null) {
        const storageRef = ref(
          storage,
          "/profile_images/" +
            Date.now() +
            Math.floor(Math.random() * 9999) +
            myContext.profile_picture.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          myContext.profile_picture
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => alert(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              final_data.profile_image = url;
              try {
                updateDoc(doc(db, "users", myContext.user_id), final_data).then(
                  (doc) => {
                    myContext.setUsername("");
                    myContext.setPassword("");
                    myContext.setUser_email("");
                    myContext.setDesignation("");
                    myContext.setProfile_picture(null);
                    myContext.setEdit_user(false);
                    myContext.setUser_id("");
                    myContext.setUser_image("");
                    setLoading(false);
                    alert("Draft saved");
                    navigate("/users");
                  }
                );
              } catch (err) {
                setLoading(false);
                alert(err);
              }
            });
          }
        );
      } else {
        try {
          updateDoc(doc(db, "users", myContext.user_id), final_data).then(
            (doc) => {
              myContext.setUsername("");
              myContext.setPassword("");
              myContext.setUser_email("");
              myContext.setDesignation("");
              myContext.setProfile_picture(null);
              myContext.setEdit_user(false);
              myContext.setUser_id("");
              myContext.setUser_image("");
              setLoading(false);
              alert("Draft saved");
              navigate("/users");
            }
          );
        } catch (err) {
          setLoading(false);
          alert(err);
        }
      }
    } else {
      setLoading(true);
      const final_data = {
        username: myContext.username,
        username_small: myContext.username.toLowerCase(),

        email: myContext.user_email,
        designation: myContext.designation,
        created_on: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        draft: true,
      };

      if (myContext.profile_picture !== null) {
        const storageRef = ref(
          storage,
          "/profile_images/" +
            Date.now() +
            Math.floor(Math.random() * 9999) +
            myContext.profile_picture.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          myContext.profile_picture
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => alert(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              final_data.profile_image = url;
              try {
                addDoc(collection(db, "users"), final_data).then((doc) => {
                  myContext.setUsername("");
                  myContext.setPassword("");
                  myContext.setUser_email("");
                  myContext.setDesignation("");
                  myContext.setProfile_picture(null);
                  setLoading(false);
                  alert("Draft saved");
                  navigate("/users");
                });
              } catch (err) {
                setLoading(false);
                alert(err);
              }
            });
          }
        );
      } else {
        try {
          addDoc(collection(db, "users"), final_data).then((doc) => {
            myContext.setUsername("");
            myContext.setPassword("");
            myContext.setUser_email("");
            myContext.setDesignation("");
            myContext.setProfile_picture(null);
            setLoading(false);
            alert("Draft saved");
            navigate("/users");
          });
        } catch (err) {
          setLoading(false);
          alert(err);
        }
      }
    }
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="container-fluid sec-wrap">
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
            &nbsp;Create User
          </h4>
          {!myContext.edit_user ? (
            <button onClick={save_draft} class="draft">
              Save Draft
            </button>
          ) : (
            ""
          )}
        </nav>
      </div>
      <div className="container-fluid proposal-wrap mb-5">
        <Accordion
          disabled={accordion1}
          expanded={expanded === 1}
          onChange={handleChange(1)}
        >
          <AccordionDetails>
            <div class="form-group">
              <h6 className="objective-title mt-5">Upload Profile Picture</h6>
              <input
                accept="image/png, image/gif, image/jpeg"
                type="file"
                class="form-control-file mb-3 mt-3 upload"
                id="exampleFormControlFile1"
                onChange={(e) => {
                  myContext.setProfile_picture(e.target.files[0]);
                  setWarn_image(false);
                }}
              ></input>
            </div>
            {myContext.edit_user && myContext.user_image ? (
              <div>
                <img
                  className="edit-logo mt-2"
                  src={myContext.user_image}
                  width={70}
                  height={70}
                ></img>
                <br></br>
                <br></br>
                <br></br>
              </div>
            ) : (
              ""
            )}
            {warn_image ? (
              <p className="warning mt-3">
                * Only jpg, png, jpeg formats are allowed
              </p>
            ) : (
              ""
            )}

            <div class="form-group">
              <h6 className="objective-title mt-4">User Name</h6>
              <input
                type="text"
                class="form-control mb-3"
                id="formGroupExampleInput"
                onChange={(e) => {
                  myContext.setUsername(e.target.value);
                  setWarn_username(false);
                }}
                value={myContext.username}
              ></input>
            </div>
            {warn_username ? (
              <p className="warning mt-3">{username_warning}</p>
            ) : (
              ""
            )}

            <div class="form-group">
              <h6 className="objective-title mt-4">User Email ID</h6>
              <input
                type="email"
                disabled={myContext.edit_user}
                class="form-control mb-3"
                id="mail-input"
                onChange={(e) => {
                  myContext.setUser_email(e.target.value);
                  setWarn_mail(false);
                }}
                value={myContext.user_email}
              ></input>
            </div>
            {warn_mail ? <p className="warning mt-3">{mail_warning}</p> : ""}

            <div class="form-group">
              <h6 className="objective-title mt-4">Password</h6>
              <input
                type="password"
                class="form-control mb-3"
                id="pass-input"
                onChange={(e) => {
                  myContext.setPassword(e.target.value);
                  setWarn_password(false);
                }}
                value={myContext.password}
              ></input>
            </div>
            {warn_password ? (
              <p className="warning mt-3">{password_warning}</p>
            ) : (
              ""
            )}

            <div className="col mt-4">
              <h6 className="objective-title">Select Role</h6>
              <div class="form-check activity-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  onClick={(e) => {
                    myContext.setDesignation("BD");
                    setWarn_role(false);
                  }}
                  defaultChecked={myContext.designation === "BD"}
                ></input>
                <label class="form-check-label labels" for="flexRadioDefault1">
                  &nbsp;&nbsp;BD
                </label>
              </div>
              <div class="form-check activity-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  onClick={(e) => {
                    myContext.setDesignation("Admin");
                    setWarn_role(false);
                  }}
                  defaultChecked={myContext.designation === "Admin"}
                ></input>
                <label class="form-check-label labels" for="flexRadioDefault2">
                  &nbsp;&nbsp;Admin
                </label>
              </div>
              {localStorage.getItem("super-admin-auth") && (
                <div class="form-check activity-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault3"
                    onClick={(e) => {
                      myContext.setDesignation("Super Admin");
                      setWarn_role(false);
                    }}
                    defaultChecked={myContext.designation === "Super Admin"}
                  ></input>
                  <label
                    class="form-check-label labels"
                    for="flexRadioDefault3"
                  >
                    &nbsp;&nbsp;Super Admin
                  </label>
                </div>
              )}
            </div>
            {warn_role ? (
              <p className="warning mt-3">* Select the role of user</p>
            ) : (
              ""
            )}
            <div className="continue">
              <button
                class="btn btn-primary continue-button"
                onClick={create_user}
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
  );
}

export default Create_user;
