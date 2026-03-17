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
import BuyMeACoffee from "@/components/BuyMeACoffee";

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

  const title = t.defaultTitle || "Kolr - Color Tools & Accessibility for Designers and Developers";
  const description =
    t.defaultDescription ||
    "The complete color toolkit: palettes, WCAG accessibility, color blindness simulator, converter, dark themes. Free and online.";

  return {
    metadataBase: new URL("https://kolr-app.vercel.app"),
    title: {
      default: title,
      template: "%s | Kolr",
    },
    description,
    keywords: [
      "color tools",
      "color palette generator",
      "WCAG contrast checker",
      "color accessibility",
      "color blindness simulator",
      "color converter",
      "hex to rgb",
      "dark theme generator",
      "gradient generator",
      "design tools",
      "color harmony",
      "palette comparison",
      "web accessibility tools",
      "color picker online",
      "free color tools",
      "CSS colors",
      "Tailwind colors",
      "Figma color palette",
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
    themeColor: "#000000",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `https://kolr-app.vercel.app/${locale}`,
      title,
      description,
      siteName: "Kolr",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kolr - Color Tools & Accessibility",
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
      canonical: `https://kolr-app.vercel.app/${locale}`,
      languages: {
        en: "https://kolr-app.vercel.app/en",
        fr: "https://kolr-app.vercel.app/fr",
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
          <BuyMeACoffee />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
