import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}) {
  const { locale, name } = await params;
  const displayName = name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return generatePageMetadata({
    title: `${displayName} - Color Info`,
    description: `Everything about ${displayName}: hex code, conversions, palettes, shades & tints.`,
    path: `/color/name/${name}`,
    locale,
    keywords: [displayName, "color", "hex", "palette", name],
  });
}

export default function ColorNameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
