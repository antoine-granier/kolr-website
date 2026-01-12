import { Metadata } from "next";

interface PageMetadataParams {
  title: string;
  description: string;
  path: string;
  locale: string;
  keywords?: string[];
  image?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  locale,
  keywords = [],
  image = "/og-image.png",
}: PageMetadataParams): Metadata {
  const baseUrl = "https://kolr.app";
  const fullUrl = `${baseUrl}/${locale}${path}`;

  const defaultKeywords = [
    "color palette",
    "color picker",
    "palette generator",
    "design tools",
  ];

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Kolr",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@kolrapp",
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        en: `${baseUrl}/en${path}`,
        fr: `${baseUrl}/fr${path}`,
      },
    },
  };
}
