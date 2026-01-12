import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolRandom || {};

  const title = t.title || "Random Palette Generator";
  const description =
    t.description || "Generate fresh color palettes for instant inspiration";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/random",
    locale,
    keywords: [
      "random palette generator",
      "random colors",
      "color inspiration",
      "palette ideas",
      "random color scheme",
      "color generator",
    ],
  });
}

export default function RandomToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
