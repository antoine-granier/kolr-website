import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolCompare || {};

  const title = t.title || "Compare Palettes";
  const description =
    t.description || "Compare two color palettes side by side";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/palette-compare",
    locale,
    keywords: [
      "compare palettes",
      "color comparison",
      "palette diff",
      "side by side colors",
    ],
  });
}

export default async function PaletteCompareLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (<><ToolJsonLd name="Compare Palettes" description="Compare two color palettes side by side" path="/tools/palette-compare" locale={locale} />{children}</>);
}
