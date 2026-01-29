"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import GoogleAdSense from "@/components/GoogleAdSense";
import { isAdEnabled, getAdSlot } from "@/config/adsense";

// Blog articles data with gradient colors
const blogArticles = [
  {
    slug: "understanding-color-theory-basics",
    category: "Color Theory",
    readTime: "8 min read",
    gradient: "from-red-500/30 via-yellow-500/30 to-blue-500/30",
    icon: "🎨",
  },
  {
    slug: "creating-accessible-color-palettes",
    category: "Accessibility",
    readTime: "6 min read",
    gradient: "from-green-500/30 via-emerald-500/30 to-teal-500/30",
    icon: "♿",
  },
  {
    slug: "color-psychology-in-design",
    category: "Design",
    readTime: "10 min read",
    gradient: "from-purple-500/30 via-pink-500/30 to-rose-500/30",
    icon: "🧠",
  },
  {
    slug: "mastering-color-harmonies",
    category: "Color Theory",
    readTime: "7 min read",
    gradient: "from-orange-500/30 via-amber-500/30 to-yellow-500/30",
    icon: "🎭",
  },
  {
    slug: "extracting-colors-from-photos",
    category: "Tutorial",
    readTime: "5 min read",
    gradient: "from-cyan-500/30 via-blue-500/30 to-indigo-500/30",
    icon: "📸",
  },
];

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();

  return (
    <section className="section">
      <div className="container max-w-[1200px]">
        {/* Header */}
        <Reveal animation="reveal-up">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-kolr-text max-w-[700px] mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogArticles.map((article, index) => (
            <Reveal
              key={article.slug}
              animation="reveal-up"
              delay={Math.min(index + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5}
            >
              <Link href={`/${locale}/blog/${article.slug}`}>
                <article className="bg-kolr-surface border border-kolr-border rounded-2xl overflow-hidden hover:border-kolr-primary transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  {/* Image placeholder with gradient and icon */}
                  <div
                    className={`h-48 bg-gradient-to-br ${article.gradient} relative overflow-hidden flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 bg-kolr-bg/40 group-hover:bg-kolr-bg/20 transition-all duration-300" />
                    <div className="relative text-7xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                      {article.icon}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Read Time */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-kolr-text">
                      <span className="text-kolr-primary font-semibold">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 group-hover:text-kolr-primary transition-colors line-clamp-2">
                      {t(`articles.${article.slug}.title`)}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-kolr-text leading-7 mb-4 flex-1 line-clamp-3">
                      {t(`articles.${article.slug}.excerpt`)}
                    </p>

                    {/* Read More Link */}
                    <span className="text-kolr-primary font-semibold group-hover:underline inline-flex items-center gap-2">
                      {t("readMore")} →
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* AdSense Advertisement */}
        {isAdEnabled("blog") && (
          <div className="mt-16 max-w-[800px] mx-auto">
            <Reveal animation="reveal-up">
              <GoogleAdSense
                adSlot={getAdSlot("blog", "afterArticles") || ""}
                adFormat="auto"
              />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
