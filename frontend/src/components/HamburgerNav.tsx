import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoggedUser {
  id: string;
  first_name: string;
  last_name: string;
  user_avatar: string;
  role: string;
}

const HamburgerNav: React.FC = () => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
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
            <img src={user?.user_avatar || "/images/avataaars.png"} />

            <div>
              <p>{user ? `${user.first_name} ${user.last_name}` : "Guest"}</p>

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
