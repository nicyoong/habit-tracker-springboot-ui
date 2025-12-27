import React, { useState } from "react";
import { api } from "../api";

export default function TaskPanel({ tasks, setTasks, onFlash }) {
  const [title, setTitle] = useState("");

  async function addTask(e) {
    e.preventDefault();
    try {
      const created = await api.createTask(title, null);
      setTasks([created, ...tasks]);
      setTitle("");
    } catch (err) { onFlash(err.message); }
  }

  return (
    <div className="card">
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1.25rem" }}>Tasks</h3>
      
      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input placeholder="Add a new task..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn btn-primary" disabled={!title.trim()}>Add</button>
      </form>

      <div className="animate-list" style={{ display: "grid", gap: 8 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 10, background: t.done ? "var(--bg)" : "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="checkbox" checked={t.done} onChange={() => api.updateTask(t.id, { done: !t.done }).then(u => setTasks(tasks.map(x => x.id === t.id ? u : x)))} 
                     style={{ width: 18, height: 18, cursor: "pointer" }} />
              <span style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--text-muted)" : "var(--text-main)", fontWeight: 500 }}>
                {t.title}
              </span>
            </div>
            <button className="btn btn-ghost" onClick={() => api.deleteTask(t.id).then(() => setTasks(tasks.filter(x => x.id !== t.id)))} style={{ color: "var(--danger)", padding: 6 }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
