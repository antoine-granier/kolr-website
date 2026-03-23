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
  const t = messages.toolColorblindUrl || {};

  const title = t.title || "Colorblind Website Checker";
  const description =
    t.description || "See how your website looks for colorblind users";

  return generatePageMetadata({
    title,
    description,
    path: "/tools/colorblind-url",
    locale,
    keywords: [
      "colorblind checker",
      "website accessibility",
      "color blindness simulator",
      "protanopia",
      "deuteranopia",
      "tritanopia",
      "web accessibility",
    ],
  });
}

export default async function ColorblindUrlLayout({
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
        name="Colorblind Website Checker"
        description="See how your website looks for colorblind users"
        path="/tools/colorblind-url"
        locale={locale}
      />
      {children}
    </>
  );
}
