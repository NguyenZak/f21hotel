import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
  PayloadRequest,
} from "payload";

// Ghi nhật ký mọi thao tác thêm, sửa, xoá: ai, lúc nào, ở đâu.
// Bảng audit-logs chỉ được ghi qua các hook này, giao diện quản trị chỉ xem.

type Action = "create" | "update" | "delete";

async function log(
  req: PayloadRequest,
  action: Action,
  target: string,
  docId: string | number | undefined,
  title: string | undefined,
) {
  // Thao tác của script nạp dữ liệu (không có người dùng) không ghi nhật ký
  if (!req.user) return;
  await req.payload.create({
    collection: "audit-logs",
    data: {
      user: req.user.id,
      action,
      target,
      docId: docId === undefined ? undefined : String(docId),
      title,
    },
    overrideAccess: true,
    req,
  });
}

const titleOf = (doc: Record<string, unknown>, useAsTitle?: string) => {
  const v = useAsTitle ? doc[useAsTitle] : undefined;
  return typeof v === "string" ? v : undefined;
};

export function withAudit(collection: CollectionConfig): CollectionConfig {
  const useAsTitle = collection.admin?.useAsTitle;
  const afterChange: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
    await log(req, operation, collection.slug, doc.id, titleOf(doc, useAsTitle));
    return doc;
  };
  const afterDelete: CollectionAfterDeleteHook = async ({ doc, id, req }) => {
    await log(req, "delete", collection.slug, id, titleOf(doc, useAsTitle));
  };
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
    },
  };
}

export function withAuditGlobal(global: GlobalConfig): GlobalConfig {
  const afterChange: GlobalAfterChangeHook = async ({ doc, req }) => {
    await log(req, "update", `global:${global.slug}`, undefined, typeof global.label === "string" ? global.label : global.slug);
    return doc;
  };
  return {
    ...global,
    hooks: { ...global.hooks, afterChange: [...(global.hooks?.afterChange ?? []), afterChange] },
  };
}
