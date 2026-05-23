import React, { useState, useEffect, useContext } from "react";
import background from "../assets/images/BG.png";
import "./Login.css";
import {fire} from "../components/Firebase";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppContext from "../components/AppContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setUsersReducer } from "./UserSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const myContext = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const auth = getAuth(fire);
  let navigate = useNavigate();
  const db = getFirestore(fire);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("authenticated")) {
      navigate("/admin-dashboard");
    }

    const q = query(collection(db, "users"));
    onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      dispatch(
        setUsersReducer(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    });
  }, []);

  function login_user() {
    setLoading(true);

    if (email.length === 0 || password.length === 0) {
      alert("Enter the credentials");
      setLoading(false);
    } else {
      setEmail(email.toLocaleLowerCase());

      signInWithEmailAndPassword(auth, email.toLocaleLowerCase(), password)
        .then((auth) => {
          localStorage.setItem("email", email);
          localStorage.setItem("authenticated", "true");
          setLoading(false);

          users.forEach((user) => {
            if (
              user.data.email.toLocaleLowerCase() === email.toLocaleLowerCase()
            ) {
              myContext.setLoggedin_username(user.data.username);
              myContext.setLoggedin_user_image(user.data.profile_image);
              localStorage.setItem("username", user.data.username);
              localStorage.setItem("profile_image", user.data.profile_image);

              if (user.data.designation !== "BD") {
                localStorage.setItem("admin-auth", "true");
              }
              if (user.data.designation === "Super Admin") {
                localStorage.setItem("super-admin-auth", "true");
              }
              navigate("/admin-dashboard");
            }
            // if ((user.data.email === email) && (user.data.designation === "Admin")) {
            //   localStorage.setItem("admin-auth", "true");
            //   navigate("/admin-dashboard");
            // } else {
            //   localStorage.setItem("admin-auth", "false");
            //   navigate("/admin-dashboard");
            // }
          });
        })
        .catch((error) => {
          setLoading(false);
          alert("Invalid credentials");
          window.location.reload(true);
        });
    }
  }

  return (
    <div
      className="login_wrap"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login_form">
        <form id="login-form">
          <img id="logo_img" src={require("../assets/images/logo1.png")}></img>

          <div className="form-outline" style={{ marginBottom: "16px" }}>
            <label>Email address</label>
            <input
              type="email"
              id="login-mail"
              className="form-control"
              onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
            />
          </div>

          <div className="form-outline">
            <label>Password</label>
            {showPassword ? (
              <div className="passwordText loginpass">
                <input
                  className="form-control"
                  style={{ border: "none" }}
                  type="text"
                  value={password}
                  id="login-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FontAwesomeIcon
                  style={{ padding: "10px" }}
                  icon={faEye}
                  color={"#DADADA"}
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              </div>
            ) : (
              <div className="passwordText loginpass">
                <input
                  className="form-control"
                  style={{ border: "none" }}
                  type="password"
                  value={password}
                  id="form2Example2"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FontAwesomeIcon
                  style={{ padding: "10px" }}
                  icon={faEyeSlash}
                  color="#DADADA"
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              </div>
            )}
          </div>

          <div className="row" style={{ marginBottom: "28px" }}>
            <div className="col-6 forgot">
              <a className="reset" onClick={(e) => navigate("/reset-password")}>
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={login_user}
            className="btn btn-primary btn-block sub"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm"></div>
            ) : (
              <span className="login_btn">Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
