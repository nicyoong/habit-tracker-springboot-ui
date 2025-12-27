import React, { useEffect, useState } from "react";
import TaskPanel from "../components/TaskPanel.jsx";
import HabitPanel from "../components/HabitPanel.jsx";
import { api } from "../api";

export default function Dashboard({ onFlash }) {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listTasks(), api.listHabits()])
      .then(([t, h]) => { setTasks(t); setHabits(h); })
      .catch(err => onFlash(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Your Overview</h2>
        <div style={{ fontSize: 13, color: "var(--text-muted)", background: "#e2e8f0", padding: "4px 12px", borderRadius: 20 }}>
          {loading ? "Syncing..." : "Updated Just Now"}
        </div>
      </div>
      
      <div className="dashboard-grid">
        <TaskPanel tasks={tasks} setTasks={setTasks} onFlash={onFlash} />
        <HabitPanel habits={habits} setHabits={setHabits} onFlash={onFlash} />
      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
