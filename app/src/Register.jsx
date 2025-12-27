import React, { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";

export default function Register({ onAuthed, onGoLogin, onFlash }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.register(username, password);
      setToken(res.token);
      onFlash(`Account created for ${res.username}.`);
      onAuthed();
    } catch (err) {
      onFlash(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          <div style={{ fontSize: 13, color: "#374151" }}>Username (3-50)</div>
          <input value={username} onChange={(e) => setUsername(e.target.value)}
                 style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        </label>
        <label>
          <div style={{ fontSize: 13, color: "#374151" }}>Password (min 8)</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        </label>
        <button disabled={busy} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
          {busy ? "Creating..." : "Create account"}
        </button>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin(); }}>Login</a>
        </div>
      </form>
    </div>
  );
}
