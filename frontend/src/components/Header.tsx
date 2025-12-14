import { Link, useNavigate } from "react-router-dom";

const getLoggedUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const Header = () => {
  const navigate = useNavigate();
  const user = getLoggedUser();

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-left">
        <h3>LEVERX EMPLOYEE SERVICES</h3>
      </div>

      <div className="header-center">
        <Link to="/user">Address Book</Link>
        <Link to="/permissions">Settings</Link>
      </div>

      <div className="header-right">
        {user && (
          <>
            <span>
              {user.first_name} {user.last_name}
            </span>
            <button onClick={logout}>⏻</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
