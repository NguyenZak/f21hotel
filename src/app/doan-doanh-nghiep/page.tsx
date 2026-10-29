import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { IconBriefcase, IconRings, IconTicket } from "@/components/Icons";
import { PageHero, SectionHead } from "@/components/ui";
import { formatVnd, priceNotes, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Khách đoàn & doanh nghiệp",
  description: `Khối phòng cưới hỏi, đoàn công tác và ở dài ngày tại ${site.name}, khu biệt thự Hoa Phượng, An Khánh. Giảm tới 15% khi ở dài ngày.`,
  alternates: { canonical: "/doan-doanh-nghiep" },
};

const tiers = [
  {
    icon: IconRings,
    title: "Khối phòng cưới hỏi",
    who: "Cho gia đình ở Vinhomes Thăng Long, Nam An Khánh có họ hàng từ quê lên",
    items: [
      "Giữ nhiều phòng theo ngày cưới cho cả họ hàng",
      "Phòng Đôi 4 người cho người cao tuổi và trẻ nhỏ",
      `Thêm người: phụ thu ${formatVnd(priceNotes.extraPerson)}/người`,
      "Một người đại diện đặt cọc và thanh toán cho cả đoàn",
    ],
  },
  {
    icon: IconBriefcase,
    title: "Công tác dài ngày",
    who: "Cho doanh nghiệp, nhà thầu, đội kỹ thuật làm việc ở phía Tây Hà Nội",
    items: priceNotes.longStay.map((d) => `${d.label}: ${d.discount.toLowerCase()}`),
  },
  {
    icon: IconTicket,
    title: "Đoàn đi sự kiện",
    who: "Cho đội bóng, fan club, đoàn dự hội nghị ở Mỹ Đình",
    items: [
      "Giá theo bảng giá, không tăng ngày diễn",
      "Phòng 2, 3, 4 người, xếp gần nhau",
      "Trả phòng muộn tới 14:00",
      "Gửi chỉ đường và gợi ý di chuyển cho cả đoàn",
    ],
  },
]; // TODO: xác nhận điều kiện từng gói

export default function GroupsPage() {
  return (
    <>
      <PageHero crumb="Khách đoàn" eyebrow="Khách đoàn & doanh nghiệp" title="Nhiều phòng, một đầu mối">
        Từ khối phòng cho họ hàng dự cưới đến đội thi công ở dài ngày. Lấy nhiều phòng, ở càng lâu càng được giảm.
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Gói cho đoàn" title="Chọn đúng gói, F21 lo phần còn lại" />
          <div className="tiers reveal-stagger">
            {tiers.map(({ icon: Icon, title, who, items }) => (
              <article className="tier" key={title}>
                <span style={{ color: "var(--maroon)" }}>
                  <Icon width={30} height={30} />
                </span>
                <h3>{title}</h3>
                <p className="who">{who}</p>
                <ul>
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap form-layout">
          <BookingForm kind="group" />
          <aside className="side-stack">
            <div className="side-card">
              <h3>Vì sao đoàn chọn F21</h3>
              <ul>
                <li>Đường rộng trong khu biệt thự, xe đoàn ra vào dễ</li>
                <li>Cạnh khu dân cư Vinhomes Thăng Long, Nam An Khánh</li>
                <li>Gần Đại lộ Thăng Long, đi Hoà Lạc, Mỹ Đình thuận tiện</li>
                <li>Một đầu mối liên hệ cho cả đoàn</li>
              </ul>
            </div>
            <div className="side-card dark on-dark">
              <h3>Nhà hàng tiệc cưới, ban quản lý khu đô thị</h3>
              <ul>
                <li>Nhận giới thiệu khách, có hoa hồng cho đối tác</li>
                <li>Tờ giới thiệu và bảng giá đoàn gửi tận nơi</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
