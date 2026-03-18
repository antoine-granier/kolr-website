import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "URL Color Extractor",
    description: "Extract all colors from any website URL. Analyze CSS styles and discover the complete color palette of any site.",
    path: "/tools/url-extract",
    locale,
    keywords: ["url color extractor", "website colors", "extract colors from url", "site palette", "CSS color finder"],
  });
}

export default async function UrlExtractToolLayout({
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
        name="URL Color Extractor"
        description="Extract all colors from any website URL"
        path="/tools/url-extract"
        locale={locale}
      />
      {children}
    </>
  );
}
