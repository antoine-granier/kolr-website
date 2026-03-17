"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";

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

export default function FaqPage() {
  const t = useTranslations("faq");

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const filteredFaqs = FAQ_IDS.filter((id) => {
    if (selectedCategory === "all") return true;
    return t(`questions.${id}.category`) === selectedCategory;
  });

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

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                selectedCategory === "all"
                  ? "bg-kolr-cyan text-black border-kolr-cyan"
                  : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t("categories.general").charAt(0).toUpperCase() === "G"
                ? "All"
                : "Tout"}
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-kolr-cyan text-black border-kolr-cyan"
                    : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="flex flex-col gap-3">
            {filteredFaqs.map((id) => {
              const isOpen = openItems.includes(id);
              return (
                <div
                  key={id}
                  className={`bg-kolr-surface border rounded-2xl transition-all duration-300 ${
                    isOpen
                      ? "border-kolr-cyan/30"
                      : "border-kolr-border hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => toggleItem(id)}
                    className="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <span
                      className={`font-bold text-[0.95rem] pr-4 transition-colors duration-300 ${
                        isOpen ? "text-kolr-cyan" : "text-white"
                      }`}
                    >
                      {t(`questions.${id}.question`)}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-kolr-text-muted transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-kolr-cyan" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 text-kolr-text-muted text-sm leading-relaxed border-t border-white/5 pt-4">
                      {t(`questions.${id}.answer`)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-kolr-surface border border-kolr-border rounded-2xl p-8">
            <h2 className="text-xl font-extrabold mb-3">{t("contactTitle")}</h2>
            <p className="text-kolr-text-muted text-sm mb-6">
              {t("contactDesc")}
            </p>
            <a
              href="mailto:antoine.granier@protonmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-kolr-cyan text-black font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Mail size={16} />
              {t("contactButton")}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
