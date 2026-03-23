"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const EXCLUDED_ROUTES = [
  "/share",
  "/contact",
  "/privacy",
  "/terms",
  "/color/",
];

export default function AdSenseScript() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_ROUTES.some((route) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
    return pathWithoutLocale.startsWith(route);
  });

  if (isExcluded) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1962397436964429"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
