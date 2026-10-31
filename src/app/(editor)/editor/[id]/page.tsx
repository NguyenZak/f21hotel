import config from "@payload-config";
import type { Data } from "@puckeditor/core";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import type { CSSProperties } from "react";
import { getPayload } from "payload";
import { defaultHome } from "@/blocks/home";
import { getBlockMeta, getThemeFonts } from "@/lib/cms";
import { fontVar } from "../../../(site)/fonts";
import { savePage } from "../actions";
import { Editor } from "./Editor";

// Trang theo người đăng nhập, không prefetch (giống trang quản trị)
export const instant = false;

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(`/editor/${id}`)}`);

  if (user.role !== "owner" && user.role !== "manager")
    return (
      <div className="editor-denied">
        <h1>Không có quyền</h1>
        <p>Chỉ Chủ và Quản lý được sửa giao diện trang. <Link href="/admin">Quay lại CMS</Link></p>
      </div>
    );

  const page = await payload
    .findByID({ collection: "pages", id: Number(id), depth: 0, user, overrideAccess: false })
    .catch(() => null);
  if (!page) notFound();

  const [metadata, fonts] = await Promise.all([getBlockMeta(), getThemeFonts()]);
  const empty: Data = { root: { props: { title: page.title } }, content: [], zones: {} };
  const published = (page.data as Data | null) ?? null;
  const data = (page.draft as Data | null) ?? published ?? (page.slug === "home" ? defaultHome : empty);

  // Font theo Cài đặt › Giao diện, gắn vào khung xem trước
  const fontRoles = {
    "--font-role-heading": fontVar(fonts.heading),
    "--font-role-hero": fontVar(fonts.hero),
    "--font-role-body": fontVar(fonts.body),
    "--font-role-ui": fontVar(fonts.ui),
  } as CSSProperties;

  return (
    <Editor
      save={savePage}
      id={page.id}
      title={page.title}
      path={page.slug === "home" ? "/" : `/${page.slug}`}
      data={data}
      metadata={metadata}
      fontRoles={fontRoles as Record<string, string>}
      hasDraft={Boolean(page.draft)}
      publishedAt={page.publishedAt ?? null}
    />
  );
}
