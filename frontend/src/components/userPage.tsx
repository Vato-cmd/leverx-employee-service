import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../store/api/userApi";

interface DateBirth {
  day: string | number;
  month: string | number;
  year: string | number;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

interface Visa {
  type: string;
}

interface Employee {
  id: string;
  role: string;
  isRemoteWork: boolean;
  first_name: string;
  middle_name?: string;
  last_name: string;
  user_avatar: string;
  department: string;
  building: string;
  room: string;
  desk_number: number;
  phone: string;
  email: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  date_birth: DateBirth;
  visa: Visa[];
  manager: Manager;
}

const blueFields: (keyof Employee)[] = ["phone", "email", "viber", "cnumber"];

const UserPage = () => {
  const { id } = useParams();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const { data: user, isLoading } = useGetUserByIdQuery(id!);
  const [updateUser] = useUpdateUserMutation();

  const [form, setForm] = useState<Employee | null>(null);
  const [original, setOriginal] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [managerInput, setManagerInput] = useState("");

  const isManagerValid = managerInput.trim().split(" ").length >= 2;

  useEffect(() => {
    if (user) {
      setForm(user);
      setManagerInput(`${user.manager.first_name} ${user.manager.last_name}`);
    }
  }, [user]);

  if (isLoading || !form) return <p>Loading...</p>;

  const isAdmin = loggedUser?.role === "Admin";
  const isEditingOwnProfile = isAdmin && loggedUser?.id === form.id;

  const canEdit =
    loggedUser &&
    (isAdmin ||
      (loggedUser.role === "HR" &&
        form.manager?.id?.toString() === loggedUser.id?.toString()));

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  function startEditing() {
    setOriginal(form);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (original) setForm(original);
    setIsEditing(false);
  }

  async function saveEditing() {
    if (!form) return;

    const payload: any = {};

    payload.date_birth = `${form.date_birth.day}/${form.date_birth.month}/${form.date_birth.year}`;

    Object.keys(form).forEach((key) => {
      if (!["date_birth", "manager", "user_avatar"].includes(key)) {
        payload[key] = (form as any)[key];
      }
    });

    if (isAdmin) {
      const [first, ...rest] = managerInput.trim().split(" ");
      payload.manager_name = `${first} ${rest.join(" ")}`;
    }

    const updated = await updateUser({
      id: form.id,
      payload,
    }).unwrap();

    setForm(updated);
    setIsEditing(false);
  }

  const field = (label: string, icon: string, key: keyof Employee) => (
    <div className="info-row">
      <div className="info-left">
        <img src={icon} />
        <span>{label}</span>
      </div>
      <div
        className={`info-right ${blueFields.includes(key) ? "blue-text" : ""}`}
      >
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
          {form.isRemoteWork && (
            <div className="remote-work-logo-bg remote-work-logo">
              <img src="/images/icons8-remote-working-32.png" />
            </div>
          )}
          <img className="user-avatar" src={form.user_avatar} />
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
              value={form.middle_name}
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
              <Link
                to={`/user/${form.manager.id}`}
                className="blue-text manager-link"
              >
                {form.manager.first_name} {form.manager.last_name}
              </Link>
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
                    visa: [{ type: e.target.value }],
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
