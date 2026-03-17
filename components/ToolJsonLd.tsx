export default function ToolJsonLd({
  name,
  description,
  path,
  locale,
}: {
  name: string;
  description: string;
  path: string;
  locale: string;
}) {
  const baseUrl = "https://kolr-app.vercel.app";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} - Kolr`,
    url: `${baseUrl}/${locale}${path}`,
    description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Kolr",
      url: baseUrl,
    },
    browserRequirements: "Requires JavaScript",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${baseUrl}/${locale}${path}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
