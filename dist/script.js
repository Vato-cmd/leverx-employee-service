const basicSearchBtn = document.getElementById("basic-search");
const formHiddenParagraph = document.getElementById("form-hidden-paragraph");
const advancedSearchBtn = document.getElementById("advanced-search");
const userProfile = document.getElementById("user-profile");
const logout = document.getElementById("logout");
const signOutParagraph = document.getElementById("signout-paragraph");
logout.addEventListener("click", logoutFunc);
signOutParagraph.addEventListener("click", logoutFunc);
function logoutFunc() {
    sessionStorage.removeItem("user");
    window.location.href = "signin.html";
}
const basicContent = document.getElementById("basic-content");
const advancedContent = document.getElementById("advanced-content");
const svgGrid = document.getElementById("svg-grid");
const svgList = document.getElementById("svg-list");
const loggedUserAvatar = document.getElementById("logged-user-avatar");
const hiddenNavImage = document.getElementById("hidden-nav-image");
const loggedUserName = document.getElementById("logged-user-name");
const employeeSection = document.getElementById("employee-section");
const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
console.log(storedUser);
if (!storedUser) {
    window.location.href = "signin.html";
}
let employees = [];
const loggedUser = JSON.parse(storedUser);
userProfile.addEventListener("click", () => {
    window.location.href = `user.html?id=${loggedUser.id}`;
});
const buttonGrid = document.getElementById("button-grid");
const buttonList = document.getElementById("button-list");
const form = document.getElementById("form");
const conditionalRenderComponent = document.getElementById("conditional-section");
const employeeSearchBtn = document.getElementById("employee-search-btn");
const basicEmployeeSearchInput = document.getElementById("basic-employee-search-input");
const advancedInputs = advancedContent.querySelectorAll("input, select");
console.log(advancedContent);
advancedInputs.forEach((input) => {
    input.addEventListener("input", handleAdvancedReset);
    input.addEventListener("change", handleAdvancedReset);
});
function handleAdvancedReset() {
    const formData = new FormData(form);
    let hasValue = false;
    formData.forEach((value) => {
        const cleaned = String(value).trim();
        if (cleaned && !cleaned.startsWith("Select")) {
            hasValue = true;
        }
    });
    if (!hasValue) {
        renderEmployees(employees);
        resetLayoutToCurrentView();
    }
}
function resetLayoutToCurrentView() {
    if (svgGrid.classList.contains("clicked")) {
        employeeSection.classList.add("employee-section");
        employeeSection.classList.remove("list-employee-section");
        document
            .querySelectorAll(".employee-cards")
            .forEach((card) => card.classList.remove("list"));
    }
    if (svgList.classList.contains("clicked")) {
        employeeSection.classList.remove("employee-section");
        employeeSection.classList.add("list-employee-section");
        document
            .querySelectorAll(".employee-cards")
            .forEach((card) => card.classList.add("list"));
    }
}
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const advanceSearchObject = {};
    formData.forEach((value, key) => {
        const cleaned = String(value).trim().toLowerCase();
        if (!cleaned || cleaned.startsWith("select"))
            return;
        advanceSearchObject[key] = cleaned;
    });
    if (Object.entries(advanceSearchObject).length === 0) {
        formHiddenParagraph.textContent = `Please enter at least one search field!`;
        formHiddenParagraph.classList.remove("hidden");
        formHiddenParagraph.classList.add("hidden-message");
        setTimeout(() => {
            formHiddenParagraph.classList.add("hidden");
        }, 1000);
    }
    const found = employees.filter((emp) => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        return Object.entries(advanceSearchObject).every(([key, value]) => {
            switch (key) {
                case "name":
                    return (emp.first_name.toLowerCase().includes(value) ||
                        emp.last_name.toLowerCase().includes(value) ||
                        fullName.includes(value));
                default:
                    const field = emp[key];
                    return field && String(field).toLowerCase().includes(value);
            }
        });
    });
    if (found.length > 0) {
        renderEmployees(found);
    }
    else {
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
async function loadEmployees() {
    try {
        const res = await fetch("http://localhost:3000/employees");
        if (!res.ok)
            throw new Error("Server error");
        const data = await res.json();
        const foundUser = data.find((user) => user.id === loggedUser.id);
        loggedUserAvatar.src = foundUser.user_avatar;
        loggedUserName.textContent = `${foundUser.first_name} ${foundUser.last_name}`;
        hiddenNavImage.src = foundUser.user_avatar;
        employees = Array.isArray(data) ? data : [];
        renderEmployees(employees);
    }
    catch (error) {
        console.error(error);
        employeeSection.innerHTML = "<h2>Failed to load employees.</h2>";
    }
}
loadEmployees();
function renderEmployees(users) {
    employeeSection.innerHTML = "";
    employeeSection.classList.add("employee-section");
    employeeSection.classList.remove("employee-section-flex");
    users.forEach((user) => {
        employeeSection.innerHTML += `
      <div>
       <a href="user.html?id=${user.id}">
        <div class="employee-cards">
            <div class="remote-relative">
              <img src="${user.user_avatar}" alt="${user.first_name}" class="avatar">
              ${user.isRemoteWork
            ? `<div class="remote-container">
                      <img class="remote" src="images/icons8-remote-working-32.png" alt="remote" />
                     </div>
                    `
            : ""}
            </div>
            <h3>${user.first_name} ${user.last_name}</h3>
                <p class="department"><img src="images/briefcase-svgrepo-com.svg"/>${user.department}</p>
                <p class="department second-p"><img src="images/door-svgrepo-com.svg"/>${user.room}</p>
        </div>
        </a>
      </div>
    `;
    });
}
basicEmployeeSearchInput.addEventListener("input", () => {
    const value = basicEmployeeSearchInput.value.trim().toLowerCase();
    if (value === "") {
        renderEmployees(employees);
        if (svgGrid.classList.contains("clicked")) {
            document.querySelectorAll(".employee-cards").forEach((card) => {
                card.classList.remove("list");
            });
            employeeSection.classList.add("employee-section");
            employeeSection.classList.remove("list-employee-section");
        }
        if (svgList.classList.contains("clicked")) {
            document.querySelectorAll(".employee-cards").forEach((card) => {
                card.classList.add("list");
            });
            employeeSection.classList.remove("employee-section");
            employeeSection.classList.add("list-employee-section");
        }
    }
});
employeeSearchBtn.addEventListener("click", () => {
    const value = basicEmployeeSearchInput.value.trim().toLowerCase();
    console.log(value);
    if (!value)
        return;
    employees.forEach((employee) => (employee.fullname =
        `${employee.first_name} ${employee.last_name}`.toLowerCase()));
    const findEmployee = employees.filter((employee) => {
        const firstName = employee.first_name.toLowerCase();
        const lastName = employee.last_name.toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const id = employee.id.toLowerCase();
        return (id.includes(value) ||
            firstName.includes(value) ||
            lastName.includes(value) ||
            fullName.includes(value));
    });
    if (findEmployee.length > 0) {
        renderEmployees(findEmployee);
    }
    else {
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
export {};
//# sourceMappingURL=script.js.map