import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.about || {};

  const title = t.title || "About Kolr";
  const description =
    t.description ||
    "Kolr was created for designers, artists, and anyone who loves colors. Our mission is to make color palette creation simple, intuitive, and accessible to everyone.";

  return generatePageMetadata({
    title,
    description,
    path: "/about",
    locale,
    keywords: [
      "about kolr",
      "kolr story",
      "color palette creator",
      "design tool",
      "color theory",
    ],
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
