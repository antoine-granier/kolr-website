import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("blogTitle"),
    description: t("blogDescription"),
    openGraph: {
      title: t("blogTitle"),
      description: t("blogDescription"),
      type: "website",
      locale: locale,
      siteName: "Kolr",
    },
    twitter: {
      card: "summary_large_image",
      title: t("blogTitle"),
      description: t("blogDescription"),
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
