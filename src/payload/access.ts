import type { Access, FieldAccess, PayloadRequest } from "payload";

// Ba vai trò trong CMS, theo bảng phân quyền đã thống nhất với khách sạn
export const ROLES = [
  { label: "Chủ", value: "owner" },
  { label: "Quản lý", value: "manager" },
  { label: "Nhân viên", value: "staff" },
] as const;

export type Role = (typeof ROLES)[number]["value"];

type WithRole = { role?: Role | null; active?: boolean | null };

const roleOf = (req: PayloadRequest): Role | null => {
  const user = req.user as WithRole | null;
  if (!user || user.active === false) return null;
  return user.role ?? null;
};

export const hasRole =
  (...roles: Role[]) =>
  ({ req }: { req: PayloadRequest }) => {
    const role = roleOf(req);
    return role !== null && roles.includes(role);
  };

// Chủ: toàn quyền, kể cả tài khoản nhân viên và cài đặt kết nối
export const isOwner: Access = hasRole("owner");
// Chủ và quản lý: nội dung website, giá phòng, ưu đãi, báo cáo
export const isManager: Access = hasRole("owner", "manager");
// Mọi tài khoản đang hoạt động: xem và xử lý booking (giai đoạn 2)
export const isStaff: Access = hasRole("owner", "manager", "staff");

export const anyone: Access = () => true;

// Người dùng tự xem/sửa hồ sơ của mình; chủ xem/sửa được mọi tài khoản
export const ownerOrSelf: Access = ({ req }) => {
  if (roleOf(req) === "owner") return true;
  return req.user ? { id: { equals: req.user.id } } : false;
};

// Chỉ chủ mới đổi được vai trò và trạng thái tài khoản
export const ownerOnlyField: FieldAccess = ({ req }) => roleOf(req) === "owner";
