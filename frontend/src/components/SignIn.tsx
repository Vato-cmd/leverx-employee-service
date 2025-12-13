import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.scss";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [showSignUp, setShowSignUp] = useState(false);
  const [missingEmail, setMissingEmail] = useState("");
  const [missingPassword, setMissingPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleForm() {
    setShowSignUp(!showSignUp);
    setMissingEmail("");
    setMissingPassword("");
    setInvalidCredentials(false);
  }

  async function handleSignUp() {
    setSignUpError("");

    const isValidEmail = (email: string) => {
      return email.includes("@");
    };

    if (!isValidEmail(newEmail)) {
      setSignUpError("Please enter a valid email address");
      return;
    }

    if (newPassword !== newPassword2) {
      setSignUpError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: newEmail,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSignUpError(data.message || "Error");
        return;
      }

      alert("Account created. Please sign in!");
      toggleForm();
    } catch {
      setSignUpError("Server error");
    }
  }
  const navigate = useNavigate();

  async function handleSignIn() {
    setMissingEmail("");
    setMissingPassword("");
    setInvalidCredentials(false);

    if (!email) {
      setMissingEmail("fill in email");
      return;
    }

    if (!email.includes("@")) {
      setMissingEmail("email must contain @");
      return;
    }

    if (!password) {
      setMissingPassword("fill in password");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInvalidCredentials(true);
        setEmail("");
        setPassword("");
        return;
      }

      setLoading(true);

      dispatch(loginSuccess(data.user));

      if (remember) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        setLoading(false);
        navigate("/user");
      }, 1000);
    } catch {
      alert("Server error");
    }
  }

  return (
    <div className="sign-in-body">
      <div>
        <div className="sign-in-header">
          <img src="/images/leverx-logo-png_seeklogo-480680.png" alt="leverx" />
          <p>{showSignUp ? "Create an account" : "Please, sign in!"}</p>
        </div>

        <div className="sign-in-container">
          {!showSignUp && (
            <div className="register-info">
              <div className="email-label">
                <label>
                  Email{" "}
                  <span
                    className={`missing-info ${!missingEmail ? "hidden" : ""}`}
                  >
                    {missingEmail}
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="password-label">
                <label>
                  Password{" "}
                  <span
                    className={`missing-info ${
                      !missingPassword ? "hidden" : ""
                    }`}
                  >
                    {missingPassword}
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="remember-me-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              <button onClick={handleSignIn}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Click to sign in</span>
                )}
              </button>

              {invalidCredentials && (
                <div className="invalid-credentials">
                  <span>invalid credentials, please try again!</span>
                </div>
              )}
            </div>
          )}

          {showSignUp && (
            <div className="signup-form">
              <label>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <label>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <label>Email</label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <label>Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
              />

              <button onClick={handleSignUp}>Create Account</button>

              {signUpError && (
                <span className="hidden-message">{signUpError}</span>
              )}
            </div>
          )}

          <p className="toggle" onClick={toggleForm}>
            {showSignUp
              ? "Already have an account? Sign in"
              : "Don’t have an account? Sign up"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
