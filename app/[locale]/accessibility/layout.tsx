import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Accessibility",
    description: "Kolr's commitment to accessibility. Learn about our WCAG AA compliance, accessibility features, and how we make color tools usable for everyone.",
    path: "/accessibility",
    locale,
    keywords: ["accessibility", "WCAG AA", "a11y", "inclusive design", "accessible color tools"],
  });
}

export default function AccessibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
