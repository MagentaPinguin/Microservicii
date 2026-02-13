import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard.jsx";
import { getToken, clearToken } from "./api.js";

export default function App() {
  const [page, setPage] = useState("");

  useEffect(() => {
    const t = getToken("accessToken");
    if (t) {
      setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  if (page === "login")
    return (
      <Login
        onSuccess={() => setPage("dashboard")}
        goRegister={() => setPage("register")}
      />
    );

  if (page === "register")
    return (
      <Register
        onSuccess={() => setPage("dashboard")}
        goLogin={() => setPage("login")}
      />
    );

  return (
    <Dashboard
      onLogout={() => {
        clearToken("accessToken");
        setPage("login");
      }}
    />
  );
}
