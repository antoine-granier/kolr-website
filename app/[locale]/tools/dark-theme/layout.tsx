import { getTranslations } from "next-intl/server";
import ToolContentSSR from "@/components/ToolContentSSR";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "toolDarkTheme" });

  let faq: { q: string; a: string }[] = [];
  try {
    faq = JSON.parse(t.raw("faq"));
  } catch {}

  return (
    <>
      {children}
      <ToolContentSSR
        aboutContent={t.raw("aboutContent")}
        howToContent={t.raw("howToContent")}
        faq={faq}
      />
    </>
  );
}
