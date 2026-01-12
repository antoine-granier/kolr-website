import { getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import StructuredData from "@/components/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.download || {};

  const title = t.title || "Download Kolr";
  const description =
    t.description ||
    "Get Kolr on your device and start creating beautiful color palettes today. Free to download with optional premium features.";

  return generatePageMetadata({
    title,
    description,
    path: "/download",
    locale,
    keywords: [
      "download kolr",
      "kolr app",
      "iOS app",
      "Android app",
      "color app download",
      "palette app",
      "mobile color picker",
    ],
  });
}

export default async function DownloadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <StructuredData locale={locale} type="software" />
      {children}
    </>
  );
}
