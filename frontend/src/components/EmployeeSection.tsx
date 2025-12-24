import React, { useEffect, useState } from "react";
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
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useGetEmployeesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [basicSearchQuery, setBasicSearchQuery] = useState("");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [show404Error, setShow404Error] = useState(false);

  useEffect(() => {
    setFilteredEmployees(employees);
    setShow404Error(false);
  }, [employees]);

  function handleBasicSearch() {
    const searchQuery = basicSearchQuery.trim().toLowerCase();

    if (!searchQuery) {
      setFilteredEmployees(employees);
      setShow404Error(false);
      return;
    }

    const results = employees.filter((employee) => {
      const employeeFullName =
        `${employee.first_name} ${employee.last_name}`.toLowerCase();

      return (
        employee.id.toLowerCase().includes(searchQuery) ||
        employee.first_name.toLowerCase().includes(searchQuery) ||
        employee.last_name.toLowerCase().includes(searchQuery) ||
        employeeFullName.includes(searchQuery)
      );
    });

    if (results.length === 0) {
      setShow404Error(true);
    } else {
      setShow404Error(false);
      setFilteredEmployees(results);
    }
  }

  function handleAdvancedSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const filters: Record<string, string> = {};

    formData.forEach((value, key) => {
      const cleanedValue = String(value).trim().toLowerCase();
      if (!cleanedValue || cleanedValue.startsWith("select")) return;
      filters[key] = cleanedValue;
    });

    if (Object.keys(filters).length === 0) {
      alert("Please enter at least one field.");
      return;
    }

    const results = employees.filter((employee) => {
      const employeeFullName =
        `${employee.first_name} ${employee.last_name}`.toLowerCase();

      return Object.entries(filters).every(([fieldName, fieldValue]) => {
        if (fieldName === "name") {
          return (
            employee.first_name.toLowerCase().includes(fieldValue) ||
            employee.last_name.toLowerCase().includes(fieldValue) ||
            employeeFullName.includes(fieldValue)
          );
        }

        const employeeFieldValue = (employee as any)[fieldName];

        return (
          employeeFieldValue &&
          String(employeeFieldValue).toLowerCase().includes(fieldValue)
        );
      });
    });

    if (results.length === 0) {
      setShow404Error(true);
    } else {
      setShow404Error(false);
      setFilteredEmployees(results);
    }
  }

  function handleAdvancedReset(event: any) {
    const formElement = event.target.closest("form") as HTMLFormElement;
    if (!formElement) return;

    const formData = new FormData(formElement);
    let anyFieldHasValue = false;

    formData.forEach((value) => {
      const cleanedValue = String(value).trim().toLowerCase();

      if (
        cleanedValue &&
        cleanedValue !== "select building" &&
        cleanedValue !== "select a department"
      ) {
        anyFieldHasValue = true;
      }
    });

    if (!anyFieldHasValue) {
      setFilteredEmployees(employees);
      setShow404Error(false);
    }
  }

  function switchToGrid() {
    setViewMode("grid");
  }

  function switchToList() {
    setViewMode("list");
  }

  if (isLoading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  if (isError) {
    return <p>Failed to load employees.</p>;
  }

  return (
    <>
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
            <div
              className={`fade-container ${
                activeTab === "basic" ? "show" : ""
              }`}
            >
              {activeTab === "basic" && (
                <div className="basic-content">
                  <div className="content-inside">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="John Smith"
                      value={basicSearchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setBasicSearchQuery(value);

                        if (value.trim() === "") {
                          setFilteredEmployees(employees);
                          setShow404Error(false);
                        }
                      }}
                    />

                    <button className="search-btn" onClick={handleBasicSearch}>
                      SEARCH
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`fade-container ${
                activeTab === "advanced" ? "show" : ""
              }`}
            >
              {activeTab === "advanced" && (
                <div className="advanced-content">
                  <form className="form" onSubmit={handleAdvancedSearch}>
                    <label>Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Smith"
                      onChange={handleAdvancedReset}
                    />

                    <label>Email</label>
                    <input
                      name="email"
                      type="text"
                      placeholder="john.smith@leverx.com"
                      onChange={handleAdvancedReset}
                    />

                    <div className="additional-info">
                      <div>
                        <label>Phone</label>
                        <input
                          name="phone"
                          type="text"
                          placeholder="Phone number"
                          onChange={handleAdvancedReset}
                        />
                      </div>

                      <div>
                        <label>Viber</label>
                        <input
                          name="viber"
                          type="text"
                          placeholder="ViberId"
                          onChange={handleAdvancedReset}
                        />
                      </div>
                    </div>

                    <div className="additional-info">
                      <div>
                        <label>Building</label>
                        <select name="building" onChange={handleAdvancedReset}>
                          <option>Select building</option>
                          <option>LeverX HQ – Poland</option>
                          <option>LeverX Dubai</option>
                          <option>LeverX HQ – Georgia</option>
                          <option>Remote</option>
                        </select>
                      </div>

                      <div>
                        <label>Room</label>
                        <input
                          name="room"
                          type="text"
                          placeholder="303.1"
                          onChange={handleAdvancedReset}
                        />
                      </div>
                    </div>

                    <label>Department</label>
                    <select name="department" onChange={handleAdvancedReset}>
                      <option>Select a department</option>
                      <option>Human Resources (HR)</option>
                      <option>Web & Mobile</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                    </select>

                    <button className="search-btn">SEARCH</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="mobile-basic-search">
          <div className="mobile-search-inner">
            <button
              type="button"
              className="mobile-search-icon"
              onClick={handleBasicSearch}
              aria-label="Search"
            >
              🔍
            </button>

            <input
              type="text"
              placeholder="John Smith"
              value={basicSearchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setBasicSearchQuery(value);

                if (value.trim() === "") {
                  setFilteredEmployees(employees);
                  setShow404Error(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBasicSearch();
              }}
            />
          </div>
        </div>

        <section>
          <div className="button-section">
            <p>{filteredEmployees.length} employees displayed</p>

            <div className="functional-buttons">
              <button onClick={switchToGrid}>
                <svg
                  className={viewMode === "grid" ? "clicked" : ""}
                  fill="#b0a3ef"
                  viewBox="0 0 32 32"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M30 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2zM30 20h-10v10h10v-10zM30 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.104-0.895 2-2 2zM30 2h-10v10h10v-10zM12 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.105-0.896 2-2 2zM12 20h-10v10h10v-10zM12 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.104-0.896 2-2 2zM12 2h-10v10h10v-10z"></path>
                  </g>
                </svg>
              </button>

              <button onClick={switchToList}>
                <svg
                  className={viewMode === "list" ? "clicked" : ""}
                  viewBox="0 0 16 16"
                  fill="#beb4f1"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M3 1H1V3H3V1Z" fill="#beb4f1"></path>
                    <path d="M3 5H1V7H3V5Z" fill="#beb4f1"></path>
                    <path d="M1 9H3V11H1V9Z" fill="#beb4f1"></path>
                    <path d="M3 13H1V15H3V13Z" fill="#beb4f1"></path>
                    <path d="M15 1H5V3H15V1Z" fill="#beb4f1"></path>
                    <path d="M15 5H5V7H15V5Z" fill="#beb4f1"></path>
                    <path d="M5 9H15V11H5V9Z" fill="#beb4f1"></path>
                    <path d="M15 13H5V15H15V13Z" fill="#beb4f1"></path>
                  </g>
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
              <img src="/images/photo-svgrepo-com.svg" /> <span>Photo</span>
            </div>
            <div>
              <img src="/images/user-svgrepo-com.svg" /> <span>Name</span>
            </div>
            <div>
              <img src="/images/briefcase-svgrepo-com.svg" />{" "}
              <span>Department</span>
            </div>
            <div>
              <img src="/images/door-svgrepo-com.svg" /> <span>Room</span>
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
            {show404Error ? (
              <div className="error-section">
                <div className="error-wrapper">
                  <img src="/images/Page-Not-Found--Streamline-Lagos.png" />
                  <h2>404 Page not found</h2>
                  <p>Sorry, no employees match your search.</p>
                  <button onClick={() => setShow404Error(false)}>
                    Go to home page
                  </button>
                </div>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <Link
                  key={employee.id}
                  className="employee-link"
                  to={`/user/${employee.id}`}
                >
                  <div
                    key={employee.id}
                    className={
                      viewMode === "grid"
                        ? "employee-grid-card"
                        : "employee-list-card"
                    }
                  >
                    {viewMode === "list" ? (
                      <div className="employee-list-row">
                        <div className="employee-list-photo">
                          <img src={employee.user_avatar} alt="avatar" />
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
                          <img src="/images/briefcase-svgrepo-com.svg" />
                          {employee.department}
                        </div>

                        <div className="employee-list-room">
                          <img src="/images/door-svgrepo-com.svg" />
                          {employee.room}
                        </div>
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
                          <img src="/images/briefcase-svgrepo-com.svg" />
                          {employee.department}
                        </p>
                        <p className="employee-grid-room">
                          <img src="/images/door-svgrepo-com.svg" />
                          {employee.room}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default EmployeeSection;
