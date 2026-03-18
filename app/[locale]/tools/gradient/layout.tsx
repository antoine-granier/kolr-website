import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Gradient Generator",
    description: "Create beautiful CSS gradients with multiple color stops. Preview in real-time and copy the CSS code.",
    path: "/tools/gradient",
    locale,
    keywords: ["gradient generator", "CSS gradient", "linear gradient", "color gradient", "gradient maker"],
  });
}

export default async function GradientToolLayout({
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
        name="Gradient Generator"
        description="Create beautiful CSS gradients with multiple color stops"
        path="/tools/gradient"
        locale={locale}
      />
      {children}
    </>
  );
}
