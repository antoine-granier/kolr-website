import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: "Mediapartners-Google",
        disallow: ["/en/color/", "/fr/color/"],
      },
      {
        userAgent: "AdsBot-Google",
        disallow: ["/en/color/", "/fr/color/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: "https://kolr-app.vercel.app/sitemap.xml",
    host: "https://kolr-app.vercel.app",
  };
}
