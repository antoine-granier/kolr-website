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
  const t = messages.toolColor || {};

  const title = t.title || "Color Harmony Explorer";
  const description =
    t.description || "Start with a color and discover harmonies";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/color-extract",
    locale,
    keywords: [
      "color harmony",
      "color wheel",
      "complementary colors",
      "analogous colors",
      "triadic colors",
      "monochromatic palette",
      "color theory",
    ],
  });
}

export default async function ColorExtractToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (<><ToolJsonLd name="Color Harmony Generator" description="Generate harmonious color palettes" path="/tools/color-extract" locale={locale} />{children}</>);
}
