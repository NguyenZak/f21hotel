import type { DashboardConfig } from "payload";

// Widget của bảng điều khiển CMS. Người dùng có thể tự sắp xếp lại (Payload lưu theo từng tài khoản);
// defaultLayout là bố cục ban đầu theo vai trò.
const W = "/payload/admin/dashboard/Widgets";

export const dashboard: Omit<DashboardConfig, "widgets"> & { widgets: NonNullable<DashboardConfig["widgets"]> } = {
  widgets: [
    { slug: "f21-today", label: "Hôm nay", Component: `${W}#TodayWidget`, minWidth: "medium" },
    { slug: "f21-arrivals", label: "Khách đến và đi hôm nay", Component: `${W}#ArrivalsWidget`, minWidth: "small" },
    { slug: "f21-pending", label: "Chờ xác nhận", Component: `${W}#PendingWidget`, minWidth: "small" },
    { slug: "f21-availability", label: "Phòng trống tối nay", Component: `${W}#AvailabilityWidget`, minWidth: "x-small" },
    { slug: "f21-outlook", label: "7 ngày tới & tháng này", Component: `${W}#OutlookWidget`, minWidth: "small" },
    { slug: "f21-activity", label: "Thao tác gần đây", Component: `${W}#ActivityWidget`, minWidth: "small" },
  ],
  defaultLayout: ({ req }) => {
    const role = (req.user as { role?: string } | null)?.role;
    const frontDesk = [
      { widgetSlug: "f21-today", width: "full" },
      { widgetSlug: "f21-pending", width: "medium" },
      { widgetSlug: "f21-arrivals", width: "medium" },
      { widgetSlug: "f21-availability", width: "small" },
    ] as const;
    if (role === "staff") return [...frontDesk];
    return [
      ...frontDesk,
      { widgetSlug: "f21-outlook", width: "medium" },
      { widgetSlug: "f21-activity", width: "small" },
      { widgetSlug: "collections", width: "full" },
    ];
  },
};
