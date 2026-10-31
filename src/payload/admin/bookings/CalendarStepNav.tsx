"use client";

import { useStepNav } from "@payloadcms/ui";
import { useEffect } from "react";

// Breadcrumb "Lịch phòng" trên header CMS (trang tự viết không tự có)
export function CalendarStepNav() {
  const { setStepNav } = useStepNav();
  useEffect(() => setStepNav([{ label: "Lịch phòng" }]), [setStepNav]);
  return null;
}
