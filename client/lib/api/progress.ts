import { apiFetcher } from "../fetcher";

// ===== TYPES =====
export interface GetHistoryOptions {
  from?: string;
  to?: string;
  limit?: number;
}

export const progressApi = {
  // GRID ACTIONS
  complete: (data: {
    habitId: string;
    date: string;
    progressValue?: number;
    notes?: string;
  }) =>
    apiFetcher("/api/progress/complete", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  skip: (data: { habitId: string; date: string; notes?: string }) =>
    apiFetcher("/api/progress/skip", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  fail: (data: { habitId: string; date: string }) =>
    apiFetcher("/api/progress/fail", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  reset: (data: { habitId: string; date: string }) =>
    apiFetcher("/api/progress/reset", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // GET HABIT GRID
  getHabitGrid: (id: string, from: string, to: string) =>
    apiFetcher(`/api/progress/habit/${id}?from=${from}&to=${to}`),

  // GET OVERVIEW
  getOverview: (from: string, to: string) =>
    apiFetcher(`/api/progress/overview?from=${from}&to=${to}`),

  // SUMMARY
  getSummary: (id: string) => apiFetcher(`/api/progress/habit/${id}/summary`),

  // HISTORY
  getHistory: (id: string, opts: GetHistoryOptions = {}) => {
    const params = new URLSearchParams();

    if (opts.from) params.append("from", opts.from);
    if (opts.to) params.append("to", opts.to);
    if (opts.limit) params.append("limit", opts.limit.toString());

    const query = params.toString();

    return apiFetcher(
      `/api/progress/habit/${id}/history${query ? `?${query}` : ""}`
    );
  },
};
