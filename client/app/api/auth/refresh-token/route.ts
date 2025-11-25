import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function apiFetcher(url: string, options?: RequestInit) {
  let token = Cookies.get("access_token");

  const headers = {
    ...(options?.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  let res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
    credentials: "include",
  });

  // Nếu bị 401 thì kiểm tra token có hết hạn không
  if (res.status === 401 && token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        console.warn("🔁 Token hết hạn → refresh token...");
        const refreshRes = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.access_token) {
          Cookies.set("access_token", refreshData.access_token, {
            expires: 7,
            path: "/",
          });
          token = refreshData.access_token;
          const retryHeaders = {
            ...(options?.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
          res = await fetch(url, {
            cache: "no-store",
            ...options,
            headers: retryHeaders,
          });
        }
      } else {
        console.warn("❌ 401 nhưng token vẫn còn hạn → không refresh");
      }
    } catch (err) {
      console.error("❌ Lỗi khi decode JWT:", err);
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
