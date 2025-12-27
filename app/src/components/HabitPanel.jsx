import React, { useState } from "react";
import { api } from "../api";

export default function HabitPanel({ habits, setHabits, onFlash }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const todayISO = () => new Date().toISOString().slice(0, 10);

  async function addHabit(e) {
    e.preventDefault();
    try {
      const created = await api.createHabit(name, description || null);
      setHabits([created, ...habits]);
      setName(""); setDescription("");
    } catch (err) { onFlash(err.message); }
  }

  return (
    <div className="card">
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1.25rem" }}>Habits</h3>
      
      <form onSubmit={addHabit} style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <input placeholder="What habit are you starting?" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Short description..." value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn btn-primary" disabled={!name.trim()}>Add Habit</button>
      </form>

      <div className="animate-list" style={{ display: "grid", gap: 12 }}>
        {habits.map(h => (
          <div key={h.id} style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: h.active ? "white" : "#f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ opacity: h.active ? 1 : 0.6 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  {h.name} {!h.active && <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>(Paused)</span>}
                </div>
                {h.description && <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>{h.description}</div>}
                
                <div style={{ display: "flex", gap: 16 }}>
                  <Stat label="Streak" value={h.stats?.currentStreak} color="var(--primary)" />
                  <Stat label="Best" value={h.stats?.longestStreak} />
                  <Stat label="Total" value={h.stats?.totalCheckIns} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-primary" onClick={() => api.checkInHabit(h.id, todayISO()).then(u => setHabits(habits.map(x => x.id === h.id ? u : x)))} disabled={!h.active} style={{ padding: "6px 12px" }}>
                  Check-in
                </button>
                <button className="btn btn-ghost" onClick={() => api.updateHabit(h.id, { active: !h.active }).then(u => setHabits(habits.map(x => x.id === h.id ? u : x)))} style={{ fontSize: 12, padding: "4px" }}>
                  {h.active ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div>
    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)" }}>{label}</div>
    <div style={{ fontWeight: 800, color: color || "var(--text-main)" }}>{value ?? 0}</div>
  </div>
);
