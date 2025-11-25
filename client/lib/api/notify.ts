// 📁 lib/api/notify.ts
import { apiFetcher } from "../fetcher";

export const notifyApi = {
  testRabbit: () =>
    apiFetcher("/notify/test-rabbit", {
      method: "POST",
    }),
};
