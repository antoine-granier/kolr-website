import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: "https://kolr-app.vercel.app/sitemap.xml",
    host: "https://kolr-app.vercel.app",
  };
}
