import "./styles.scss";
const emailInput = document.getElementById("email");
const hiddenMessage = document.getElementById("hidden-message");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("sign-in-btn");
const rememberMe = document.getElementById("remember-me");
const spinner = document.getElementById("btn-loader");
const invalidCredentials = document.getElementById("invalid-credentials");
const missingEmail = document.getElementById("missing-email");
const missingPassword = document.getElementById("missing-password");
const signInButtonSpan = document.getElementById("sign-in-span");
const signUpButton = document.getElementById("sign-up-btn");
signUpButton.addEventListener("click", async () => {
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const email = document.getElementById("new_email").value.trim();
    const password = document.getElementById("new_password").value.trim();
    const password2 = document.getElementById("new_password2").value.trim();
    if (password !== password2) {
        hiddenMessage.classList.remove("hidden");
        hiddenMessage.innerText = "Passwords do not match";
        setTimeout(() => {
            hiddenMessage.classList.add("hidden");
        }, 1000);
        return;
    }
    const response = await fetch("http://localhost:3000/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        data.message;
        hiddenMessage.textContent = data.message;
        hiddenMessage.classList.remove("hidden");
        setTimeout(() => {
            hiddenMessage.classList.add("hidden");
        }, 1000);
        return;
    }
    alert("You have successfully signed up! please sign in");
    switchForms();
});
const signInForm = document.getElementById("sign-in-form");
const signUpForm = document.getElementById("sign-up-form");
const toggleSignForm = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");
let signedUp = false;
toggleSignForm.addEventListener("click", switchForms);
function switchForms() {
    signedUp = !signedUp;
    if (signedUp) {
        signInForm.classList.add("hidden");
        signUpForm.classList.remove("hidden");
        toggleSignForm.textContent = "Already have an account? Sign in";
        formTitle.textContent = "Create an account";
    }
    else {
        signInForm.classList.remove("hidden");
        signUpForm.classList.add("hidden");
        toggleSignForm.textContent = "Don't have an account? Sign up";
        formTitle.textContent = "Sign in";
    }
}
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
        signInButtonSpan.textContent = "Signing in...";
        setTimeout(() => {
            signInButtonSpan.textContent = "Click to sign in";
            window.location.href = "index.html";
            spinner.hidden = true;
        }, 1000);
    }
    catch (error) {
        console.error(error);
        alert("Server error. Please try again.");
    }
});
//# sourceMappingURL=signin.js.map