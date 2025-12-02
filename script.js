const basicSearchBtn = document.getElementById("basic-search");
const advancedSearchBtn = document.getElementById("advanced-search");
const basicContent = document.getElementById("basic-content");
const advancedContent = document.getElementById("advanced-content");
const svgGrid = document.getElementById("svg-grid");
const svgList = document.getElementById("svg-list");
const employeeSection = document.getElementById("employee-section");

const buttonGrid = document.getElementById("button-grid");
const buttonList = document.getElementById("button-list");

const form = document.getElementById("form");
const conditionalRenderComponent = document.getElementById(
  "conditional-section"
);

const employeeSeachBtn = document.getElementById("employee-search-btn");
const basicEmployeeSearchInput = document.getElementById(
  "basic-employee-search-input"
);

let listClicked = false;
let employees = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const advanceSearchObject = {};
  formData.forEach((value, key) => {
    value = value.trim().toLowerCase();
    if (!value || value.startsWith("select")) return;
    advanceSearchObject[key] = value;
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
          return emp[key] && emp[key].toLowerCase() === value;
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

    document.getElementById("go-home").addEventListener("click", goToHomePage);
    document.querySelector(".button-section").classList.add("hidden");
  }
});

fetch("./data/users.json")
  .then((res) => res.json())
  .then((data) => {
    employees = data;
    renderEmployees(employees);
  });

function renderEmployees(users) {
  users.forEach((user, index) => {
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
                <p class="department"><img src="images/door-svgrepo-com.svg"/>${
                  user.room
                }</p>
        </div>
        </a>
      </div>
    `;
    }
  });
}

employeeSeachBtn.addEventListener("click", (e) => {
  const value = basicEmployeeSearchInput.value.trim().toLowerCase();
  if (!value) return;

  employees.forEach(
    (employee) =>
      (employee.fullname =
        `${employee.first_name} ${employee.last_name}`.toLowerCase())
  );

  const findEmployee = employees.find(
    (employee) =>
      employee.id.toLowerCase() === value ||
      employee.first_name.toLowerCase() === value ||
      employee.last_name.toLowerCase() === value ||
      employee.fullname.toLowerCase() === value
  );

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

    document.getElementById("go-home").addEventListener("click", goToHomePage);
    document.querySelector(".button-section").classList.add("hidden");
  }
});

function goToHomePage() {
  return (window.location.href = `index.html`);
}

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
