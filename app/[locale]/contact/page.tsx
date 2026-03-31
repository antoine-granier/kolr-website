import { getTranslations } from "next-intl/server";
import { Mail, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

const EMAIL = "antoine.granier@protonmail.com";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations("contact");

  const translations: Record<string, string> = {
    "subjects.general": t("subjects.general"),
    "subjects.bug": t("subjects.bug"),
    "subjects.feature": t("subjects.feature"),
    "subjects.feedback": t("subjects.feedback"),
    "subjects.other": t("subjects.other"),
    "form.name": t("form.name"),
    "form.namePlaceholder": t("form.namePlaceholder"),
    "form.email": t("form.email"),
    "form.emailPlaceholder": t("form.emailPlaceholder"),
    "form.subject": t("form.subject"),
    "form.message": t("form.message"),
    "form.messagePlaceholder": t("form.messagePlaceholder"),
    "form.send": t("form.send"),
    "form.sending": t("form.sending"),
  };

  return (
    <section className="section">
      <div className="container max-w-[700px]">
        <Reveal animation="reveal-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            {t("title")}
          </h1>
          <p className="text-kolr-text-muted text-lg text-center mb-12">
            {t("subtitle")}
          </p>
        </Reveal>

        <ContactForm translations={translations} />

        <Reveal animation="reveal-up" delay={2}>
          <div className="mt-8 bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-center">
            <Sparkles size={24} className="text-kolr-cyan mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-4">{t("info.title")}</h2>
            <p className="text-kolr-text-muted mb-3">{t("info.email")}</p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-kolr-cyan hover:text-kolr-purple transition-colors font-semibold"
            >
              <Mail size={16} />
              {EMAIL}
            </a>
            <p className="text-kolr-text-muted text-sm mt-4">{t("info.response")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
