import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionEditPage } from "@/cms/client/pages/Collection";
import { COLLECTIONS, collectionByPath } from "@/cms/schema";

// Thêm/sửa một mục (?id=<id>, không có id là thêm mới)
export const instant = false;

export function generateStaticParams() {
  return COLLECTIONS.filter((c) => !c.global).map((c) => ({ c: c.path }));
}

export default async function Page({ params }: { params: Promise<{ c: string }> }) {
  const { c } = await params;
  if (!collectionByPath(c) || collectionByPath(c)?.global) notFound();
  return (
    <Suspense>
      <CollectionEditPage path={c} />
    </Suspense>
  );
}
