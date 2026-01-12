import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import ScrollToTop from "@/components/ScrollToTop";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages.metadata || {};

  const title = t.defaultTitle || "Kolr - Create palettes from your photos";
  const description =
    t.defaultDescription ||
    "The ultimate color picker and palette generator for designers and developers";

  return {
    metadataBase: new URL("https://kolr.app"),
    title: {
      default: title,
      template: "%s | Kolr",
    },
    description,
    keywords: [
      "color palette",
      "color picker",
      "palette generator",
      "color extraction",
      "design tools",
      "color harmony",
      "color scheme",
      "photo to palette",
      "color theory",
      "designer tools",
      "color analysis",
      "hex colors",
      "RGB colors",
      "color combinations",
      "WCAG contrast",
      "accessibility",
    ],
    authors: [{ name: "Kolr" }],
    creator: "Kolr",
    publisher: "Kolr",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `https://kolr.app/${locale}`,
      title,
      description,
      siteName: "Kolr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kolr - Create palettes from your photos",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
      creator: "@kolrapp",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://kolr.app/${locale}`,
      languages: {
        en: "https://kolr.app/en",
        fr: "https://kolr.app/fr",
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          {children}
          <ScrollToTop />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
