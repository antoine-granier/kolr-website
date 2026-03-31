import { getTranslations } from "next-intl/server";
import ShareClient from "@/components/ShareClient";

export default async function SharePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tShare = await getTranslations("share");
  const tNav = await getTranslations("nav");

  const t: Record<string, string> = {
    "nav.home": tNav("home"),
    "share.title": tShare("title"),
    "share.description": tShare("description"),
    "share.sharedPalette": tShare("sharedPalette"),
    "share.createLink": tShare("createLink"),
    "share.generateLink": tShare("generateLink"),
    "share.copyLink": tShare("copyLink"),
    "share.linkCopied": tShare("linkCopied"),
    "share.colorCopied": tShare("colorCopied"),
    "share.addColor": tShare("addColor"),
    "share.removeColor": tShare("removeColor"),
    "share.shareUrl": tShare("shareUrl"),
    "share.paletteColors": tShare("paletteColors"),
    "share.noColors": tShare("noColors"),
    "share.howItWorks": tShare("howItWorks"),
    "share.step1": tShare("step1"),
    "share.step2": tShare("step2"),
    "share.step3": tShare("step3"),
  };

  return <ShareClient t={t} locale={locale} />;
}
