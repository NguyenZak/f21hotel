"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import type { ReportData } from "../../server/reports";
import { api, ApiError } from "../api";
import { dayLabel, money, monthLabel, pct, sourceLabel } from "../booking";
import { Icon, type IconName } from "../icons";
import { hasRole, useSession } from "../session";

// Biểu đồ (recharts, ~100 KB) tải riêng, chỉ khi mở trang này; cả bốn nằm chung một gói.
// Mỗi dynamic() viết riêng để Next.js nhận ra ssr: false và không đưa recharts vào gói chạy trên server.
const ChartSkeleton = () => <div className="c-skel c-report__chart" />;
const RevenueChart = dynamic(() => import("../ReportCharts").then((m) => m.RevenueChart), { ssr: false, loading: ChartSkeleton });
const OccupancyChart = dynamic(() => import("../ReportCharts").then((m) => m.OccupancyChart), { ssr: false, loading: ChartSkeleton });
const SourcesChart = dynamic(() => import("../ReportCharts").then((m) => m.SourcesChart), { ssr: false, loading: ChartSkeleton });
const RoomTypesChart = dynamic(() => import("../ReportCharts").then((m) => m.RoomTypesChart), { ssr: false, loading: ChartSkeleton });

function Kpi({ icon, label, value, note }: { icon: IconName; label: string; value: string; note: string }) {
  return (
    <div className="c-kpi c-kpi--static">
      <span className="c-kpi__icon">
        <Icon name={icon} size={20} />
      </span>
      <span className="c-kpi__label">{label}</span>
      <strong className="c-kpi__value">{value}</strong>
      <span className="c-kpi__note">{note}</span>
    </div>
  );
}

// Mỗi biểu đồ có bảng số liệu đi kèm (đọc được bằng trình đọc màn hình, chép sang Excel)
function Panel({ title, icon, note, chart, head, rows }: { title: string; icon: IconName; note?: string; chart: ReactNode; head: string[]; rows: (string | number)[][] }) {
  return (
    <section className="c-panel c-report">
      <header className="c-panel__head">
        <h2>
          <Icon name={icon} /> {title}
        </h2>
        {note ? <span className="c-muted" style={{ fontSize: 13 }}>{note}</span> : null}
      </header>
      {chart}
      <details className="c-report__table">
        <summary>Xem bảng số liệu</summary>
        <div className="c-table-wrap">
          <table className="c-table">
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, k) => (
                    <td key={k}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

export function ReportsPage() {
  const { user } = useSession();
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api<ReportData>("reports")
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Không tải được báo cáo."));
  }, []);
  if (user && !hasRole(user, "owner", "manager")) return <p className="c-alert c-alert--info">Tài khoản của bạn không có quyền xem báo cáo.</p>;

  const head = (
    <div className="c-page__head">
      <div>
        <h1>Báo cáo</h1>
        <p>12 tháng gần nhất, tính theo ngày nhận phòng. Không tính đơn đã huỷ và khách không đến.</p>
      </div>
    </div>
  );
  if (error)
    return (
      <>
        {head}
        <p className="c-alert c-alert--error">{error}</p>
      </>
    );
  if (!data)
    return (
      <>
        {head}
        <div className="c-kpis">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="c-skel" style={{ height: 132 }} />
          ))}
        </div>
      </>
    );

  const revenue = data.months.reduce((a, m) => a + m.revenue, 0);
  const bookings = data.months.reduce((a, m) => a + m.bookings, 0);
  const lost = data.months.reduce((a, m) => a + m.lost, 0);
  const roomNights = data.months.reduce((a, m) => a + m.roomNights, 0);
  const past30 = data.occupancy.filter((o) => o.day < data.today).slice(-30);
  const occ30 = past30.length ? past30.reduce((a, o) => a + o.rate, 0) / past30.length : 0;

  return (
    <>
      {head}
      <div className="c-kpis">
        <Kpi icon="trend" label="Doanh thu 12 tháng" value={money(revenue)} note={`Tháng này ${money(data.months.at(-1)?.revenue ?? 0)}`} />
        <Kpi icon="bookings" label="Số đơn" value={bookings.toLocaleString("vi-VN")} note={`Huỷ / không đến: ${lost} (${pct(lost / Math.max(1, bookings + lost))})`} />
        <Kpi icon="rates" label="Giá TB mỗi đêm phòng" value={money(roomNights ? Math.round(revenue / roomNights) : 0)} note={`${roomNights.toLocaleString("vi-VN")} đêm phòng đã bán`} />
        <Kpi icon="rooms" label="Công suất 30 ngày qua" value={pct(occ30)} note={`${data.totalRooms} phòng đang bán`} />
      </div>

      <div className="c-reports">
            <Panel
              title="Doanh thu theo tháng"
              icon="trend"
              chart={<RevenueChart months={data.months} />}
              head={["Tháng", "Doanh thu", "Số đơn", "Đêm phòng", "Huỷ / không đến"]}
              rows={data.months.map((m) => [monthLabel(m.month), money(m.revenue), m.bookings, m.roomNights, m.lost])}
            />
            <Panel
              title="Công suất phòng"
              icon="rooms"
              note="60 ngày qua và 30 ngày tới"
              chart={<OccupancyChart occupancy={data.occupancy} today={data.today} totalRooms={data.totalRooms} />}
              head={["Đêm", "Phòng đã bán", "Công suất"]}
              rows={data.occupancy.map((o) => [dayLabel(o.day), `${o.sold}/${data.totalRooms}`, pct(o.rate)])}
            />
            <Panel
              title="Kênh đặt phòng"
              icon="inbox"
              chart={<SourcesChart sources={data.sources} />}
              head={["Kênh", "Số đơn", "Doanh thu"]}
              rows={data.sources.map((s) => [sourceLabel(s.source), s.bookings, money(s.revenue)])}
            />
            <Panel
              title="Đêm phòng theo hạng phòng"
              icon="roomTypes"
              chart={<RoomTypesChart roomTypes={data.roomTypes} />}
              head={["Hạng phòng", "Đêm phòng", "Doanh thu"]}
              rows={data.roomTypes.map((r) => [r.name, r.roomNights, money(r.revenue)])}
            />
      </div>
    </>
  );
}
