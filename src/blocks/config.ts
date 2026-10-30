import type { Config } from "@puckeditor/core";
import * as B from "./render";

// Bản cấu hình chỉ để hiển thị trang (dùng với <Render> trên server).
// Trình dựng dùng editor-config.tsx: cùng các khối này, thêm trường chỉnh sửa và giá trị mặc định.
export const blockRenders = {
  Hero: B.HeroBlock,
  Intro: B.IntroBlock,
  Rooms: B.RoomsBlock,
  Perks: B.PerksBlock,
  Gallery: B.GalleryBlock,
  Guests: B.GuestsBlock,
  Location: B.LocationBlock,
  Offers: B.OffersBlock,
  Reviews: B.ReviewsBlock,
  Faq: B.FaqBlock,
  Cta: B.CtaBlock,
  Section: B.SectionBlock,
  Columns: B.ColumnsBlock,
  Heading: B.HeadingBlock,
  Text: B.TextBlock,
  Image: B.ImageBlock,
  Button: B.ButtonBlock,
  Spacer: B.SpacerBlock,
} as const;

export type BlockName = keyof typeof blockRenders;

// Các khối có ô thả khối con: Puck cần khai báo trường slot cả khi chỉ hiển thị
const slotFields: Partial<Record<BlockName, Record<string, { type: "slot" }>>> = {
  Section: { content: { type: "slot" } },
  Columns: { left: { type: "slot" }, right: { type: "slot" } },
};

export const renderConfig = {
  root: { render: B.RootBlock },
  components: Object.fromEntries(
    Object.entries(blockRenders).map(([name, render]) => [
      name,
      { render, ...(slotFields[name as BlockName] ? { fields: slotFields[name as BlockName] } : {}) },
    ]),
  ),
} as unknown as Config;
