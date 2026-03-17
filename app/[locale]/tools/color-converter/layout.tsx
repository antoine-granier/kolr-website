import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolColorConverter || {};

  const title = t.title || "Color Converter";
  const description =
    t.description || "Convert colors between HEX, RGB, HSL, OKLCH, CMYK";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/color-converter",
    locale,
    keywords: [
      "color converter",
      "hex to rgb",
      "rgb to hsl",
      "oklch converter",
      "cmyk converter",
      "color format",
    ],
  });
}

export default async function ColorConverterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (<><ToolJsonLd name="Color Converter" description="Convert colors between HEX, RGB, HSL, OKLCH, CMYK" path="/tools/color-converter" locale={locale} />{children}</>);
}
