const employeeSection = document.getElementById("employee-section");

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
