import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionEditPage, CollectionListPage } from "@/cms/client/pages/Collection";
import { COLLECTIONS, collectionByPath } from "@/cms/schema";

// Các mục nội dung khai báo trong src/cms/schema.ts: danh sách (hoặc form, với mục cài đặt chung)
export const instant = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ c: c.path }));
}

export default async function Page({ params }: { params: Promise<{ c: string }> }) {
  const { c } = await params;
  const def = collectionByPath(c);
  if (!def) notFound();
  return <Suspense>{def.global ? <CollectionEditPage path={c} /> : <CollectionListPage path={c} />}</Suspense>;
}
