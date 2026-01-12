import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kolr.app";
  const locales = ["en", "fr"];

  const routes = [
    "",
    "/features",
    "/download",
    "/about",
    "/privacy",
    "/terms",
    "/tools/random",
    "/tools/color-extract",
    "/tools/image-extract",
    "/tools/contrast-checker",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route.startsWith("/tools") ? 0.8 : 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            fr: `${baseUrl}/fr${route}`,
          },
        },
      });
    });
  });

  return sitemap;
}
