// 📁 lib/api/habit.ts
import { apiFetcher } from "../fetcher";

export const habitApi = {
  // 🟩 Habit
  getAllHabit: () => apiFetcher("/api/habit", { method: "GET" }),
  getByDate: (date: string) => apiFetcher(`/api/habit?date=${date}`),

  getByIdHabit: (id: string) =>
    apiFetcher(`/api/habit/${id}`, { method: "GET" }),
  createHabit: (data: any) =>
    apiFetcher("/api/habit", { method: "POST", body: JSON.stringify(data) }),
  updateHabit: (id: string, data: any) =>
    apiFetcher(`/api/habit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteHabit: (id: string) =>
    apiFetcher(`/api/habit/${id}`, { method: "DELETE" }),
};

export const categoryApi = {
  getAll: () => apiFetcher("/api/habit/categories", { method: "GET" }),

  getById: (id: string) =>
    apiFetcher(`/api/habit/categories/${id}`, { method: "GET" }),

  create: (data: any) =>
    apiFetcher("/api/habit/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetcher(`/api/habit/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetcher(`/api/habit/categories/${id}`, { method: "DELETE" }),
};

export const tagApi = {
  getAll: () => apiFetcher("/api/habit/tags", { method: "GET" }),

  getById: (id: string) =>
    apiFetcher(`/api/habit/tags/${id}`, { method: "GET" }),

  create: (data: any) =>
    apiFetcher("/api/habit/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetcher(`/api/habit/tags/${id}`, { method: "DELETE" }),
};

// lib/api/habit.ts (thêm sau tagApi)
export const milestoneApi = {
  // 🟦 Milestones theo habit
  getByHabit: (habitId: string) =>
    apiFetcher(`/api/habit/milestones/habits/${habitId}`, { method: "GET" }),

  create: (habitId: string, data: any) =>
    apiFetcher(`/api/habit/milestones/habits/${habitId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🟦 Milestones chi tiết
  getById: (id: string) =>
    apiFetcher(`/api/habit/milestones/${id}`, { method: "GET" }),

  update: (id: string, data: any) =>
    apiFetcher(`/api/habit/milestones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetcher(`/api/habit/milestones/${id}`, { method: "DELETE" }),
};

// lib/api/habit.ts (thêm phần cuối)
export const repeatRuleApi = {
  get: (habitId: string) =>
    apiFetcher(`/api/habit/repeat-rule/${habitId}`, { method: "GET" }),

  create: (habitId: string, data: any) =>
    apiFetcher(`/api/habit/repeat-rule/${habitId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (habitId: string, data: any) =>
    apiFetcher(`/api/habit/repeat-rule/${habitId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (habitId: string) =>
    apiFetcher(`/api/habit/repeat-rule/${habitId}`, { method: "DELETE" }),
};
