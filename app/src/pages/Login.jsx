import React, { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";

export default function Login({ onAuthed, onGoRegister, onFlash }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      onFlash("Username and password are required");
      return;
    }
    setBusy(true);
    try {
      const res = await api.login(username, password);
      setToken(res.token);
      onFlash(`Welcome, ${res.username}!`);
      onAuthed();
    } catch (err) {
      onFlash(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          <div style={{ fontSize: 13, color: "#374151" }}>Username</div>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
                 style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        </label>
        <label>
          <div style={{ fontSize: 13, color: "#374151" }}>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        </label>
        <button disabled={busy} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          No account? <a href="#" onClick={(e) => { e.preventDefault(); onGoRegister(); }}>Register</a>
        </div>
      </form>
    </div>
  );
}
