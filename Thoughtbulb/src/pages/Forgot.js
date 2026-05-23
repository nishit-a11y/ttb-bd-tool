import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/images/BG.png";
import "./Forgot.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mail_sent, setMail_sent] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  function reset_password() {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then((auth) => {
        setMail_sent("Mail Sent Successfully");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Something went wrong. Try after sometime");
      });
  }

  function go_back() {
    navigate("/");
  }

  return (
    <div
      className="login_wrap"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login_form_forgot">
        <form id="login-form-forgot">
          <h4 className="forgot-title">Forgot Password</h4>
          <p className="forgot-description">
            Forgot your password? No worries. Provide your login email address
            and we will send you a password reset link to your email address.
          </p>

          <div className="form-outline" style={{ marginBottom: "32px" }}>
            <label>Email address</label>
            <input
              type="email"
              id="form2Example1"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={reset_password}
            className="btn btn-primary btn-block sub"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm"></div>
            ) : (
              <span className="reset_btn">Send reset link</span>
            )}
          </button>
          <p className="forgot-description">{mail_sent}</p>
          <button
            type="button"
            onClick={go_back}
            className="btn back-btn-forgot"
            style={{
              border: "none",
              fontWeight: 600,
              color: "#ffff",
              fontFamily: "Proxima Nova",
              fontSize: "14px",
            }}
          >
            Back to Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forgot;
