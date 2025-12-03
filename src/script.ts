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

const basicSearchBtn = document.getElementById(
  "basic-search"
) as HTMLButtonElement;
const advancedSearchBtn = document.getElementById(
  "advanced-search"
) as HTMLButtonElement;
const basicContent = document.getElementById("basic-content") as HTMLDivElement;
const advancedContent = document.getElementById(
  "advanced-content"
) as HTMLDivElement;

const svgGrid = document.getElementById("svg-grid") as HTMLElement;
const svgList = document.getElementById("svg-list") as HTMLElement;

const employeeSection = document.getElementById(
  "employee-section"
) as HTMLElement;

const buttonGrid = document.getElementById("button-grid") as HTMLButtonElement;
const buttonList = document.getElementById("button-list") as HTMLButtonElement;

const form = document.getElementById("form") as HTMLFormElement;

const conditionalRenderComponent = document.getElementById(
  "conditional-section"
) as HTMLElement;

const employeeSearchBtn = document.getElementById(
  "employee-search-btn"
) as HTMLButtonElement;
const basicEmployeeSearchInput = document.getElementById(
  "basic-employee-search-input"
) as HTMLInputElement;

let employees: Employee[] = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const advanceSearchObject: Record<string, string> = {};
  formData.forEach((value, key) => {
    const cleaned = String(value).trim().toLowerCase();
    if (!cleaned || cleaned.startsWith("select")) return;
    advanceSearchObject[key] = cleaned;
  });

  if (Object.entries(advanceSearchObject).length === 0) {
    form.innerHTML = `<h3 style="opacity: 0.8; transform: scale(1.1)">Please enter at least one search field!</h3>`;
    setTimeout(() => {
      form.innerHTML = `
        <label for="name">Name</label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="John Smith"
              />

              <label for="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john.smith@leverx.com"
              />
              <div class="phone-skype">
                <div>
                  <label for="phone">Phone</label>
                  <input
                    name="phone"
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label for="viber">Viber</label>
                  <input name="viber" type="tel" placeholder="ViberId" />
                </div>
              </div>
              <div class="phone-skype">
                <div>
                  <label for="building">Building</label>
                  <select name="building" id="building">
                    <option>Select building</option>
                    <option>LeverX HQ – Poland</option>
                    <option>LeverX Dubai</option>
                    <option>LeverX HQ – Georgia</option>
                    <option>LeverX HQ – Kazakhstan</option>
                    <option>Remote</option>
                    <option>LeverX Bulgaria</option>
                    <option>LeverX HQ – Hungary</option>
                    <option>LeverX HQ – England</option>
                    <option>Leverx HQ</option>
                    <option>LeverX HQ — Ukraine</option>
                  </select>
                </div>
                <div>
                  <label for="room">Room</label>
                  <input
                    name="room"
                    id="room"
                    type="text"
                    placeholder="303.1"
                  />
                </div>
              </div>

              <label for="department">Department</label>
              <select name="department" id="department">
                <option>Select a department</option>
                <option>Web & Mobile</option>
                <option>Legal Department</option>
                <option>Human Resources (HR)</option>
                <option>Operations</option>
                <option>Research & Development (R&D)</option>
                <option>Customer Support</option>
                <option>IT / Information Technology</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Finance & Accounting</option>
              </select>
              <button class="search-btn">SEARCH</button>
      `;
    }, 1000);
    return;
  }
  const found = employees.find((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();

    return Object.entries(advanceSearchObject).every(([key, value]) => {
      switch (key) {
        case "name":
          return (
            emp.first_name.toLowerCase().includes(value) ||
            emp.last_name.toLowerCase().includes(value) ||
            fullName.includes(value)
          );
        default:
          const field = (emp as Record<string, any>)[key];
          return field && field.toString().toLowerCase() === value;
      }
    });
  });
  if (found) {
    window.location.href = `user.html?id=${found.id}`;
  } else {
    employeeSection.classList.remove("employee-section");
    employeeSection.classList.add("employee-section-flex");
    employeeSection.innerHTML = `
      <img src="images/Page-Not-Found--Streamline-Lagos.png" />
      <h2>404 Page not found</h2>
      <p>Sorry, we can't find that page! it might be an old link or maybe it was removed</p>
      <button id="go-home">GO TO THE HOME PAGE</button>
    `;
    const goHomeBtn = document.getElementById("go-home");
    if (goHomeBtn) {
      goHomeBtn.addEventListener("click", goToHomePage);
    }
    const buttonSection = document.querySelector(".button-section");
    if (buttonSection instanceof HTMLElement) {
      buttonSection.classList.add("hidden");
    }
  }
});

function goToHomePage() {
  return (window.location.href = `index.html`);
}

fetch("./data/users.json")
  .then((res) => res.json())
  .then((data) => {
    employees = data;
    renderEmployees(employees);
  });

function renderEmployees(users: Employee[]): void {
  users.forEach((user: Employee, index: number) => {
    if (index !== users.length - 1) {
      employeeSection.innerHTML += `
      <div>
       <a href="user.html?id=${user.id}">
        <div class="employee-cards">
            <div class="remote-relative">
              <img src="${user.user_avatar}" alt="${
        user.first_name
      }" class="avatar">
              ${
                user.isRemoteWork
                  ? `<div class="remote-container">
                      <img class="remote" src="images/icons8-remote-working-32.png" alt="remote" />
                     </div>
                    `
                  : ""
              }
            </div>
            <h3>${user.first_name} ${user.last_name}</h3>
                <p class="department"><img src="images/briefcase-svgrepo-com.svg"/>${
                  user.department
                }</p>
                <p class="department second-p"><img src="images/door-svgrepo-com.svg"/>${
                  user.room
                }</p>
        </div>
        </a>
      </div>
    `;
    }
  });
}

employeeSearchBtn.addEventListener("click", () => {
  const value = basicEmployeeSearchInput.value.trim().toLowerCase();
  if (!value) return;

  employees.forEach(
    (employee: Employee) =>
      (employee.fullname =
        `${employee.first_name} ${employee.last_name}`.toLowerCase())
  );

  const findEmployee = employees.find((employee: Employee) => {
    const firstName = employee.first_name.toLowerCase();
    const lastName = employee.last_name.toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    const id = employee.id.toLowerCase();

    return (
      id === value ||
      firstName === value ||
      lastName === value ||
      fullName === value
    );
  });

  if (findEmployee) {
    window.location.href = `user.html?id=${findEmployee.id}`;
  } else {
    employeeSection.classList.remove("employee-section");
    employeeSection.classList.add("employee-section-flex");
    employeeSection.innerHTML = `
      <img src="images/Page-Not-Found--Streamline-Lagos.png" />
      <h2>404 Page not found</h2>
      <p>Sorry, we can't find that page! it might be an old link or maybe it was removed</p>
      <button id="go-home">GO TO THE HOME PAGE</button>
    `;

    const goHomeBtn = document.getElementById("go-home");
    if (goHomeBtn) {
      goHomeBtn.addEventListener("click", goToHomePage);
    }

    const buttonSection = document.querySelector(".button-section");
    if (buttonSection) {
      buttonSection.classList.add("hidden");
    }
  }
});

advancedSearchBtn.addEventListener("click", () => {
  advancedSearchBtn.classList.toggle("active");
  basicSearchBtn.classList.toggle("active");

  basicContent.classList.toggle("hidden");
  advancedContent.classList.toggle("hidden");
});
basicSearchBtn.addEventListener("click", () => {
  advancedSearchBtn.classList.toggle("active");
  basicSearchBtn.classList.toggle("active");

  basicContent.classList.toggle("hidden");
  advancedContent.classList.toggle("hidden");
});

buttonGrid.addEventListener("click", () => {
  employeeSection.classList.add("employee-section");
  employeeSection.classList.remove("list-employee-section");

  conditionalRenderComponent.classList.add("hidden");
  svgGrid.classList.add("clicked");
  svgList.classList.remove("clicked");
  document.querySelectorAll(".employee-cards").forEach((card) => {
    card.classList.remove("list");
  });
});
buttonList.addEventListener("click", () => {
  employeeSection.classList.remove("employee-section");
  employeeSection.classList.add("list-employee-section");

  conditionalRenderComponent.classList.remove("hidden");
  svgList.classList.add("clicked");
  svgGrid.classList.remove("clicked");
  document.querySelectorAll(".employee-cards").forEach((card) => {
    card.classList.add("list");
  });
});
