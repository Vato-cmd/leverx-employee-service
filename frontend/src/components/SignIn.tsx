import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.scss";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useSignInMutation, useSignUpMutation } from "../store/api/authApi";

const SignIn: React.FC = () => {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  function toggleForm() {
    setShowSignUp(!showSignUp);
    setMissingEmail("");
    setMissingPassword("");
    setInvalidCredentials(false);
    setSignUpError("");
  }

  async function handleSignUp() {
    setSignUpError("");

    if (newPassword !== newPassword2) {
      setSignUpError("Passwords do not match");
      return;
    }

    try {
      await signUp({
        first_name: firstName,
        last_name: lastName,
        email: newEmail,
        password: newPassword,
      }).unwrap();

      alert("Account created. Please sign in!");
      toggleForm();
    } catch (err: any) {
      setSignUpError(err?.data?.message || "Server error");
    }
  }

  async function handleSignIn() {
    setMissingEmail("");
    setMissingPassword("");
    setInvalidCredentials(false);

    if (!email) {
      setMissingEmail("fill in email");
      return;
    }
    if (!password) {
      setMissingPassword("fill in password");
      return;
    }

    try {
      const data = await signIn({ email, password }).unwrap();

      if (remember) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      dispatch(setCredentials(data.user));
      navigate("/user");
    } catch {
      setInvalidCredentials(true);
      setEmail("");
      setPassword("");
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

              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <button onClick={handleSignIn}>
                {isSigningIn ? (
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

              <button onClick={handleSignUp}>
                {isSigningUp ? "Creating..." : "Create Account"}
              </button>

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
