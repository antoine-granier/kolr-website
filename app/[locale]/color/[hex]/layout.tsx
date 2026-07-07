import { generatePageMetadata } from "@/lib/metadata";

// A color's info is pure math and never changes, so cache each rendered page
// for a year: repeat visits are served from the CDN with zero function
// invocations. A redeploy purges the cache if the template ever changes.
export const revalidate = 31536000; // 1 year

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
