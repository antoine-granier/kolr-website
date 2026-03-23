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
  const t = messages.toolSvgColor || {};

  const title = t.title || "SVG Color Editor";
  const description =
    t.description || "Upload an SVG file and edit its colors visually";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/svg-color-editor",
    locale,
    keywords: [
      "svg color editor",
      "svg color changer",
      "edit svg colors",
      "svg palette editor",
      "svg color tool",
      "change svg colors online",
    ],
  });
}

export default async function SvgColorEditorLayout({
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
        name="SVG Color Editor"
        description="Upload an SVG file and edit its colors visually"
        path="/tools/svg-color-editor"
        locale={locale}
      />
      {children}
    </>
  );
}
