import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetUsersQuery, useUpdateUserMutation } from "../store/api/userApi";

const Permissions: React.FC = () => {
  const navigate = useNavigate();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const { data: users = [], isLoading } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loggedUser || loggedUser.role !== "Admin") {
      navigate("/", { replace: true });
    }
  }, [loggedUser, navigate]);

  if (!loggedUser || loggedUser.role !== "Admin") {
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  function getFilteredUsers() {
    if (!searchQuery.trim()) return users;

    const value = searchQuery.toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(value) ||
        user.last_name.toLowerCase().includes(value) ||
        fullName.includes(value)
      );
    });
  }

  async function changeRole(id: string, role: "Employee" | "HR" | "Admin") {
    await updateUser({
      id,
      payload: { role },
    });
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
        {getFilteredUsers().map((user) => (
          <div className="permissions-user-layout" key={user.id}>
            <div className="permissions-user-layout-inner">
              <div className="permissions-inner-flex">
                <img src={user.user_avatar} className="permissions-avatar" />
                <p>
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div className="permissions-inner-flex">
                <button
                  disabled={user.id === loggedUser.id}
                  className={user.role === "Employee" ? "indicated" : ""}
                  onClick={() => changeRole(user.id, "Employee")}
                >
                  Employee
                </button>

                <button
                  disabled={user.id === loggedUser.id}
                  className={user.role === "HR" ? "indicated" : ""}
                  onClick={() => changeRole(user.id, "HR")}
                >
                  HR
                </button>
              </div>

              <div className="permissions-inner-flex">
                <button className="indicated">Employee</button>
                <button>PO</button>
                <button>DD</button>
              </div>

              <div className="permissions-inner-flex admin-cell">
                <button
                  className={user.role === "Admin" ? "indicated" : ""}
                  onClick={() => changeRole(user.id, "Admin")}
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
