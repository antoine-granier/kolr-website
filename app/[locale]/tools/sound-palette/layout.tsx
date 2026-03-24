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
  const t = (messages.toolSoundPalette as Record<string, string>) || {};

  const title = t.title || "Sound to Palette";
  const description =
    t.description || "Generate color palettes from music and sounds";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/sound-palette",
    locale,
    keywords: [
      "sound to color",
      "music palette generator",
      "audio color palette",
      "synesthesia tool",
      "music to colors",
      "sound visualization",
      "audio palette",
      "color from music",
    ],
  });
}

export default async function SoundPaletteLayout({
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
        name="Sound to Palette"
        description="Generate color palettes from music and sounds"
        path="/tools/sound-palette"
        locale={locale}
      />
      {children}
    </>
  );
}
