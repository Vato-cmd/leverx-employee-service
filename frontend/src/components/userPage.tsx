import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../store/api/userApi";

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

interface DateBirth {
  day: string | number;
  month: string | number;
  year: string | number;
}

interface Visa {
  type: string;
}

const getLoggedUser = () => {
  const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const UserPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading,
    error,
  } = useGetUserByIdQuery(id!, {
    skip: !id,
  });

  const [updateUser] = useUpdateUserMutation();

  const [form, setForm] = useState<any>({
    date_birth: {
      day: "",
      month: "",
      year: "",
    },
    manager: {
      first_name: "",
      last_name: "",
    },
    visa: [],
  });

  const [original, setOriginal] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [managerInput, setManagerInput] = useState("");

  const loggedUser = getLoggedUser();
  const isManagerValid = managerInput.trim().split(" ").length >= 2;

  useEffect(() => {
    if (!user) return;

    setForm(user);
    setManagerInput(`${user.manager.first_name} ${user.manager.last_name}`);
  }, [user]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load user</p>;
  if (!user) return <p>User not found</p>;

  const canEdit =
    loggedUser &&
    (loggedUser.role === "Admin" ||
      (loggedUser.role === "HR" &&
        user.manager?.id?.toString() === loggedUser.id?.toString()));

  const isAdmin = loggedUser?.role === "Admin";
  const isEditingOwnProfile =
    loggedUser?.role === "Admin" && loggedUser?.id === user.id;

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  function startEditing() {
    setOriginal(JSON.parse(JSON.stringify(form)));
    setIsEditing(true);
  }

  function cancelEditing() {
    if (!original) return;
    setForm(original);
    setManagerInput(
      `${original.manager.first_name} ${original.manager.last_name}`
    );
    setIsEditing(false);
  }

  async function saveEditing() {
    if (!user) return;

    const payload: any = {};

    payload.date_birth = `${form.date_birth.day}/${form.date_birth.month}/${form.date_birth.year}`;

    for (const key in form) {
      if (key !== "date_birth" && key !== "manager" && key !== "user_avatar") {
        payload[key] = form[key];
      }
    }

    if (loggedUser?.role === "Admin") {
      const [first, ...rest] = managerInput.trim().split(" ");
      const last = rest.join(" ");

      if (!first || !last) {
        alert("Manager name must be in format: FirstName LastName");
        return;
      }

      payload.manager_name = `${first} ${last}`;
    }

    try {
      await updateUser({
        id: user.id,
        payload,
      }).unwrap();

      setIsEditing(false);
    } catch {
      alert("Failed to update user");
    }
  }

  const field = (label: string, icon: string, key: string) => (
    <div className="info-row">
      <div className="info-left">
        <img src={icon} />
        <span>{label}</span>
      </div>

      <div className="info-right">
        {!isEditing ? (
          (form as any)[key]
        ) : (
          <input
            value={(form as any)[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="user-details">
      <div className="user-main-layout">
        <Link to="/user">
          <div className="go-back">
            <img src="/images/icons8-less-than-50.png" />
          </div>
        </Link>

        <div className="remote-container-user">
          {user.isRemoteWork && (
            <div className="remote-work-logo-bg remote-work-logo">
              <img src="/images/icons8-remote-working-32.png" />
            </div>
          )}
          <img className="user-avatar" src={user.user_avatar} />
        </div>

        <h2>
          {form.first_name} {form.last_name}
        </h2>

        {!isEditing ? (
          <p>
            {form.first_name} {form.middle_name} {form.last_name}
          </p>
        ) : (
          <p className="edit-name-fields">
            <input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <input
              value={form.middle_name || ""}
              onChange={(e) =>
                setForm({ ...form, middle_name: e.target.value })
              }
            />
            <input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </p>
        )}

        <button className="copy-link-btn" onClick={handleCopy}>
          <img src="/images/copy-svgrepo-com.svg" />
          {copied ? "Copied!" : "Copy link"}
        </button>

        {canEdit && !isEditing && !isEditingOwnProfile && (
          <button className="edit-btn" onClick={startEditing}>
            <img src="/images/edit-svgrepo-com.svg" />
            EDIT
          </button>
        )}

        {isEditing && (
          <div className="edit-controls">
            <button
              className="save-btn"
              onClick={saveEditing}
              disabled={!isManagerValid}
            >
              SAVE
            </button>
            <button className="cancel-btn" onClick={cancelEditing}>
              CANCEL
            </button>
          </div>
        )}
      </div>

      <div className="container-of-user-info">
        <p className="information-title">GENERAL INFO</p>
        <hr />

        {field("Department", "/images/briefcase-svgrepo-com.svg", "department")}
        {field("Building", "/images/building-svgrepo-com.svg", "building")}
        {field("Room", "/images/door-svgrepo-com.svg", "room")}
        {field("Desk number", "/images/hashtag-svgrepo-com.svg", "desk_number")}

        <div className="info-row">
          <div className="info-left">
            <img src="/images/date-range-svgrepo-com.svg" />
            <span>Date of birth</span>
          </div>

          <div className="info-right">
            {!isEditing ? (
              `${form.date_birth.day}/${form.date_birth.month}/${form.date_birth.year}`
            ) : (
              <div className="dob-edit">
                <input
                  value={form.date_birth.day}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date_birth: {
                        ...form.date_birth,
                        day: e.target.value,
                      },
                    })
                  }
                />
                <input
                  value={form.date_birth.month}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date_birth: {
                        ...form.date_birth,
                        month: e.target.value,
                      },
                    })
                  }
                />
                <input
                  value={form.date_birth.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date_birth: {
                        ...form.date_birth,
                        year: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="info-row">
          <div className="info-left">
            <img src="/images/user-svgrepo-com.svg" />
            <span>Manager</span>
          </div>

          <div className="info-right">
            {!isEditing || !isAdmin ? (
              `${form.manager.first_name} ${form.manager.last_name}`
            ) : (
              <input
                value={managerInput}
                onChange={(e) => setManagerInput(e.target.value)}
                placeholder="FirstName LastName"
              />
            )}
          </div>
        </div>

        <p className="information-title">CONTACTS</p>
        <hr />

        {field("Mobile phone", "/images/mobile-svgrepo-com.svg", "phone")}
        {field("Email", "/images/email-1572-svgrepo-com.svg", "email")}
        {field("Viber", "/images/viber-svgrepo-com.svg", "viber")}
        {field("C-number", "/images/viber-svgrepo-com.svg", "cnumber")}

        <p className="information-title">TRAVEL INFO</p>
        <hr />

        {field("Citizenship", "/images/globe-2-svgrepo-com.svg", "citizenship")}

        <div className="info-row">
          <div className="info-left">
            <img src="/images/visa-svgrepo-com.svg" />
            <span>Visa 1</span>
          </div>
          <div className="info-right">
            {!isEditing ? (
              form.visa[0]?.type
            ) : (
              <input
                value={form.visa[0]?.type || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visa: [{ ...(form.visa?.[0] || {}), type: e.target.value }],
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
