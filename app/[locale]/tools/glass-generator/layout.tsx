import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Glassmorphism / Neumorphism Generator",
    description: "Create stunning glassmorphism and neumorphism effects with live CSS preview. Copy CSS or Tailwind code instantly.",
    path: "/tools/glass-generator",
    locale,
    keywords: ["glassmorphism generator", "neumorphism generator", "glass css", "soft ui", "frosted glass css", "css glass effect", "neumorphic design"],
  });
}

export default async function GlassGeneratorLayout({
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
        name="Glassmorphism / Neumorphism Generator"
        description="Create stunning glassmorphism and neumorphism effects with live CSS preview"
        path="/tools/glass-generator"
        locale={locale}
      />
      {children}
    </>
  );
}
