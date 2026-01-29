import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "blog",
  });

  const articleTitle = t(`articles.${params.slug}.title`);
  const articleExcerpt = t(`articles.${params.slug}.excerpt`);

  return {
    title: `${articleTitle} | Kolr Blog`,
    description: articleExcerpt,
    openGraph: {
      title: `${articleTitle} | Kolr Blog`,
      description: articleExcerpt,
      type: "article",
      locale: params.locale,
      siteName: "Kolr",
    },
    twitter: {
      card: "summary_large_image",
      title: `${articleTitle} | Kolr Blog`,
      description: articleExcerpt,
    },
    alternates: {
      canonical: `https://kolr.app/${params.locale}/blog/${params.slug}`,
      languages: {
        en: `https://kolr.app/en/blog/${params.slug}`,
        fr: `https://kolr.app/fr/blog/${params.slug}`,
      },
    },
  };
}

export default function BlogArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
