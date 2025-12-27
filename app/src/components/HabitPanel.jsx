import React, { useState } from "react";
import { api } from "../api";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitPanel({ habits, setHabits, onFlash }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function addHabit(e) {
    e.preventDefault();
    try {
      const created = await api.createHabit(name, description || null);
      setHabits([created, ...habits]);
      setName("");
      setDescription("");
    } catch (err) {
      onFlash(err.message);
    }
  }

  async function checkIn(h) {
    try {
      const updated = await api.checkInHabit(h.id, todayISO());
      setHabits(habits.map(x => x.id === h.id ? updated : x));
    } catch (err) {
      onFlash(err.message);
    }
  }

  async function remove(h) {
    try {
      await api.deleteHabit(h.id);
      setHabits(habits.filter(x => x.id !== h.id));
    } catch (err) {
      onFlash(err.message);
    }
  }

  async function toggleActive(h) {
    try {
      const updated = await api.updateHabit(h.id, { active: !h.active });
      setHabits(habits.map(x => x.id === h.id ? updated : x));
    } catch (err) {
      onFlash(err.message);
    }
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Habits</h3>

      <form onSubmit={addHabit} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input placeholder="Habit name" value={name} onChange={(e) => setName(e.target.value)}
               style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)}
               style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <button disabled={!name.trim()} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
          Add habit
        </button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        {habits.map(h => (
          <div key={h.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {h.name} {!h.active ? <span style={{ color: "#6b7280", fontSize: 12 }}>(inactive)</span> : null}
                </div>
                {h.description ? <div style={{ color: "#6b7280", fontSize: 13 }}>{h.description}</div> : null}
                <div style={{ display: "flex", gap: 12, marginTop: 6, color: "#374151", fontSize: 13 }}>
                  <div>Current: <b>{h.stats?.currentStreak ?? 0}</b></div>
                  <div>Longest: <b>{h.stats?.longestStreak ?? 0}</b></div>
                  <div>Total: <b>{h.stats?.totalCheckIns ?? 0}</b></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                <button onClick={() => checkIn(h)} disabled={!h.active}
                        style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                  Check-in today
                </button>
                <button onClick={() => toggleActive(h)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                  {h.active ? "Disable" : "Enable"}
                </button>
                <button onClick={() => remove(h)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {habits.length === 0 ? <div style={{ color: "#6b7280", fontSize: 13 }}>No habits yet.</div> : null}
      </div>
    </div>
  );
}
