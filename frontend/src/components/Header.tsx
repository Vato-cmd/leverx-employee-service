import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <a className="header-anchor" href="/">
          <p className="title">
            LEVERX <span className="header-logo-span">EMPLOYEE SERVICES</span>
          </p>
        </a>

        <div className="header-button-container">
          <div className="address header-active-page">
            <p>Adress Book</p>
          </div>

          <div className="settings">
            <a className="header-anchor" href="/permissions">
              <p>Settings</p>
            </a>
          </div>
        </div>

        <div className="header-button-container">
          <button>
            <img src="/images/question-circle-svgrepo-com.svg" /> SUPPORT
          </button>

          <button className="button-with-avatar">
            <img src="/images/avataaars.png" />
            <span>USER</span>
          </button>

          <button className="button-with-power-logo">
            <img src="/images/power-off-svgrepo-com.svg" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
