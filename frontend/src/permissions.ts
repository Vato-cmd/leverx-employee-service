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
};
let employees: Employee[] = [];

const loggedUserAvatar = document.getElementById(
  "logged-user-avatar"
) as HTMLImageElement;
const hiddenNavImage = document.getElementById(
  "hidden-nav-image"
) as HTMLImageElement;
const loggedUserName = document.getElementById(
  "logged-user-name"
) as HTMLElement;

const list = document.getElementById("permissions-container") as HTMLDivElement;
const search = document.getElementById(
  "permissions-search"
) as HTMLInputElement;
const userProfile = document.getElementById(
  "user-profile"
) as HTMLButtonElement;

search.addEventListener("input", () => {
  const value = search.value.trim().toLowerCase();

  if (!value) {
    renderEmployees(employees);
    return;
  }

  const filter = employees.filter((user) => {
    return (
      user.first_name.toLowerCase().includes(value) ||
      user.last_name.toLowerCase().includes(value) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(value)
    );
  });
  renderEmployees(filter);
});

const storedUser =
  sessionStorage.getItem("user") || localStorage.getItem("user");

if (!storedUser) {
  window.location.href = "signin.html";
}

const loggedUser = storedUser && JSON.parse(storedUser);

userProfile.addEventListener("click", () => {
  window.location.href = `user.html?id=${loggedUser.id}`;
});

if (loggedUser.role !== "Admin") {
  window.location.href = "index.html";
}

async function loadEmployees() {
  try {
    const res = await fetch("http://localhost:3000/user");
    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    const foundUser = data.find((user: Employee) => user.id === loggedUser.id);
    loggedUserAvatar.src = foundUser.user_avatar;
    loggedUserName.textContent = `${foundUser.first_name} ${foundUser.last_name}`;
    hiddenNavImage.src = foundUser.user_avatar;
    employees = Array.isArray(data) ? data : [];
    renderEmployees(employees);
  } catch (error) {
    console.error(error);
  }
}

loadEmployees();

function renderEmployees(users: Employee[]): void {
  list.innerHTML = "";

  users.forEach((user: Employee) => {
    list.innerHTML += `
      <div class="permissions-user-layout" data-id="${user.id}">
        <div class="permissions-user-layout-inner">
            <div class="permissions-inner-flex">
              
              <img src="${user.user_avatar}" alt="${
      user.first_name
    }" class="permissions-avatar">
              <p>${user.first_name} ${user.last_name}</p>
            </div>
            <div class="permissions-inner-flex">
              <button data-role="Employee" class="${
                user.role === "Employee" ? "indicated" : ""
              }" ${user.role === "Admin" ? "disabled" : ""}>Employee</button>
              <button data-role="HR" class="${
                user.role === "HR" ? "indicated" : ""
              }" ${user.role === "Admin" ? "disabled" : ""}>HR</button>
            </div>
            <div class="permissions-inner-flex">
              <button class="${
                user.role !== "Admin" ? "indicated" : ""
              }">Employee</button>
              <button class="${
                user.role === "Admin" ? "indicated" : ""
              }">PO</button>
              <button>DD</button>

                
            </div>
            <div class="permissions-inner-flex admin-cell">
             <button class="${
               user.role === "Admin" ? "indicated" : ""
             }">Admin</button>
            </div>
           

            

        </div>
      </div>
    `;
  });

  document.querySelectorAll(".permissions-user-layout").forEach((row) => {
    const id = row.getAttribute("data-id")!;
    row.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const updatedRole = btn.getAttribute("data-role")!;
        newUserRoleFunc(id, updatedRole);
      });
    });
  });
}

async function newUserRoleFunc(id: string, newRole: string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    console.log(response);

    loadEmployees();
  } catch (error) {
    console.error("Error updating user", error);
    alert("failed");
  }
}
