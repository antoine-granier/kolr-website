"use client";

import { useLocale } from "next-intl";

export default function SkipToContent() {
  const locale = useLocale();
  const text = locale === "fr" ? "Aller au contenu principal" : "Skip to main content";

  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        top: "-100%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#00f2ff",
        color: "#000",
        padding: "0.75rem 1.5rem",
        borderRadius: "0 0 0.75rem 0.75rem",
        fontWeight: 700,
        fontSize: "0.875rem",
        textDecoration: "none",
        transition: "top 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.top = "0"; }}
      onBlur={(e) => { e.currentTarget.style.top = "-100%"; }}
    >
      {text}
    </a>
  );
}
