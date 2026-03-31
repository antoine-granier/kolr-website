import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HelpCircle, Mail } from "lucide-react";
import FaqClient from "@/components/FaqClient";

const FAQ_IDS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
];
const CATEGORY_ORDER = ["general", "tools", "technical", "app"];

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("faq");

  const questions: Record<string, { question: string; answer: string; category: string }> = {};
  for (const id of FAQ_IDS) {
    questions[id] = {
      question: t(`questions.${id}.question`),
      answer: t(`questions.${id}.answer`),
      category: t(`questions.${id}.category`),
    };
  }

  const categories: Record<string, string> = {};
  for (const cat of CATEGORY_ORDER) {
    categories[cat] = t(`categories.${cat}`);
  }

  const allLabel =
    t("categories.general").charAt(0).toUpperCase() === "G" ? "All" : "Tout";

  return (
    <>
      <main className="section">
        <div className="container max-w-[800px]">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-kolr-cyan/10 text-kolr-cyan mb-6">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              <span className="gradient-text">{t("title")}</span>
            </h1>
            <p className="text-kolr-text-muted text-lg max-w-[500px] mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <FaqClient
            questions={questions}
            categories={categories}
            allLabel={allLabel}
          />

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-kolr-surface border border-kolr-border rounded-2xl p-8">
            <h2 className="text-xl font-extrabold mb-3">{t("contactTitle")}</h2>
            <p className="text-kolr-text-muted text-sm mb-6">
              {t("contactDesc")}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-kolr-cyan text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Mail size={16} />
              {t("contactButton")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
