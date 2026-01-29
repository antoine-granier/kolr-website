import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Kolr - Create palettes from your photos",
  description:
    "The ultimate color picker and palette generator for designers and developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1962397436964429"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
