"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Server } from "lucide-react";

// Small, honest reassurance about what happens to the data a tool ingests.
// "local"  → processing happens entirely in the browser (uploads, audio, iframes).
// "server" → the input is sent to our API (only the URL extractor does this).
export default function ToolPrivacyNote({
  variant = "local",
}: {
  variant?: "local" | "server";
}) {
  const t = useTranslations("common");
  const Icon = variant === "local" ? ShieldCheck : Server;
  return (
    <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full border border-kolr-green/20 bg-kolr-green/5 text-xs font-medium text-kolr-text-muted">
      <Icon size={14} className="text-kolr-green shrink-0" />
      <span>{t(variant === "local" ? "noteLocal" : "noteServer")}</span>
    </div>
  );
}
