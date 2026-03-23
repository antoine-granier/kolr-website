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

export default async function ContrastCheckerToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (<><ToolJsonLd name="Contrast Checker" description="Check color contrast ratios for WCAG accessibility" path="/tools/contrast-checker" locale={locale} />{children}</>);
}
