import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ToolJsonLd from "@/components/ToolJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.toolTailwindColors || {};

  const title = t.title || "Tailwind Colors";
  const description =
    t.description || "Create, preview and export your Tailwind CSS color palette";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/tailwind-colors",
    locale,
    keywords: [
      "tailwind colors",
      "tailwind css palette",
      "tailwind color generator",
      "color scale generator",
      "CSS color palette",
      "tailwind config",
      "color shades",
    ],
  });
}

export default async function TailwindColorsToolLayout({
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
        name="Tailwind Colors"
        description="Create, preview and export your Tailwind CSS color palette"
        path="/tools/tailwind-colors"
        locale={locale}
      />
      {children}
    </>
  );
}
