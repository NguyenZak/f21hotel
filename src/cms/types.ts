// Kiểu dữ liệu dùng chung giữa API CMS (src/cms/server) và giao diện (src/cms/client)

export type BookingItem = { roomType: number; roomTypeName?: string; stayType: string; quantity: number; amount: number | null; rooms: number[] };
export type BookingDTO = {
  id: number;
  code: string;
  status: string;
  source: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  phone: string;
  email: string;
  guests: number;
  arrivalTime: string;
  promoCode: string;
  note: string;
  total: number;
  deposit: number;
  paid: number;
  staffNote: string;
  externalRef: string;
  createdAt: string;
  items: BookingItem[];
};

export type RoomTypeMeta = { id: number; name: string; guests: number; prices: { fullDay: number; overnight: number; hourly: number } };
export type RoomMeta = { id: number; number: string; floor: number; roomType: number; active: boolean };
export type Meta = { roomTypes: RoomTypeMeta[]; rooms: RoomMeta[]; depositPercent: number };

export type TodayData = {
  today: string;
  arrivals: BookingDTO[];
  departures: BookingDTO[];
  pending: BookingDTO[];
  pendingCount: number;
  inHouse: number;
  availability: { id: number; name: string; available: number; total: number }[];
  outlook: null | {
    totalRooms: number;
    nights: { night: string; sold: number; rate: number }[];
    revenue: number;
    monthCount: number;
    sources: { source: string; count: number; revenue: number }[];
  };
};
