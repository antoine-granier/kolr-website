import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

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
      <Analytics />
      {children}
    </>
  );
}
