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
  const t = (messages.toolTextPalette as Record<string, string>) || {};

  const title = t.title || "Text to Palette";
  const description =
    t.description || "Generate color palettes from any text or mood description";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/text-palette",
    locale,
    keywords: [
      "text to palette",
      "mood color palette",
      "color from text",
      "mood colors",
      "text color generator",
      "palette from description",
      "color mood board",
    ],
  });
}

export default async function TextPaletteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ToolJsonLd
        name="Text to Palette"
        description="Generate color palettes from any text or mood description"
        path="/tools/text-palette"
        locale={locale}
      />
      {children}
    </>
  );
}
