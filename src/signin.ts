const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const signInButton = document.getElementById(
  "sign-in-btn"
) as HTMLButtonElement;
const rememberMe = document.getElementById("remember-me") as HTMLInputElement;
const spinner = document.getElementById("btn-loader") as HTMLDivElement;
const invalidCredentials = document.getElementById(
  "invalid-credentials"
) as HTMLDivElement;
const missingEmail = document.getElementById(
  "missing-email"
) as HTMLSpanElement;
const missingPassword = document.getElementById(
  "missing-password"
) as HTMLSpanElement;
const signInButtonSpan = document.getElementById(
  "sign-in-span"
) as HTMLSpanElement;
const signUpButton = document.getElementById("sign-up-btn") as HTMLSpanElement;

const signInForm = document.getElementById("sign-in-form") as HTMLDivElement;
const signUpForm = document.getElementById("sign-un-form") as HTMLDivElement;
const toggleSignForm = document.getElementById(
  "toggle-form"
) as HTMLParagraphElement;
const formTitle = document.getElementById("form-title") as HTMLParagraphElement;

let signedUp = false;

if (signedUp) {
  signInForm.classList.add("hidden");
  signUpForm.classList.remove("hidden");
  toggleSignForm.textContent = "Already have an account? Sign in";
  formTitle.textContent = "Create an account";
} else {
  signInForm.classList.remove("hidden");
  signUpForm.classList.add("hidden");
  toggleSignForm.textContent = "Don't have an account? Sign up";
  formTitle.textContent = "Sign in";
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
    } else {
      sessionStorage.setItem("user", JSON.stringify(data.user));
    }
    signInButtonSpan.textContent = "Signing in...";

    setTimeout(() => {
      signInButtonSpan.textContent = "Click to sign in";
      window.location.href = "index.html";
      spinner.hidden = true;
    }, 1000);
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  }
});
