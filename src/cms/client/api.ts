"use client";

// Gọi API CMS (/api/cms/*) từ trình duyệt. Hết phiên đăng nhập thì chuyển về trang đăng nhập.
export type Role = "owner" | "manager" | "staff";
export type CmsUser = { id: number; name: string; email: string; role: Role; active: boolean };

export const ROLE_LABELS: Record<Role, string> = { owner: "Chủ", manager: "Quản lý", staff: "Nhân viên" };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const LOGIN_PATH = "/quan-tri/dang-nhap";

export async function api<T = Record<string, unknown>>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/cms/${path}`, {
      method: init.method ?? (init.body ? "POST" : "GET"),
      headers: init.body ? { "content-type": "application/json" } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (res.status === 401 && !path.startsWith("login")) {
    const next = encodeURIComponent(location.pathname + location.search);
    // Hết phiên: tải lại hẳn trang đăng nhập (xoá dữ liệu cũ trong bộ nhớ)
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    location.href = `${LOGIN_PATH}?next=${next}`;
  }
  if (!res.ok || data.ok === false) throw new ApiError(data.error ?? "Có lỗi, vui lòng thử lại.", res.status);
  return data as T;
}
