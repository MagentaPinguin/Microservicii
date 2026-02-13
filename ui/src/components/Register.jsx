import { useState } from "react";
import "./style.css";
import { apiPost, setToken } from "../api.js";

export default function Register({ onSuccess, goLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost("/auth/register", { name, email, password });

      // If your backend returns token on register:
      if (data?.accessToken) {
        setToken(data.accessToken);
        onSuccess();
        return;
      }

      // Fallback: if register doesn't return token, login right after:
      const login = await apiPost("/auth/login", { email, password });
      setToken(login.accessToken);
      onSuccess();
    } catch (err) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-box" onSubmit={submit}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      {error && <p className="error">{error}</p>}

      <button disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>

      <p className="hint">
        Already have an account?{" "}
        <button type="button" className="linkBtn" onClick={goLogin}>
          Login
        </button>
      </p>
    </form>
  );
}
