import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Share Palette",
    description: "Share your color palettes with anyone via a simple link. Preview colors, copy hex codes, and export in multiple formats.",
    path: "/share",
    locale,
    keywords: ["share palette", "color palette link", "share colors"],
  });
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
