import "./styles.scss";

type DateBirth = {
  year: number | string;
  month: number | string;
  day: number | string;
};

type Manager = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
};

type Visa = {
  issuing_country: string;
  type: string;
  start_date: number;
  end_date: number;
};

type Employee = {
  id: string;
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
};
const userDetailsContainer = document.getElementById(
  "user-details"
) as HTMLElement;
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const hiddenNavImage = document.getElementById(
  "hidden-nav-image"
) as HTMLImageElement;
const loggedUserName = document.getElementById(
  "logged-user-name"
) as HTMLElement;
const loggedUserAvatar = document.getElementById(
  "logged-user-avatar"
) as HTMLImageElement;
const logout = document.getElementById("logout") as HTMLButtonElement;
const signOutParagraph = document.getElementById(
  "signout-paragraph"
) as HTMLElement;
const settings = document.getElementById("settings") as HTMLParagraphElement;

const storedUser =
  sessionStorage.getItem("user") || localStorage.getItem("user");

if (!storedUser) {
  window.location.href = "signin.html";
}

const loggedUser = JSON.parse(storedUser!);
if (loggedUser.role !== "Admin") {
  settings.classList.add("hidden");
}
loggedUserAvatar.src = loggedUser.user_avatar;
loggedUserName.textContent = `${loggedUser.first_name} ${loggedUser.last_name}`;
hiddenNavImage.src = loggedUser.user_avatar;

signOutParagraph.addEventListener("click", logoutFunc);
logout.addEventListener("click", logoutFunc);

function logoutFunc() {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
}

if (!userId) {
  renderUserNotFound();
}

function renderUserNotFound() {
  if (!userDetailsContainer) return;

  userDetailsContainer.innerHTML = `
    <h2>User not found</h2>
    <a href="signin.html">Go back</a>
  `;
}

try {
  const res = await fetch(`http://localhost:3000/user/${userId}`);

  if (!res.ok) {
    throw new Error("User not found");
  }

  const user = await res.json();

  renderUser(user);
} catch (error) {
  renderUserNotFound();
}

function renderUser(user: Employee): void {
  if (!userDetailsContainer) return;
  userDetailsContainer.innerHTML = `
        <div class="user-main-layout">
        <a href="index.html?">
            <div class="go-back">
                <img src="images/icons8-less-than-50.png"/>
            </div>
        </a>
            
            
            <div class="remote-container-user">
                ${
                  user.isRemoteWork
                    ? `<div class="remote-work-logo-bg remote-work-logo"><img  src="images/icons8-remote-working-32.png" alt="remote" /></div>`
                    : ""
                }
                <img class="user-avatar" src="${user.user_avatar}"> 
            </div>

            <h2>${user.first_name} ${user.last_name}</h2> 
            <p>${user.first_name} ${user.middle_name && user.middle_name} ${
    user.last_name
  }</p>
            <button id="copy-link" class="copy-link-btn"><img src="images/copy-svgrepo-com.svg"/>Copy link</button>
              <div class="edit-save-container">
                <button class="edit-btn" id="edit-btn"><img src="images/edit-svgrepo-com.svg"/>EDIT</button>
                <button class="cancel-btn hidden" id="cancel-btn"><img src="images/trash.png"/>Cancel</button>
              </div>
        </div>

        
        <div class="container-of-user-info">
            <p class="information-title">GENERAL INFO</p>
            <hr/>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/briefcase-svgrepo-com.svg" />
                    <span>Department</span>
                </div>
                <div class="info-right" data-field="department">
                    ${user.department}
                </div>
            </div>

            <div class="info-row">
                <div class="info-left">
                    <img src="images/building-svgrepo-com.svg"/>
                    <span>Building</span>
                </div>
                <div class="info-right" data-field="building">
                    ${user.building}
                </div>
            </div>

            <div class="info-row">
                <div class="info-left">
                    <img src="images/door-svgrepo-com.svg" />
                    <span>Room</span>
                </div>
                <div class="info-right" data-field="room">
                    ${user.room}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/hashtag-svgrepo-com.svg" />
                    <span>Desk number</span>
                </div>
                <div class="info-right" data-field="desk-number">
                    ${user.desk_number}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/date-range-svgrepo-com.svg" />
                    <span>Date of birth</span>
                </div>
                <div class="info-right" data-field="date-of-birth">
                    <span>${user.date_birth.day}</span>/
                    <span>${user.date_birth.month}</span>/
                    <span>${user.date_birth.year}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/user-svgrepo-com.svg" />
                    <span>Manager</span>
                </div>
                <div class="info-right blue" data-field="full-name">
                    ${user.manager.first_name} ${user.manager.last_name}
                </div>
            </div>
            <p class="information-title">CONTACTS</p>
            <hr/>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/mobile-svgrepo-com.svg" />
                    <span>Mobile phone</span>
                </div>
                <div class="info-right blue" data-field="phone">
                    ${user.phone}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/email-1572-svgrepo-com.svg" />
                    <span>Email</span>
                </div>
                <div class="info-right blue" data-field="email">
                    ${user.email}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/viber-svgrepo-com.svg" />
                    <span>Viber</span>
                </div>
                <div class="info-right blue" data-field="viber">
                    ${user.viber}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/viber-svgrepo-com.svg" />
                    <span>C-number</span>
                </div>
                <div class="info-right" data-field="cnumber">
                    ${user.cnumber}
                </div>
            </div>
            <p class="information-title">TRAVEL INFO</p>
            <hr/>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/globe-2-svgrepo-com.svg" />
                    <span>Citizenship</span>
                </div>
                <div class="info-right">
                    ${user.citizenship}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/visa-svgrepo-com.svg" />
                    <span>Visa 1</span>
                </div>
                <div class="info-right">
                    ${user.visa[0]?.type}
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/check-verified-03-svgrepo-com.svg" />
                    <span>Visa validity period (expired)</span>
                </div>
                <div class="info-right">
                    10 May 2022 - 09 May 2023
                </div>
            </div>
            <div class="info-row">
                <div class="info-left">
                    <img src="images/visa-svgrepo-com.svg" />
                    <span>Visa 2 validity period</span>
                </div>
                <div class="info-right">
                    10 May 2024 - 09 May 2025
                </div>
            </div>
        </div>


    `;
  const editBtn = document.getElementById("edit-btn") as HTMLElement;
  const cancel = document.getElementById("cancel-btn") as HTMLElement;
  let editing = false;
  let originalValues: Record<string, any> = {};

  editBtn.addEventListener("click", () => {
    if (
      (loggedUser.role === "Admin" && loggedUser.id === user.id) ||
      (loggedUser.role === "HR" && loggedUser.id === user.id)
    ) {
      return;
    }
    if (!editing) {
      enterEditMode();
    } else {
      cancelEdit(true, userId!);
    }
  });
  cancel.addEventListener("click", () => cancelEdit(false, userId!));

  function enterEditMode() {
    editing = true;

    editBtn.innerHTML = `<img src="./images/save_img.jpg" />Save`;
    cancel.classList.remove("hidden");
    const fields = document.querySelectorAll<HTMLElement>("[data-field]");
    originalValues = {};
    fields.forEach((field) => {
      const key = field.getAttribute("data-field")!;
      const value = field.innerText.trim();
      originalValues[key] = value;
      field.innerHTML = `<input class="edit-input" value="${value}" />`;
    });
  }

  async function cancelEdit(save: boolean, userId: string) {
    editing = false;

    editBtn.innerHTML = `<img src="images/edit-svgrepo-com.svg" />EDIT`;
    cancel.classList.add("hidden");
    const fields = document.querySelectorAll("[data-field]");
    if (!save) {
      fields.forEach((field) => {
        const key = field.getAttribute("data-field")!;
        const oldValue = originalValues[key];
        field.textContent = oldValue;
      });
      return;
    }
    saveChanges(userId);
  }

  async function saveChanges(userId: string) {
    const fields = document.querySelectorAll("[data-field]")!;
    const updatedData: Record<string, any> = {};
    fields.forEach((field) => {
      const key = field.getAttribute("data-field")!;
      const input = field.querySelector("input") as HTMLInputElement;

      if (input) {
        updatedData[key] = input.value.trim();
      }
    });

    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Update failed!");

      const newInformation = await response.json();
      console.log(newInformation);

      renderUser(newInformation);
    } catch (error) {
      alert("Couldn't save changes");
    }
  }

  const canEdit =
    loggedUser.role === "Admin" ||
    (loggedUser.role === "HR" && user.manager.id === loggedUser.id);

  if (canEdit) {
    editBtn.classList.remove("hidden");
  } else {
    editBtn.classList.add("hidden");
  }
  const copyBtn = document.getElementById(
    "copy-link"
  ) as HTMLButtonElement | null;
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          copyBtn.innerHTML = `<img src="images/copy-svgrepo-com.svg"/> Copied!`;
          setTimeout(() => {
            copyBtn.innerHTML = `<img src="images/copy-svgrepo-com.svg"/>Copy link`;
          }, 500);
        })
        .catch(() => {
          alert("Couldn't copy");
        });
    });
  }
}
