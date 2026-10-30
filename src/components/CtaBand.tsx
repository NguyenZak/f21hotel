import type { ReactNode } from "react";
import { getSite } from "@/lib/cms";
import { CtaBandView } from "./ui";

// Dải kêu gọi đặt phòng, tự lấy hotline và Zalo từ CMS
export async function CtaBand({ title, children }: { title: ReactNode; children?: ReactNode }) {
  const contact = await getSite();
  return (
    <CtaBandView title={title} contact={contact}>
      {children}
    </CtaBandView>
  );
}
