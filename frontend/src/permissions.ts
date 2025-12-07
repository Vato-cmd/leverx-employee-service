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

const storedUser =
  sessionStorage.getItem("user") || localStorage.getItem("user");

if (!storedUser) {
  window.location.href = "signin.html";
}

const loggedUser = storedUser && JSON.parse(storedUser);

let employees: Employee[] = [];

async function loadEmployees() {
  try {
    const res = await fetch("http://localhost:3000/employees");
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
              }">Employee</button>
              <button data-role="HR" class="${
                user.role === "HR" ? "indicated" : ""
              }">HR</button>
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

              <button class="${
                user.role === "Admin" ? "indicated" : ""
              }">Admin</button>

        </div>
      </div>
    `;
  });

  document.querySelectorAll(".permissions-user-layout").forEach((row) => {
    const id = row.getAttribute("data-id")!;
    console.log(typeof id);
    row.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const updatedRole = btn.getAttribute("data-role")!;
        newUserRoleFunc(id, updatedRole);
      });
    });
  });
}

async function newUserRoleFunc(id: string, newRole: string) {
  try {
    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    loadEmployees();
  } catch (error) {
    console.error("Error updating user", error);
    alert("failed");
  }
}
