import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /color/ is an effectively-infinite dynamic space (one page per hex).
        // Keep compliant crawlers out of it so they don't burn function renders
        // scanning millions of URLs; the middleware blocks non-browser hits too.
        disallow: ["/api/", "/private/", "/en/color/", "/fr/color/"],
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
