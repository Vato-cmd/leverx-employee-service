import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";

const HamburgerNav: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/");
  }

  if (!user) return null;

  return (
    <>
      <label className="hamburger-menu">
        <input type="checkbox" />
      </label>

      <div className="hidden-main-nav">
        <div className="hidden-main-nav-inner">
          <div className="hidden-main-nav-inner-top">
            <img src={user.user_avatar} alt="avatar" />

            <div>
              <p>
                {user.first_name} {user.last_name}
              </p>

              <p
                className="paragraph-smaller sign-out-link"
                onClick={handleLogout}
              >
                Sign out
              </p>
            </div>
          </div>

          <div className="hidden-main-nav-inner-bottom">
            <Link to="/user">
              <h4>Address Book</h4>
            </Link>

            {user.role === "Admin" && (
              <Link to="/permissions">
                <h4>Settings</h4>
              </Link>
            )}
          </div>

          <div className="hidden-main-nav-inner-bottom-button">
            <button className="hidden-main-button">
              <img src="/images/question-circle-svgrepo-com.svg" /> SUPPORT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerNav;
