import { useState } from "react";
import "./style.css";
import { setToken, apiPost } from "../api";

export default function Login({ onSuccess, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost("/auth/login", { email, password });
      setToken("accessToken", data.accessToken);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-box" onSubmit={submit}>
      <h2>Login</h2>
      <input
        placeholder="Email"
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
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      <p>
        No account?{" "}
        <button type="button" onClick={goRegister}>
          Register
        </button>
      </p>
    </form>
  );
}
