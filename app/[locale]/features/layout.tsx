import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.features || {};

  const title = t.title || "Powerful Features";
  const description =
    t.subtitle || "Everything you need to create stunning color palettes";

  return generatePageMetadata({
    title,
    description,
    path: "/features",
    locale,
    keywords: [
      "color palette features",
      "photo extraction",
      "camera integration",
      "random palette",
      "color harmony",
      "palette export",
      "design features",
    ],
  });
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
