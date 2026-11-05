import Image from "next/image";
import type { Place } from "@/lib/site";
import { IconBag, IconClock, IconFood, IconSport, IconTicket } from "./Icons";

// Lưới ảnh Tiện ích xung quanh (CMS › Tiện ích xung quanh): địa điểm đầu tiên ô lớn, các ô sau nhỏ hơn.
// Bấm ô mở Google Maps. Địa điểm chưa có ảnh hiện ô màu theo nhóm kèm biểu tượng.
// Dùng ở trang Vị trí và khối "Xung quanh F21" của trình dựng trang (chạy cả trên trình duyệt), nên không đọc dữ liệu ở đây.
const ICON = { "vui-choi": IconTicket, "an-uong": IconFood, "the-thao": IconSport, "dich-vu": IconBag } as Record<string, typeof IconTicket>;

export function PlaceMosaic({ places }: { places: Place[] }) {
  // Ảnh lên trước để ô lớn luôn có ảnh nếu nhóm có ít nhất một ảnh
  const list = [...places].sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));
  return (
    <ul className={`places places--${Math.min(list.length, 5)} reveal-stagger`}>
      {list.map((p, i) => {
        const Icon = ICON[p.category] ?? IconTicket;
        return (
          <li key={`${p.name}-${i}`} className={`place place--${p.category}${p.photo ? "" : " place--text"}`}>
            <a href={p.href} target="_blank" rel="noopener" aria-label={`${p.name}: xem trên Google Maps`}>
              {p.photo ? (
                <Image
                  src={p.photo.src}
                  alt={p.photo.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"}
                />
              ) : (
                <Icon className="place-icon" />
              )}
              <span className="place-body">
                <b>{p.name}</b>
                {p.note ? <small>{p.note}</small> : null}
                {p.time ? (
                  <span className="place-time">
                    <IconClock /> {p.time}
                  </span>
                ) : null}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
