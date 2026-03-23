"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Mail, Send, MessageSquare, User, AtSign, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

const EMAIL = "antoine.granier@protonmail.com";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const subjectLabels: Record<string, string> = {
    general: t("subjects.general"),
    bug: t("subjects.bug"),
    feature: t("subjects.feature"),
    feedback: t("subjects.feedback"),
    other: t("subjects.other"),
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subjectLine = `[Kolr - ${subjectLabels[subject]}] ${name}`;
    const body = `From: ${name} (${email})\n\n${message}`;
    const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

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

        <Reveal animation="reveal-up" delay={1}>
          <form
            onSubmit={handleSubmit}
            className="relative bg-kolr-surface border border-kolr-border rounded-2xl p-8 space-y-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-kolr-cyan" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                >
                  <User size={16} className="text-kolr-cyan" />
                  {t("form.name")}
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.namePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium mb-2"
                >
                  <AtSign size={16} className="text-kolr-purple" />
                  {t("form.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("form.emailPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-purple focus:ring-1 focus:ring-kolr-purple/30 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="flex items-center gap-2 text-sm font-medium mb-2"
              >
                <MessageSquare size={16} className="text-[#ff6b6b]" />
                {t("form.subject")}
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all"
              >
                {Object.entries(subjectLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="flex items-center gap-2 text-sm font-medium mb-2"
              >
                <Mail size={16} className="text-[#ffd93d]" />
                {t("form.message")}
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("form.messagePlaceholder")}
                className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-kolr-cyan text-black font-bold rounded-xl transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
            >
              <Send size={18} />
              {sent ? t("form.sending") : t("form.send")}
            </button>
          </form>
        </Reveal>

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
