import { Routes, Route, useLocation } from "react-router-dom";
import SignIn from "./components/SignIn";
import EmployeeSection from "./components/EmployeeSection";
import UserPage from "./components/userPage";
import Permissions from "./components/Permissions";
import Header from "./components/Header";
import HamburgerNav from "./components/HamburgerNav";

export default function App() {
  const location = useLocation();
  console.log(location);

  const isSignInPage = location.pathname === "/";

  return (
    <>
      {!isSignInPage && (
        <>
          <Header />
          <HamburgerNav />
        </>
      )}

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/user" element={<EmployeeSection />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/permissions" element={<Permissions />} />
      </Routes>
    </>
  );
}
