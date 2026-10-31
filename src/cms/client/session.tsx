"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type CmsUser, type Role } from "./api";

// Người đang đăng nhập, dùng chung cho mọi trang trong /quan-tri
const SessionCtx = createContext<{ user: CmsUser | null; reload: () => void }>({ user: null, reload: () => {} });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    api<{ user: CmsUser }>("me")
      .then((r) => setUser(r.user))
      .catch(() => {});
  }, [n]);
  return <SessionCtx.Provider value={{ user, reload: () => setN((x) => x + 1) }}>{children}</SessionCtx.Provider>;
}

export const useSession = () => useContext(SessionCtx);
export const hasRole = (user: CmsUser | null, ...roles: Role[]) => Boolean(user && roles.includes(user.role));
