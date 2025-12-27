import React, { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";

export default function Login({ onAuthed, onGoRegister, onFlash }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.login(username, password);
      setToken(res.token);
      onFlash(`Welcome back, ${res.username}`);
      onAuthed();
    } catch (err) { onFlash(err.message); } 
    finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>Sign In</h2>
      <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 32 }}>Enter your details to manage your habits.</p>
      
      <form onSubmit={submit} style={{ display: "grid", gap: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: 14 }} disabled={busy}>
          {busy ? "Authenticating..." : "Sign In"}
        </button>
      </form>
      
      <div style={{ marginTop: 24, textAlign: "center", fontSize: 14 }}>
        Don't have an account? <a href="#" onClick={onGoRegister} style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Create one</a>
      </div>
    </div>
  );
}