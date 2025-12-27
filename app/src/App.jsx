import React, { useMemo, useState } from "react";
import { isAuthed, clearToken } from "./auth";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [route, setRoute] = useState(isAuthed() ? "dashboard" : "login");
  const [flash, setFlash] = useState("");

  const nav = useMemo(() => ({
    go: (r) => { setFlash(""); setRoute(r); },
    logout: () => { clearToken(); setFlash("Logged out."); setRoute("login"); }
  }), []);

  const shellStyle = {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    maxWidth: 980,
    margin: "40px auto",
    padding: "0 16px"
  };

  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "white"
  };

  const topBarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  };

  return (
    <div style={shellStyle}>
      <div style={topBarStyle}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Habit / Task Tracker</div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>Spring Boot + React demo</div>
        </div>
        {isAuthed() ? (
          <button onClick={nav.logout} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
            Logout
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => nav.go("login")} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
              Login
            </button>
            <button onClick={() => nav.go("register")} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
              Register
            </button>
          </div>
        )}
      </div>

      {flash ? (
        <div style={{ ...cardStyle, marginBottom: 16, background: "#f9fafb" }}>{flash}</div>
      ) : null}

      <div style={cardStyle}>
        {route === "login" && <Login onAuthed={() => nav.go("dashboard")} onGoRegister={() => nav.go("register")} onFlash={setFlash} />}
        {route === "register" && <Register onAuthed={() => nav.go("dashboard")} onGoLogin={() => nav.go("login")} onFlash={setFlash} />}
        {route === "dashboard" && <Dashboard onFlash={setFlash} />}
      </div>
    </div>
  );
}
