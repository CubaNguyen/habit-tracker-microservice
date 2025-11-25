import Cookies from "js-cookie";

/**
 * apiFetcher - phiên bản clean nhất:
 * ✅ Backend trả JSON → Client nhận đúng JSON đó
 * ✅ Không thêm gì: không wrapper, không status, không success
 * ✅ Tự động gắn Authorization token từ cookie
 */
export async function apiFetcher(url: string, options?: RequestInit) {
  const token = Cookies.get("access_token");

  const headers = {
    ...(options?.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    ...options,
    headers,
  });

  // ❌ Nếu backend trả lỗi (nhưng vẫn là JSON), mình vẫn đọc JSON đó
  const data = await res.json();

  return data; // ✅ Trả nguyên JSON backend trả về
}
