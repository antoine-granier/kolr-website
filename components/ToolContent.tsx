"use client";

import Reveal from "@/components/Reveal";

interface ToolContentProps {
  aboutContent: string;
  howToContent: string;
  faqJson: string;
}

export default function ToolContent({ aboutContent, howToContent, faqJson }: ToolContentProps) {
  let faq: { q: string; a: string }[] = [];
  try {
    faq = JSON.parse(faqJson);
  } catch {}

  return (
    <div className="mt-16 max-w-[800px] mx-auto px-6 space-y-12 pb-8">
      {/* About */}
      <Reveal animation="reveal-up">
        <div className="article-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
      </Reveal>

      {/* How to Use */}
      <Reveal animation="reveal-up" delay={1}>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: howToContent }} />
      </Reveal>

      {/* FAQ */}
      {faq.length > 0 && (
        <Reveal animation="reveal-up" delay={2}>
          <h2 className="text-2xl font-bold mb-6 text-white">FAQ</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="bg-kolr-surface border border-kolr-border rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold text-sm hover:bg-white/[0.02] transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-kolr-text-muted group-open:rotate-45 transition-transform text-lg shrink-0 ml-4">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-kolr-text-muted leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
