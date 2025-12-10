import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import EmployeeSection from "./components/EmployeeSection";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/user" element={<EmployeeSection />} />
    </Routes>
  );
}
