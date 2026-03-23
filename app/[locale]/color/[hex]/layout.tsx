import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hex: string }>;
}) {
  const { locale, hex } = await params;
  const color = `#${hex.toUpperCase()}`;

  return generatePageMetadata({
    title: `${color} - Color Info`,
    description: `Everything about ${color}: conversions, palettes, shades & tints. HEX, RGB, HSL, OKLCH, CMYK.`,
    path: `/color/${hex}`,
    locale,
    keywords: [
      hex,
      color,
      "color info",
      "hex to rgb",
      "color converter",
      "color palette",
      "shades and tints",
    ],
  });
}

export default function ColorPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
