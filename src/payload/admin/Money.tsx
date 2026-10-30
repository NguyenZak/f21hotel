"use client";

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { DefaultCellComponentProps, NumberFieldClientComponent } from "payload";
import { useState } from "react";

// Ô nhập tiền (đồng): gõ số, hiện có dấu chấm ngăn cách và chữ "đ". Giá trị lưu vẫn là số nguyên.

const fmt = (n: number | null | undefined) => (typeof n === "number" ? n.toLocaleString("vi-VN") : "");

export const MoneyField: NumberFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError, disabled } = useField<number | null>({ path });
  // Đang gõ thì giữ nguyên chữ người dùng nhập; rời ô thì hiện lại theo định dạng
  const [draft, setDraft] = useState<string | null>(null);
  const locked = readOnly || disabled || field.admin?.readOnly;

  return (
    <div className={`field-type number f21-money${showError ? " error" : ""}`} style={field.admin?.width ? { flex: `0 1 ${field.admin.width}` } : undefined}>
      <FieldLabel label={field.label} required={field.required} path={path} />
      <div className="field-type__wrap">
        <FieldError path={path} showError={showError} />
        <div className="f21-money__input">
          <input
            id={`field-${path.replace(/\./g, "__")}`}
            inputMode="numeric"
            autoComplete="off"
            disabled={Boolean(locked)}
            value={draft ?? fmt(value)}
            onFocus={() => setDraft(fmt(value))}
            onBlur={() => setDraft(null)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setDraft(digits ? Number(digits).toLocaleString("vi-VN") : "");
              setValue(digits ? Number(digits) : null);
            }}
          />
          <span aria-hidden="true">đ</span>
        </div>
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  );
};

// Cột tiền trong bảng danh sách
export function MoneyCell({ cellData }: DefaultCellComponentProps) {
  return <span className="f21-money-cell">{typeof cellData === "number" ? `${fmt(cellData)}đ` : "—"}</span>;
}
