import React, { useMemo, useState } from "react";
import { isAuthed, clearToken } from "./auth.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Layout, LogOut } from "lucide-react";
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "var(--primary)", color: "white", padding: 8, borderRadius: 10 }}>
            <Layout size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, margin: 0, fontWeight: 800 }}>FocusFlow</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>Personal Productivity</p>
          </div>
        </div>
        {isAuthed() && (
          <button className="btn btn-ghost" onClick={nav.logout} style={{ gap: 8 }}>
            <LogOut size={16} /> Logout
          </button>
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
