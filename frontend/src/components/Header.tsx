import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";

interface LoggedUser {
  id: string;
  first_name: string;
  last_name: string;
  user_avatar: string;
  role: string;
}

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    dispatch(logout());
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    navigate("/");
  }

  const isAddressBook = location.pathname.startsWith("/user");
  const isPermissions = location.pathname === "/permissions";

  return (
    <header>
      <nav>
        <Link className="header-anchor" to="/user">
          <p className="title">
            LEVERX <span className="header-logo-span">EMPLOYEE SERVICES</span>
          </p>
        </Link>

        <div className="header-button-container">
          <Link className="header-anchor" to="/user">
            <div
              className={`address ${isAddressBook ? "header-active-page" : ""}`}
            >
              <p>Adress Book</p>
            </div>
          </Link>

          {user?.role === "Admin" && (
            <Link className="header-anchor" to="/permissions">
              <div
                className={`settings ${
                  isPermissions ? "header-active-page" : ""
                }`}
              >
                <p>Settings</p>
              </div>
            </Link>
          )}
        </div>

        <div className="header-button-container">
          <button>
            <img src="/images/question-circle-svgrepo-com.svg" /> SUPPORT
          </button>

          <button
            className="button-with-avatar"
            onClick={() => navigate(`/user/${user?.id}`)}
          >
            <img src={user?.user_avatar} />
            <span>{user && `${user.first_name} ${user.last_name}`}</span>
          </button>

          <button className="button-with-power-logo" onClick={handleLogout}>
            <img src="/images/power-off-svgrepo-com.svg" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
