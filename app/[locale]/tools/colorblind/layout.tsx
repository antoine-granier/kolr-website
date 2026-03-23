import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Colorblind Simulator",
    description: "Simulate how your colors appear to people with color vision deficiencies. Test for protanopia, deuteranopia, tritanopia and more.",
    path: "/tools/colorblind",
    locale,
    keywords: ["colorblind simulator", "color blindness test", "protanopia", "deuteranopia", "accessibility"],
  });
}

export default async function ColorblindToolLayout({
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
        name="Colorblind Simulator"
        description="Simulate how your colors appear to people with color vision deficiencies"
        path="/tools/colorblind"
        locale={locale}
      />
      {children}
    </>
  );
}
