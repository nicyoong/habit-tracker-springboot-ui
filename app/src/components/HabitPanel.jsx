import React, { useState } from "react";
import { api } from "../api";
import { Flame, Zap, Play, Pause, Trash2, Plus } from "lucide-react";

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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Zap size={20} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Habits</h3>
      </div>
      
      <form onSubmit={addHabit} style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <input placeholder="New habit name..." value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn btn-primary" disabled={!name.trim()}>
          <Plus size={18} /> Add Habit
        </button>
      </form>

      <div className="animate-list" style={{ display: "grid", gap: 12 }}>
        {habits.map(h => (
          <div key={h.id} style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: h.active ? "white" : "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ opacity: h.active ? 1 : 0.6 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                  {h.name} 
                  {!h.active && <span style={{ fontSize: 10, padding: "2px 6px", background: "#e2e8f0", borderRadius: 4 }}>PAUSED</span>}
                </div>
                {h.description && <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>{h.description}</div>}
                
                <div style={{ display: "flex", gap: 16 }}>
                  <Stat icon={<Flame size={14} />} label="Streak" value={h.stats?.currentStreak} color="#f97316" />
                  <Stat icon={<Zap size={14} />} label="Total" value={h.stats?.totalCheckIns} color="var(--primary)" />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-primary" onClick={() => api.checkInHabit(h.id, todayISO()).then(u => setHabits(habits.map(x => x.id === h.id ? u : x)))} disabled={!h.active} style={{ padding: "6px 12px", fontSize: 12 }}>
                  Check-in
                </button>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-ghost" onClick={() => api.updateHabit(h.id, { active: !h.active }).then(u => setHabits(habits.map(x => x.id === h.id ? u : x)))} style={{ flex: 1, padding: 6 }}>
                    {h.active ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button className="btn btn-ghost" onClick={() => api.deleteHabit(h.id).then(() => setHabits(habits.filter(x => x.id !== h.id)))} style={{ flex: 1, padding: 6, color: "var(--danger)" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Stat = ({ icon, label, value, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ color: color || "var(--text-muted)" }}>{icon}</div>
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{value ?? 0}</div>
    </div>
  </div>
);
