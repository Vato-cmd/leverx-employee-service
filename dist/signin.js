const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("sign-in-btn");
const rememberMe = document.getElementById("remember-me");
const spinner = document.getElementById("btn-loader");
const invalidCredentials = document.getElementById("invalid-credentials");
const missingInfo = document.getElementById("missing-info");
const missingEmail = document.getElementById("missing-email");
const missingPassword = document.getElementById("missing-password");
signInButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email) {
        missingEmail.textContent = "fill in email";
        missingEmail.classList.remove("hidden");
        setTimeout(() => {
            missingEmail.classList.add("hidden");
        }, 1000);
        return;
    }
    if (!password) {
        missingPassword.textContent = "fill in password";
        missingPassword.classList.remove("hidden");
        setTimeout(() => {
            missingPassword.classList.add("hidden");
        }, 1000);
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            invalidCredentials.classList.remove("hidden");
            setTimeout(() => {
                invalidCredentials.classList.add("hidden");
            }, 1200);
            passwordInput.value = "";
            emailInput.value = "";
            return;
        }
        spinner.hidden = false;
        if (rememberMe.checked) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        else {
            sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        setTimeout(() => {
            window.location.href = "index.html";
            spinner.hidden = true;
        }, 1000);
    }
    catch (error) {
        console.error(error);
        alert("Server error. Please try again.");
    }
});
export {};
//# sourceMappingURL=signin.js.map