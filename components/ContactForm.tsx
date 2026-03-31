"use client";

import { useState } from "react";
import { Mail, Send, MessageSquare, User, AtSign } from "lucide-react";
import Reveal from "@/components/Reveal";

const EMAIL = "antoine.granier@protonmail.com";

interface ContactFormProps {
  translations: Record<string, string>;
}

export default function ContactForm({ translations }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const subjectLabels: Record<string, string> = {
    general: translations["subjects.general"],
    bug: translations["subjects.bug"],
    feature: translations["subjects.feature"],
    feedback: translations["subjects.feedback"],
    other: translations["subjects.other"],
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
              {translations["form.name"]}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translations["form.namePlaceholder"]}
              className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium mb-2"
            >
              <AtSign size={16} className="text-kolr-purple" />
              {translations["form.email"]}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations["form.emailPlaceholder"]}
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
            {translations["form.subject"]}
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
            {translations["form.message"]}
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={translations["form.messagePlaceholder"]}
            className="w-full px-4 py-3 rounded-xl bg-kolr-bg border border-kolr-border focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-kolr-cyan text-black font-bold rounded-xl transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
        >
          <Send size={18} />
          {sent ? translations["form.sending"] : translations["form.send"]}
        </button>
      </form>
    </Reveal>
  );
}
