import React, { useMemo, useState } from "react";
import { isAuthed, clearToken } from "./auth.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import "./App.css";

export default function App() {
  const [route, setRoute] = useState(isAuthed() ? "dashboard" : "login");
  const [flash, setFlash] = useState("");

  const nav = useMemo(() => ({
    go: (r) => { setFlash(""); setRoute(r); },
    logout: () => { clearToken(); setFlash("Successfully logged out."); setRoute("login"); }
  }), []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, color: "var(--primary)" }}>FocusFlow</h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Spring Boot + React Productivity</p>
        </div>
        {isAuthed() && (
          <button className="btn btn-ghost" onClick={nav.logout}>Logout</button>
        )}
      </header>

      {flash && (
        <div style={{ background: "#eff6ff", color: "#1e40af", padding: "12px 20px", borderRadius: 8, marginBottom: 24, border: "1px solid #bfdbfe", fontSize: 14 }}>
          {flash}
        </div>
      )}

      <main>
        {route === "login" && <Login onAuthed={() => nav.go("dashboard")} onGoRegister={() => nav.go("register")} onFlash={setFlash} />}
        {route === "register" && <Register onAuthed={() => nav.go("dashboard")} onGoLogin={() => nav.go("login")} onFlash={setFlash} />}
        {route === "dashboard" && <Dashboard onFlash={setFlash} />}
      </main>
    </div>
  );
}
