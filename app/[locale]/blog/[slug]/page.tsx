"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import GoogleAdSense from "@/components/GoogleAdSense";
import { isAdEnabled, getAdSlot } from "@/config/adsense";

// Article metadata with gradients
const articleMeta: Record<string, { gradient: string; icon: string }> = {
  "understanding-color-theory-basics": {
    gradient: "from-red-500/30 via-yellow-500/30 to-blue-500/30",
    icon: "🎨",
  },
  "creating-accessible-color-palettes": {
    gradient: "from-green-500/30 via-emerald-500/30 to-teal-500/30",
    icon: "♿",
  },
  "color-psychology-in-design": {
    gradient: "from-purple-500/30 via-pink-500/30 to-rose-500/30",
    icon: "🧠",
  },
  "mastering-color-harmonies": {
    gradient: "from-orange-500/30 via-amber-500/30 to-yellow-500/30",
    icon: "🎭",
  },
  "extracting-colors-from-photos": {
    gradient: "from-cyan-500/30 via-blue-500/30 to-indigo-500/30",
    icon: "📸",
  },
};

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations("blog");

  const meta = articleMeta[slug] || {
    gradient: "from-kolr-primary/20 to-kolr-accent/20",
    icon: "📝",
  };

  return (
    <article className="section">
      <div className="container max-w-[800px]">
        {/* Back Link */}
        <Reveal animation="reveal-up">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-kolr-primary hover:underline mb-8"
          >
            ← {t("backToBlog")}
          </Link>
        </Reveal>

        {/* Article Header */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-sm text-kolr-text">
              <span className="text-kolr-primary font-semibold">
                {t(`articles.${slug}.category`)}
              </span>
              <span>•</span>
              <span>{t(`articles.${slug}.readTime`)}</span>
              <span>•</span>
              <span>{t(`articles.${slug}.date`)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t(`articles.${slug}.title`)}
            </h1>
            <p className="text-xl text-kolr-text leading-8">
              {t(`articles.${slug}.excerpt`)}
            </p>
          </div>
        </Reveal>

        {/* Featured Image Placeholder */}
        <Reveal animation="reveal-up" delay={2}>
          <div
            className={`h-[400px] bg-gradient-to-br ${meta.gradient} rounded-3xl mb-12 relative overflow-hidden flex items-center justify-center`}
          >
            <div className="absolute inset-0 bg-kolr-bg/40" />
            <div className="relative text-9xl opacity-70">{meta.icon}</div>
          </div>
        </Reveal>

        {/* Article Content */}
        <Reveal animation="reveal-up" delay={3}>
          <div className="prose prose-lg prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: t.raw(`articles.${slug}.content`),
              }}
              className="text-kolr-text leading-8 space-y-6"
            />
          </div>
        </Reveal>

        {/* AdSense Advertisement - In Article */}
        {isAdEnabled("blogArticle") && (
          <Reveal animation="reveal-up" delay={3}>
            <div className="my-12">
              <GoogleAdSense
                adSlot={getAdSlot("blogArticle", "inArticle") || ""}
                adFormat="fluid"
                adLayout="in-article"
              />
            </div>
          </Reveal>
        )}

        {/* CTA Section */}
        <Reveal animation="reveal-up" delay={4}>
          <div className="mt-16 bg-kolr-surface border border-kolr-border rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-kolr-text mb-6">{t("cta.description")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/download`} className="btn-primary">
                {t("cta.downloadButton")}
              </Link>
              <Link href={`/${locale}/tools/random`} className="btn-secondary">
                {t("cta.tryToolsButton")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
