import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

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

export default function ColorExtractToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
