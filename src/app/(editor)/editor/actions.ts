"use server";

import config from "@payload-config";
import type { Data } from "@puckeditor/core";
import { headers } from "next/headers";
import { getPayload } from "payload";

export type SaveResult = { ok: true; publishedAt?: string } | { ok: false; error: string };

// Lưu bố cục từ trình dựng. Quyền sửa kiểm tra theo người đang đăng nhập CMS
// (collection Trang: Chủ và Quản lý). Xuất bản: chép bản nháp sang bản đang hiện trên website.
export async function savePage(id: number, data: Data, publish: boolean): Promise<SaveResult> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) return { ok: false, error: "Phiên đăng nhập đã hết. Mở CMS đăng nhập lại rồi lưu." };
  try {
    const publishedAt = publish ? new Date().toISOString() : undefined;
    await payload.update({
      collection: "pages",
      id,
      data: publish ? { data, draft: null, publishedAt } : { draft: data },
      user,
      overrideAccess: false,
    });
    return { ok: true, publishedAt };
  } catch (e) {
    const forbidden = e instanceof Error && e.name === "Forbidden";
    return { ok: false, error: forbidden ? "Tài khoản của bạn không có quyền sửa trang." : "Không lưu được, thử lại sau." };
  }
}
