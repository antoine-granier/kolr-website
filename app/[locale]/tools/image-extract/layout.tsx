import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolImage || {};

  const title = t.title || "Image Color Extractor";
  const description =
    t.description || "Upload a photo to extract its unique color story";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/image-extract",
    locale,
    keywords: [
      "image color extraction",
      "photo to palette",
      "extract colors from image",
      "image color picker",
      "photo color analyzer",
      "dominant colors",
    ],
  });
}

export default function ImageExtractToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
