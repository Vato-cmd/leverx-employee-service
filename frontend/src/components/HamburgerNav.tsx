import React from "react";

const HamburgerNav: React.FC = () => {
  return (
    <>
      <label className="hamburger-menu">
        <input type="checkbox" />
      </label>

      <div className="hidden-main-nav">
        <div className="hidden-main-nav-inner">
          <div className="hidden-main-nav-inner-top">
            <img src="/images/avataaars.png" />
            <div>
              <p>User</p>
              <p className="paragraph-smaller">Sign out</p>
            </div>
          </div>

          <div className="hidden-main-nav-inner-bottom">
            <h4>Adress Book</h4>
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
