"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Reveal from "@/components/Reveal";
import GoogleAdSense from "@/components/GoogleAdSense";
import { isAdEnabled, getAdSlot } from "@/config/adsense";
import { blogArticles } from "../page";

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations("blog");

  const meta = blogArticles.find((a) => a.slug === slug) || {
    slug,
    category: "Article",
    readTime: "",
    gradient: "from-kolr-cyan/20 to-kolr-purple/20",
    icon: "📝",
  };

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8 pb-16">
        <div className="container max-w-[800px]">
          {/* Back Link */}
          <Reveal animation="reveal-up">
            <Link
              href={`/${locale}/blog`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{t("backToBlog")}</span>
            </Link>
          </Reveal>

          {/* Article Header */}
          <Reveal animation="reveal-up" delay={1}>
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kolr-cyan/10 text-kolr-cyan text-sm font-bold">
                  <Tag size={12} />
                  {t(`articles.${slug}.category`)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-kolr-text-muted">
                  <Clock size={12} />
                  {t(`articles.${slug}.readTime`)}
                </span>
                <span className="text-sm text-kolr-text-muted">
                  {t(`articles.${slug}.date`)}
                </span>
              </div>
              <h1 className="[font-size:_clamp(2rem,5vw,3rem)] font-black tracking-[-0.02em] leading-tight mb-6">
                {t(`articles.${slug}.title`)}
              </h1>
              <p className="text-xl text-kolr-text-muted leading-relaxed">
                {t(`articles.${slug}.excerpt`)}
              </p>
            </header>
          </Reveal>

          {/* Hero Image */}
          <Reveal animation="reveal-scale" delay={2}>
            <div
              className={`h-[350px] md:h-[420px] bg-gradient-to-br ${meta.gradient} rounded-[2rem] mb-14 relative overflow-hidden flex items-center justify-center`}
            >
              <div className="absolute inset-0 bg-kolr-bg/30" />
              <div className="relative text-9xl opacity-70">{meta.icon}</div>
            </div>
          </Reveal>

          {/* Article Content */}
          <Reveal animation="reveal-up" delay={3}>
            <div
              dangerouslySetInnerHTML={{
                __html: t.raw(`articles.${slug}.content`),
              }}
              className="article-content"
            />
          </Reveal>

          {/* AdSense Advertisement - In Article */}
          {isAdEnabled("blogArticle") && (
            <div className="my-12">
              <GoogleAdSense
                adSlot={getAdSlot("blogArticle", "inArticle") || ""}
                adFormat="fluid"
                adLayout="in-article"
              />
            </div>
          )}

          {/* CTA Section */}
          <Reveal animation="reveal-up" delay={4}>
            <div className="mt-16 bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 md:p-12 text-center backdrop-blur-xl">
              <h2 className="text-2xl font-black mb-4">{t("cta.title")}</h2>
              <p className="text-kolr-text-muted mb-8 max-w-[500px] mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={`/${locale}/download`} className="btn-primary">
                  {t("cta.downloadButton")}
                </Link>
                <Link
                  href={`/${locale}/tools/random`}
                  className="btn-secondary"
                >
                  {t("cta.tryToolsButton")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
