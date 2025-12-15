import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";

const HamburgerNav: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <>
      <label className="hamburger-menu">
        <input type="checkbox" />
      </label>

      <div className="hidden-main-nav">
        <div className="hidden-main-nav-inner">
          <div className="hidden-main-nav-inner-top">
            <img src={user?.user_avatar} />

            <div>
              <p>{user && `${user.first_name} ${user.last_name}`}</p>

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
              <h4>Adress Book</h4>
            </Link>
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
