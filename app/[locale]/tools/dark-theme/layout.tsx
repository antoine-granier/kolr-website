import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolDarkTheme || {};

  const title = t.title || "Dark Theme Generator";
  const description =
    t.description || "Generate beautiful dark themes for your projects";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/dark-theme",
    locale,
    keywords: [
      "dark theme generator",
      "dark mode",
      "dark color palette",
      "dark UI",
      "theme generator",
      "CSS dark theme",
      "Tailwind dark theme",
    ],
  });
}

export default function DarkThemeToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
