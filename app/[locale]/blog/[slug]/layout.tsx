import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({
    locale,
    namespace: "blog",
  });

  const articleTitle = t(`articles.${slug}.title`);
  const articleExcerpt = t(`articles.${slug}.excerpt`);

  return {
    title: `${articleTitle} | Kolr Blog`,
    description: articleExcerpt,
    openGraph: {
      title: `${articleTitle} | Kolr Blog`,
      description: articleExcerpt,
      type: "article",
      locale,
      siteName: "Kolr",
    },
    twitter: {
      card: "summary_large_image",
      title: `${articleTitle} | Kolr Blog`,
      description: articleExcerpt,
    },
    alternates: {
      canonical: `https://kolr.app/${locale}/blog/${slug}`,
      languages: {
        en: `https://kolr.app/en/blog/${slug}`,
        fr: `https://kolr.app/fr/blog/${slug}`,
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
