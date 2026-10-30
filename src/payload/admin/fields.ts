import type { NumberField } from "payload";
import { hasRole, type Role } from "../access";

// Phần `admin` dùng chung cho trường tiền (đồng): ô nhập có định dạng và cột hiển thị trong danh sách
export const moneyAdmin = {
  components: {
    Field: "/payload/admin/Money#MoneyField",
    Cell: "/payload/admin/Money#MoneyCell",
  },
} satisfies NumberField["admin"];

// Ẩn mục khỏi menu với các vai trò không dùng tới (quyền đọc/ghi vẫn do access quyết định)
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) =>
    !hasRole(...roles)({ req: { user } as never });
