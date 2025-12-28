import React, { useState } from "react";
import { api } from "../api";
import { CheckCircle2, Circle, Trash2, Plus, ListTodo } from "lucide-react";

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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <ListTodo size={20} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Tasks</h3>
      </div>
      
      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input placeholder="Add a new task..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn btn-primary" disabled={!title.trim()} style={{ width: 45, padding: 0 }}>
          <Plus size={20} />
        </button>
      </form>

      <div className="animate-list" style={{ display: "grid", gap: 8 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 10, background: t.done ? "#f8fafc" : "white", transition: "all 0.2s" }}>
            <div 
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}
              onClick={() => api.updateTask(t.id, { done: !t.done }).then(u => setTasks(tasks.map(x => x.id === t.id ? u : x)))}
            >
              {t.done ? 
                <CheckCircle2 size={20} color="var(--success)" /> : 
                <Circle size={20} color="var(--border)" />
              }
              <span style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--text-muted)" : "var(--text-main)", fontWeight: 500 }}>
                {t.title}
              </span>
            </div>
            <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); api.deleteTask(t.id).then(() => setTasks(tasks.filter(x => x.id !== t.id))); }} style={{ color: "#94a3b8", padding: 6 }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: 14 }}>No tasks for today!</div>}
      </div>
    </div>
  );
}
