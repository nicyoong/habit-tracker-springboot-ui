import React, { useState, useMemo } from "react";
import { api } from "../api";
import { setToken } from "../auth";

export default function Register({ onAuthed, onGoLogin, onFlash }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // 1. Password Strength Logic
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "#e2e8f0" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = [
      { label: "Very Weak", color: "#ef4444" }, // Red
      { label: "Weak", color: "#f97316" },      // Orange
      { label: "Fair", color: "#eab308" },      // Yellow
      { label: "Good", color: "#22c55e" },      // Green
      { label: "Strong", color: "#10b981" },    // Emerald
    ];
    
    return { ...map[score], score };
  }, [password]);

  async function submit(e) {
    e.preventDefault();
    if (username.length < 3) return onFlash("Username is too short.");
    if (strength.score < 2) return onFlash("Please choose a stronger password.");

    setBusy(true);
    try {
      const res = await api.register(username, password);
      setToken(res.token);
      onFlash(`Welcome aboard, ${res.username}!`);
      onAuthed();
    } catch (err) {
      onFlash(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: 28, fontWeight: 800 }}>Create Account</h2>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15 }}>
          Join us to start tracking your daily progress.
        </p>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Username
          </label>
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="3-50 characters" 
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Password
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Min. 8 characters" 
            required
            style={{ marginBottom: 8 }}
          />

          {/* 2. Strength Meter UI */}
          {password && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>Strength</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label}</span>
              </div>
              <div style={{ height: 4, width: "100%", background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                <div 
                  style={{ 
                    height: "100%", 
                    width: `${(strength.score / 4) * 100}%`, 
                    background: strength.color,
                    transition: "width 0.3s ease, background 0.3s ease" 
                  }} 
                />
              </div>
              <ul style={{ padding: 0, margin: "8px 0 0 0", listStyle: "none", fontSize: 11, color: "var(--text-muted)" }}>
                <li style={{ color: password.length >= 8 ? "var(--success)" : "inherit" }}>• At least 8 characters</li>
                <li style={{ color: /[0-9]/.test(password) ? "var(--success)" : "inherit" }}>• Includes a number</li>
              </ul>
            </div>
          )}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: "100%", padding: "14px", marginTop: 8 }} 
          disabled={busy || (password && strength.score < 2)}
        >
          {busy ? "Creating account..." : "Get Started"}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onGoLogin(); }} 
          style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
        >
          Sign in
        </a>
      </div>
    </div>
  );
}
