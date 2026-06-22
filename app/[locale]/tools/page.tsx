import { getTranslations, getMessages } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import Reveal from "@/components/Reveal";
import ToolsExplorer from "@/components/ToolsExplorer";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t =
    (messages as { toolsPage?: { title?: string; subtitle?: string } })
      .toolsPage || {};

  return generatePageMetadata({
    title: t.title || "All Color Tools",
    description:
      t.subtitle ||
      "18 free color tools — no account, right in your browser.",
    path: "/tools",
    locale,
    keywords: [
      "color tools",
      "free color tools",
      "color palette generator",
      "contrast checker",
      "colorblind simulator",
      "color converter",
      "online color tools",
    ],
  });
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "toolsPage" });

  return (
    <section className="section">
      <div className="container">
        <Reveal animation="reveal-up">
          <header className="text-center max-w-[700px] mx-auto mb-12">
            <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-kolr-text-muted">{t("subtitle")}</p>
          </header>
        </Reveal>
        <ToolsExplorer />
      </div>
    </section>
  );
}
