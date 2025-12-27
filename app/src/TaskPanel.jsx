import React, { useState } from "react";
import { api } from "../api";

export default function TaskPanel({ tasks, setTasks, onFlash }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  async function addTask(e) {
    e.preventDefault();
    try {
      const created = await api.createTask(title, notes || null);
      setTasks([created, ...tasks]);
      setTitle("");
      setNotes("");
    } catch (err) {
      onFlash(err.message);
    }
  }

  async function toggleDone(t) {
    try {
      const updated = await api.updateTask(t.id, { done: !t.done });
      setTasks(tasks.map(x => x.id === t.id ? updated : x));
    } catch (err) {
      onFlash(err.message);
    }
  }

  async function remove(t) {
    try {
      await api.deleteTask(t.id);
      setTasks(tasks.filter(x => x.id !== t.id));
    } catch (err) {
      onFlash(err.message);
    }
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Tasks</h3>

      <form onSubmit={addTask} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}
               style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
               style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }} />
        <button disabled={!title.trim()} style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
          Add task
        </button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                {t.notes ? <div style={{ color: "#6b7280", fontSize: 13 }}>{t.notes}</div> : null}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleDone(t)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                  {t.done ? "Undo" : "Done"}
                </button>
                <button onClick={() => remove(t)} style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "white", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 ? <div style={{ color: "#6b7280", fontSize: 13 }}>No tasks yet.</div> : null}
      </div>
    </div>
  );
}
