import React, { useEffect, useState } from "react";
import TaskPanel from "../components/TaskPanel.jsx";
import HabitPanel from "../components/HabitPanel.jsx";
import { api } from "../api";

export default function Dashboard({ onFlash }) {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [busy, setBusy] = useState(true);

  async function refresh() {
    setBusy(true);
    try {
      const [t, h] = await Promise.all([api.listTasks(), api.listHabits()]);
      setTasks(t);
      setHabits(h);
    } catch (err) {
      onFlash(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ color: "#6b7280", fontSize: 13 }}>
        {busy ? "Loading..." : "Ready"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TaskPanel tasks={tasks} setTasks={setTasks} onFlash={onFlash} />
        <HabitPanel habits={habits} setHabits={setHabits} onFlash={onFlash} />
      </div>
    </div>
  );
}
