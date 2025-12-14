import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../store/api/authApi";

const SignIn = () => {
  const navigate = useNavigate();
  const [signIn, { isLoading, error }] = useSignInMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const user = await signIn({ email, password }).unwrap();
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/user");
  }

  return (
    <main className="signin-wrapper">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-text">Invalid credentials</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
};

export default SignIn;
