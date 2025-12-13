import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DateBirth {
  year: number | string;
  month: number | string;
  day: number | string;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}

interface Visa {
  issuing_country: string;
  type: string;
  start_date: number;
  end_date: number;
}

export interface Employee {
  id: string;
  role: string;
  isRemoteWork: boolean;
  middle_name: string;
  user_avatar: string;
  first_name: string;
  last_name: string;
  department: string;
  building: string;
  room: string;
  date_birth: DateBirth;
  desk_number: number;
  manager: Manager;
  phone: string;
  email: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  visa: Visa[];
  fullname?: string;
}

const Permissions: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loggedUser = JSON.parse(
    sessionStorage.getItem("user") || localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    if (!loggedUser?.role || loggedUser.role !== "Admin") {
      navigate("/", { replace: true });
    }
  }, []);

  if (!loggedUser?.role || loggedUser.role !== "Admin") {
    return null;
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const response = await fetch("http://localhost:3000/user");
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  }

  function getFilteredEmployees() {
    if (!searchQuery.trim()) return employees;

    const searchValue = searchQuery.toLowerCase();

    return employees.filter((employee) => {
      const fullName =
        `${employee.first_name} ${employee.last_name}`.toLowerCase();

      return (
        employee.first_name.toLowerCase().includes(searchValue) ||
        employee.last_name.toLowerCase().includes(searchValue) ||
        fullName.includes(searchValue)
      );
    });
  }

  async function updateEmployeeRole(id: string, newRole: string) {
    try {
      await fetch(`http://localhost:3000/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      loadEmployees();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  }

  return (
    <div className="permissions-page">
      <div className="permissions-container-inner">
        <p>ROLES & PERMISSIONS</p>
      </div>

      <div className="permissions-container-inner">
        <input
          id="permissions-search"
          type="text"
          placeholder="Type Name to search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <p>Address book role</p>
        <p>Vacation role</p>
        <p>Admin</p>
      </div>

      <div className="permissions-container">
        {getFilteredEmployees().map((employee) => (
          <div className="permissions-user-layout" key={employee.id}>
            <div className="permissions-user-layout-inner">
              <div className="permissions-inner-flex">
                <img
                  src={employee.user_avatar}
                  className="permissions-avatar"
                />
                <p>
                  {employee.first_name} {employee.last_name}
                </p>
              </div>

              <div className="permissions-inner-flex">
                <button
                  data-role="Employee"
                  disabled={employee.role === "Admin"}
                  className={employee.role === "Employee" ? "indicated" : ""}
                  onClick={() => updateEmployeeRole(employee.id, "Employee")}
                >
                  Employee
                </button>

                <button
                  data-role="HR"
                  disabled={employee.role === "Admin"}
                  className={employee.role === "HR" ? "indicated" : ""}
                  onClick={() => updateEmployeeRole(employee.id, "HR")}
                >
                  HR
                </button>
              </div>

              <div className="permissions-inner-flex">
                <button
                  className={employee.role !== "Admin" ? "indicated" : ""}
                >
                  Employee
                </button>

                <button
                  className={employee.role === "Admin" ? "indicated" : ""}
                >
                  PO
                </button>

                <button>DD</button>
              </div>

              <div className="permissions-inner-flex admin-cell">
                <button
                  className={employee.role === "Admin" ? "indicated" : ""}
                  onClick={() => updateEmployeeRole(employee.id, "Admin")}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Permissions;
