"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReportData } from "../server/reports";
import { dayLabel, money, monthLabel, pct, sourceLabel } from "./booking";

// Biểu đồ trang Báo cáo (recharts). Một màu (--c-chart) cho mỗi biểu đồ vì chỉ có một chuỗi số liệu;
// màu, lưới, chữ trục lấy từ CSS (cms.css › Báo cáo) nên tự đổi theo giao diện sáng/tối.
// Một trục tung cho mỗi biểu đồ; số phụ (số đơn, đêm phòng) hiện trong ô gợi ý khi rê chuột.
// Cột ngang ghi số ở đầu cột; cột doanh thu theo tháng xem số bằng ô gợi ý hoặc bảng số liệu.

const short = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ` : n >= 1e6 ? `${(n / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tr` : n.toLocaleString("vi-VN");

type TipRow = { label: string; value: string };
// Ô gợi ý dùng chung: tiêu đề + các dòng số
function Tip({ active, title, rows }: { active?: boolean; title?: string; rows: TipRow[] }) {
  if (!active || !title) return null;
  return (
    <div className="c-rc-tip">
      <b>{title}</b>
      {rows.map((r) => (
        <span key={r.label}>
          {r.label}: <b>{r.value}</b>
        </span>
      ))}
    </div>
  );
}

const axis = { tickLine: false, axisLine: false, fontSize: 12 } as const;
const grid = <CartesianGrid vertical={false} strokeDasharray="0" />;
const cursor = { className: "c-rc-cursor" };

type Month = ReportData["months"][number];
export function RevenueChart({ months }: { months: Month[] }) {
  return (
    <div className="c-rc c-report__chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} margin={{ top: 22, right: 4, bottom: 0, left: 0 }} barCategoryGap="28%">
          {grid}
          <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
          <YAxis tickFormatter={short} width={52} {...axis} />
          <Tooltip
            cursor={cursor}
            content={({ active, payload }) => {
              const m = payload?.[0]?.payload as Month | undefined;
              return (
                <Tip
                  active={active}
                  title={m && `Tháng ${Number(m.month.slice(5))}/${m.month.slice(0, 4)}`}
                  rows={m ? [{ label: "Doanh thu", value: money(m.revenue) }, { label: "Số đơn", value: String(m.bookings) }, { label: "Đêm phòng", value: String(m.roomNights) }, { label: "Huỷ / không đến", value: String(m.lost) }] : []}
                />
              );
            }}
          />
          <Bar dataKey="revenue" name="Doanh thu" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type Night = ReportData["occupancy"][number];
export function OccupancyChart({ occupancy, today, totalRooms }: { occupancy: Night[]; today: string; totalRooms: number }) {
  return (
    <div className="c-rc c-report__chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={occupancy.map((o) => ({ ...o, pct: Math.round(o.rate * 100) }))} margin={{ top: 22, right: 8, bottom: 0, left: 0 }}>
          {grid}
          <XAxis dataKey="day" tickFormatter={(d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`} interval="preserveStartEnd" minTickGap={28} {...axis} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v: number) => `${v}%`} width={44} {...axis} />
          <Tooltip
            cursor={{ className: "c-rc-crosshair" }}
            content={({ active, payload }) => {
              const o = payload?.[0]?.payload as Night | undefined;
              return <Tip active={active} title={o && `Đêm ${dayLabel(o.day)}`} rows={o ? [{ label: "Công suất", value: pct(o.rate) }, { label: "Phòng đã bán", value: `${o.sold}/${totalRooms}` }] : []} />;
            }}
          />
          <ReferenceLine x={today} className="c-rc-today" label={{ value: "Hôm nay", position: "top", className: "c-rc-label" }} />
          <Area dataKey="pct" name="Công suất" type="monotone" strokeWidth={2} activeDot={{ r: 4 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Cột ngang cho dữ liệu theo nhóm (kênh, hạng phòng): tên đọc được trọn vẹn, so sánh độ dài dễ hơn biểu đồ tròn
function HBar<T extends object>({ data, label, value, tip, valueText }: { data: T[]; label: (d: T) => string; value: (d: T) => number; tip: (d: T) => TipRow[]; valueText: (d: T) => string }) {
  const rows = data.map((d) => ({ ...d, _label: label(d), _value: value(d) }));
  return (
    <div className="c-rc" style={{ height: Math.max(120, rows.length * 38 + 16) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 64, bottom: 4, left: 0 }} barCategoryGap="30%">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="_label" width={150} {...axis} />
          <Tooltip
            cursor={cursor}
            content={({ active, payload }) => {
              const d = payload?.[0]?.payload as (T & { _label: string }) | undefined;
              return <Tip active={active} title={d?._label} rows={d ? tip(d) : []} />;
            }}
          />
          <Bar dataKey="_value" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
            <LabelList
              content={(p) => (
                <text x={Number(p.x) + Number(p.width) + 6} y={Number(p.y) + Number(p.height) / 2} dominantBaseline="central" className="c-rc-label">
                  {valueText(rows[Number(p.index)])}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SourcesChart({ sources }: { sources: ReportData["sources"] }) {
  if (!sources.length) return <p className="c-empty">Chưa có đơn nào trong 12 tháng.</p>;
  return (
    <HBar
      data={sources}
      label={(s) => sourceLabel(s.source)}
      value={(s) => s.bookings}
      valueText={(s) => `${s.bookings} đơn`}
      tip={(s) => [
        { label: "Số đơn", value: String(s.bookings) },
        { label: "Doanh thu", value: money(s.revenue) },
      ]}
    />
  );
}

export function RoomTypesChart({ roomTypes }: { roomTypes: ReportData["roomTypes"] }) {
  if (!roomTypes.length) return <p className="c-empty">Chưa có đêm phòng nào trong 12 tháng.</p>;
  return (
    <HBar
      data={roomTypes}
      label={(r) => r.name}
      value={(r) => r.roomNights}
      valueText={(r) => `${r.roomNights} đêm`}
      tip={(r) => [
        { label: "Đêm phòng", value: String(r.roomNights) },
        { label: "Doanh thu", value: money(r.revenue) },
      ]}
    />
  );
}
