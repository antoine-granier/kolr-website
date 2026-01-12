export default function StructuredData({
  locale,
  type = "website",
}: {
  locale: string;
  type?: "website" | "software";
}) {
  const baseUrl = "https://kolr-app.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kolr",
    url: baseUrl,
    description:
      "The ultimate color picker and palette generator for designers and developers",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${locale}/tools/color-extract?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kolr",
    url: baseUrl,
    logo: `${baseUrl}/favicon.png`,
    sameAs: [
      "https://twitter.com/kolrapp",
      "https://github.com/kolrapp",
      "https://instagram.com/kolrapp",
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kolr",
    applicationCategory: "DesignApplication",
    operatingSystem: ["iOS", "Android"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2547",
    },
    description:
      "Create beautiful color palettes from your photos. Extract colors, generate harmonies, and discover inspiration.",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  const schemas =
    type === "software"
      ? [organizationSchema, softwareSchema, breadcrumbSchema]
      : [websiteSchema, organizationSchema, breadcrumbSchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
