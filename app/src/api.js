import { getToken, clearToken } from "./auth";

const BASE_URL = "http://localhost:8080/api";

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    let payload = null;
    try { payload = await res.json(); } catch {}
    const msg = payload?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  register: (username, password) => request("/auth/register", { method: "POST", body: { username, password } }),
  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),

  listTasks: () => request("/tasks"),
  createTask: (title, notes) => request("/tasks", { method: "POST", body: { title, notes } }),
  updateTask: (id, patch) => request(`/tasks/${id}`, { method: "PATCH", body: patch }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),

  listHabits: () => request("/habits"),
  createHabit: (name, description) => request("/habits", { method: "POST", body: { name, description } }),
  updateHabit: (id, patch) => request(`/habits/${id}`, { method: "PATCH", body: patch }),
  deleteHabit: (id) => request(`/habits/${id}`, { method: "DELETE" }),

  checkInHabit: (id, date) => request(`/habits/${id}/checkins`, { method: "POST", body: { date } }),
  undoCheckIn: (id, date) => request(`/habits/${id}/checkins/${date}`, { method: "DELETE" })
};
