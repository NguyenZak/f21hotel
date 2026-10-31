// Địa điểm trên bản đồ 3D ở trang chủ (khối Vị trí).
// Toạ độ lấy từ OpenStreetMap (10/2026). Vị trí F21 ước theo mô tả "cạnh Vinschool, đường vào cổng 1
// Vinhomes Thăng Long", đủ cho sơ đồ minh hoạ; chỉ đường thật vẫn dùng Google Maps.

export type MapKind = "school" | "park" | "stadium" | "hall" | "lake";

export type MapPlace = {
  key: string;
  /** Tên hiện trên nhãn */
  short: string;
  /** Tên gọn cho màn hình điện thoại */
  tiny: string;
  /** Từ khoá để lấy thời gian từ danh sách "Khoảng cách" của khối Vị trí trong CMS */
  match: string;
  /** Thời gian dùng khi CMS không có dòng khớp */
  time: string;
  lat: number;
  lng: number;
  kind: MapKind;
};

export const MAP_HOTEL = { lat: 21.0033, lng: 105.7178 };

export const MAP_PLACES: MapPlace[] = [
  { key: "vinschool", short: "Vinschool", tiny: "Vinschool", match: "Vinschool", time: "1–2 phút", lat: 21.0024, lng: 105.717, kind: "school" },
  { key: "baoson", short: "Thiên đường Bảo Sơn", tiny: "Bảo Sơn", match: "Bảo Sơn", time: "~5 phút", lat: 21.0052, lng: 105.733, kind: "park" },
  { key: "mydinh", short: "SVĐ Mỹ Đình", tiny: "Mỹ Đình", match: "Mỹ Đình", time: "15–20 phút", lat: 21.0205, lng: 105.7639, kind: "stadium" },
  { key: "ncc", short: "TT Hội nghị Quốc gia", tiny: "TT Hội nghị", match: "Hội nghị", time: "~15 phút", lat: 21.0065, lng: 105.787, kind: "hall" },
  { key: "hoankiem", short: "Phố cổ Hoàn Kiếm", tiny: "Hoàn Kiếm", match: "Hoàn Kiếm", time: "~35 phút", lat: 21.0288, lng: 105.8525, kind: "lake" },
];

// Đại lộ Thăng Long từ phía Hoà Lạc (tây) tới Trung tâm Hội nghị Quốc gia (đông)
export const MAP_ROAD = {
  short: "Đại lộ Thăng Long",
  match: "Đại lộ",
  time: "~5 phút",
  points: [
    [21.0135, 105.68],
    [21.0118, 105.705],
    [21.011, 105.7268],
    [21.0099, 105.7383],
    [21.0088, 105.755],
    [21.0076, 105.772],
    [21.0058, 105.79],
  ] as [number, number][],
};

/** Gắn thời gian từ danh sách "Khoảng cách" (CMS) vào từng địa điểm, theo từ khoá */
export function withTimes<T extends { match: string; time: string }>(items: T[], distances: { place: string; time: string }[]) {
  return items.map((item) => {
    const found = distances.find((d) => d.place?.toLowerCase().includes(item.match.toLowerCase()));
    return { ...item, time: found?.time || item.time };
  });
}
