import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetEmployeesQuery } from "../store/api/employeeApi";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  department: string;
  building: string;
  room: string;
  phone: string;
  email: string;
  viber: string;
  user_avatar: string;
  isRemoteWork: boolean;
}

const EmployeeSection: React.FC = () => {
  const { data: employees = [], isLoading } = useGetEmployeesQuery();

  const [basicSearchQuery, setBasicSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [show404Error, setShow404Error] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredEmployees = useMemo(() => {
    if (!basicSearchQuery.trim()) return employees;

    const q = basicSearchQuery.toLowerCase();
    return employees.filter((e) => {
      const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
      return (
        e.id.toLowerCase().includes(q) ||
        e.first_name.toLowerCase().includes(q) ||
        e.last_name.toLowerCase().includes(q) ||
        fullName.includes(q)
      );
    });
  }, [employees, basicSearchQuery]);

  if (isLoading) return null;

  return (
    <main>
      <aside>
        <div>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              BASIC SEARCH
            </button>
            <button
              className={`tab ${activeTab === "advanced" ? "active" : ""}`}
              onClick={() => setActiveTab("advanced")}
            >
              ADVANCED SEARCH
            </button>
          </div>

          {activeTab === "basic" && (
            <div className="basic-content">
              <div className="content-inside">
                <input
                  className="search-input"
                  placeholder="John Smith"
                  value={basicSearchQuery}
                  onChange={(e) => {
                    setBasicSearchQuery(e.target.value);
                    setShow404Error(false);
                  }}
                />
                <button className="search-btn">SEARCH</button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <section>
        <div className="button-section">
          <p>{filteredEmployees.length} employees displayed</p>

          <div className="functional-buttons">
            <button onClick={() => setViewMode("grid")}>
              <svg
                className={viewMode === "grid" ? "clicked" : ""}
                fill="#b0a3ef"
                viewBox="0 0 32 32"
              >
                <path d="M30 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2zM30 20h-10v10h10v-10zM30 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.104-0.895 2-2 2zM30 2h-10v10h10v-10zM12 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.105-0.896 2-2 2zM12 20h-10v10h10v-10zM12 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.104-0.896 2-2 2zM12 2h-10v10h10v-10z" />
              </svg>
            </button>

            <button onClick={() => setViewMode("list")}>
              <svg
                className={viewMode === "list" ? "clicked" : ""}
                viewBox="0 0 16 16"
                fill="#beb4f1"
              >
                <path d="M3 1H1V3H3V1Z" />
                <path d="M3 5H1V7H3V5Z" />
                <path d="M1 9H3V11H1V9Z" />
                <path d="M3 13H1V15H3V13Z" />
                <path d="M15 1H5V3H15V1Z" />
                <path d="M15 5H5V7H15V5Z" />
                <path d="M5 9H15V11H5V9Z" />
                <path d="M15 13H5V15H15V13Z" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`conditional-section ${
            viewMode === "list" ? "" : "hidden"
          }`}
        >
          <div>
            <span>Photo</span>
          </div>
          <div>
            <span>Name</span>
          </div>
          <div>
            <span>Department</span>
          </div>
          <div>
            <span>Room</span>
          </div>
        </div>

        <div
          className={`
            employee-wrapper
            ${
              viewMode === "grid"
                ? "employee-grid-wrapper"
                : "employee-list-wrapper"
            }
            ${show404Error ? "no-employee-grid-wrapper" : ""}
          `}
        >
          {filteredEmployees.map((employee) => (
            <Link
              key={employee.id}
              className="employee-link"
              to={`/user/${employee.id}`}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "employee-grid-card"
                    : "employee-list-card"
                }
              >
                {viewMode === "list" ? (
                  <div className="employee-list-row">
                    <div className="employee-list-photo">
                      <img src={employee.user_avatar} />
                      {employee.isRemoteWork && (
                        <div className="remote-work-logo-bg2 remote-work-logo2">
                          <img src="/images/icons8-remote-working-32.png" />
                        </div>
                      )}
                    </div>

                    <div className="employee-list-name">
                      {employee.first_name} {employee.last_name}
                    </div>

                    <div className="employee-list-department">
                      {employee.department}
                    </div>

                    <div className="employee-list-room">{employee.room}</div>
                  </div>
                ) : (
                  <div className="employee-grid-card-inner">
                    <div className="isRemoteWork-inner">
                      <img
                        src={employee.user_avatar}
                        className="employee-grid-photo"
                      />
                      {employee.isRemoteWork && (
                        <div className="remote-work-logo-bg3 remote-work-logo3">
                          <img src="/images/icons8-remote-working-32.png" />
                        </div>
                      )}
                    </div>

                    <h3 className="employee-grid-name">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="employee-grid-department">
                      {employee.department}
                    </p>
                    <p className="employee-grid-room">{employee.room}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default EmployeeSection;
