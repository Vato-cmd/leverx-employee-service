const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("sign-in-btn");
signInButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email) {
        alert("Please enter your email!");
        return;
    }
    if (!password) {
        alert("Please enter your password!");
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
            alert(data.message);
            return;
        }
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
    }
    catch (error) {
        console.error(error);
        alert("Server error. Please try again.");
    }
});
export {};
//# sourceMappingURL=signin.js.map