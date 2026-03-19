import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "CSS Shadow Generator",
    description: "Create beautiful box-shadow and text-shadow effects with live preview. Copy CSS or Tailwind code instantly.",
    path: "/tools/shadow-generator",
    locale,
    keywords: ["css shadow generator", "box-shadow", "text-shadow", "shadow maker", "css shadow tool", "tailwind shadow"],
  });
}

export default async function ShadowGeneratorLayout({
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
        name="CSS Shadow Generator"
        description="Create beautiful box-shadow and text-shadow effects with live preview"
        path="/tools/shadow-generator"
        locale={locale}
      />
      {children}
    </>
  );
}
