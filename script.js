const employeeSection = document.getElementById("employee-section");
const basicSearchBtn = document.getElementById("basic-search");
const advancedSearchBtn = document.getElementById("advanced-search");
const basicContent = document.getElementById("basic-content");
const advancedContent = document.getElementById("advanced-content");
const svgGrid = document.getElementById("svg-grid");
const svgList = document.getElementById("svg-list");

const buttonGrid = document.getElementById("button-grid");
const buttonList = document.getElementById("button-list");

let listClicked = false;
let employees = [];

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
