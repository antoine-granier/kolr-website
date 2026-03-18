import { MetadataRoute } from "next";

const blogSlugs = [
  "color-trends-2026",
  "building-brand-color-systems",
  "digital-color-spaces-explained",
  "color-in-ui-design",
  "gradient-design-techniques",
  "understanding-color-theory-basics",
  "creating-accessible-color-palettes",
  "color-psychology-in-design",
  "color-accessibility-beyond-contrast",
  "monochromatic-design-guide",
  "mastering-color-harmonies",
  "color-for-data-visualization",
  "seasonal-color-palettes",
  "extracting-colors-from-photos",
  "dark-mode-color-strategies",
  "color-naming-conventions",
  "photography-color-grading",
  "minimalist-color-palettes",
  "color-contrast-for-readability",
  "from-inspiration-to-palette",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kolr-app.vercel.app";
  const locales = ["en", "fr"];

  const staticPages = [
    { route: "", freq: "daily" as const, priority: 1.0 },
    { route: "/features", freq: "weekly" as const, priority: 0.7 },
    { route: "/download", freq: "weekly" as const, priority: 0.7 },
    { route: "/about", freq: "monthly" as const, priority: 0.5 },
    { route: "/privacy", freq: "monthly" as const, priority: 0.3 },
    { route: "/terms", freq: "monthly" as const, priority: 0.3 },
    { route: "/blog", freq: "weekly" as const, priority: 0.7 },
    { route: "/gallery", freq: "weekly" as const, priority: 0.8 },
    { route: "/integrations", freq: "monthly" as const, priority: 0.6 },
    { route: "/faq", freq: "monthly" as const, priority: 0.5 },
    { route: "/share", freq: "weekly" as const, priority: 0.6 },
  ];

  const toolPages = [
    "/tools/random",
    "/tools/color-extract",
    "/tools/image-extract",
    "/tools/contrast-checker",
    "/tools/gradient",
    "/tools/colorblind",
    "/tools/url-extract",
    "/tools/dark-theme",
    "/tools/color-converter",
    "/tools/palette-compare",
    "/tools/colorblind-url",
    "/tools/tailwind-colors",
    "/tools/svg-color-editor",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.route}`,
        lastModified: new Date(),
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: {
          languages: { en: `${baseUrl}/en${page.route}`, fr: `${baseUrl}/fr${page.route}` },
        },
      });
    }

    // Tool pages
    for (const tool of toolPages) {
      entries.push({
        url: `${baseUrl}/${locale}${tool}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: { en: `${baseUrl}/en${tool}`, fr: `${baseUrl}/fr${tool}` },
        },
      });
    }

    // Blog articles
    for (const slug of blogSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: { en: `${baseUrl}/en/blog/${slug}`, fr: `${baseUrl}/fr/blog/${slug}` },
        },
      });
    }
  }

  return entries;
}
