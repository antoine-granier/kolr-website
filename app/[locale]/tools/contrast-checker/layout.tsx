import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolContrast || {};

  const title = t.title || "Contrast Checker";
  const description =
    t.description || "Check color contrast ratios for accessibility (WCAG)";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/contrast-checker",
    locale,
    keywords: [
      "contrast checker",
      "WCAG compliance",
      "accessibility",
      "color contrast",
      "contrast ratio",
      "AA compliance",
      "AAA compliance",
      "web accessibility",
    ],
  });
}

export default function ContrastCheckerToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
