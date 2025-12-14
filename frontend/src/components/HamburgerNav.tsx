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

const HamburgerNav = () => {
  const navigate = useNavigate();
  const user = getLoggedUser();

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="hamburger-nav">
      <Link to="/user">Employees</Link>
      <Link to="/permissions">Permissions</Link>

      {user && (
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      )}
    </nav>
  );
};

export default HamburgerNav;
