"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { CheckCircle2, Circle, Hourglass, Globe } from "lucide-react";

interface RoadmapItem {
  text: string;
  done: boolean;
}

interface RoadmapMonth {
  month: string;
  icon: React.ReactNode;
  done: boolean;
  color: string;
  bg: string;
  border: string;
  items: RoadmapItem[];
}

export default function RoadmapPage() {
  const t = useTranslations("roadmap");

  const months: RoadmapMonth[] = [
    {
      month: t("doneTitle"),
      icon: <CheckCircle2 size={18} />,
      done: true,
      color: "text-kolr-green",
      bg: "bg-kolr-green",
      border: "border-kolr-green/30",
      items: [
        { text: t("done1"), done: true },
        { text: t("done2"), done: true },
        { text: t("done3"), done: true },
        { text: t("done4"), done: true },
        { text: t("done5"), done: true },
        { text: t("done6"), done: true },
      ],
    },
    {
      month: t("aprilTitle"),
      icon: <Hourglass size={18} />,
      done: false,
      color: "text-kolr-cyan",
      bg: "bg-kolr-cyan",
      border: "border-kolr-cyan/30",
      items: [
        { text: t("april1"), done: false },
        { text: t("april2"), done: false },
        { text: t("april3"), done: false },
        { text: t("april4"), done: false },
        { text: t("april5"), done: false },
      ],
    },
    {
      month: t("mayTitle"),
      icon: <Hourglass size={18} />,
      done: false,
      color: "text-kolr-purple",
      bg: "bg-kolr-purple",
      border: "border-kolr-purple/30",
      items: [
        { text: t("may1"), done: false },
        { text: t("may2"), done: false },
        { text: t("may3"), done: false },
        { text: t("may4"), done: false },
        { text: t("may5"), done: false },
      ],
    },
    {
      month: t("juneTitle"),
      icon: <Hourglass size={18} />,
      done: false,
      color: "text-kolr-orange",
      bg: "bg-kolr-orange",
      border: "border-kolr-orange/30",
      items: [
        { text: t("june1"), done: false },
        { text: t("june2"), done: false },
        { text: t("june3"), done: false },
        { text: t("june4"), done: false },
        { text: t("june5"), done: false },
      ],
    },
    {
      month: t("q3Title"),
      icon: <Hourglass size={18} />,
      done: false,
      color: "text-kolr-red",
      bg: "bg-kolr-red",
      border: "border-kolr-red/30",
      items: [
        { text: t("q31"), done: false },
        { text: t("q32"), done: false },
        { text: t("q33"), done: false },
        { text: t("q34"), done: false },
        { text: t("q35"), done: false },
        { text: t("q36"), done: false },
      ],
    },
  ];

  return (
    <section className="section">
      <div className="container max-w-[800px]">
        <Reveal animation="reveal-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kolr-surface border border-kolr-border rounded-full mb-6">
              <Globe size={16} className="text-kolr-cyan" />
              <span className="text-sm font-bold text-kolr-text-muted">{t("badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
            <p className="text-lg text-kolr-text-muted max-w-[500px] mx-auto">{t("subtitle")}</p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

          <div className="flex flex-col gap-0">
            {months.map((month, i) => (
              <Reveal key={i} animation="reveal-up" delay={Math.min(i + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5}>
                <div className="relative flex gap-5">
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${month.done ? month.bg + " text-black" : "bg-[#333333] text-[#888888]"}`}>
                      {month.icon}
                    </div>
                    {i < months.length - 1 && (
                      <div className="w-px flex-1 bg-white/10" />
                    )}
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 border ${month.border} bg-kolr-surface rounded-2xl p-5 mb-8`}>
                    <h2 className={`text-lg font-bold ${month.color} mb-4`}>{month.month}</h2>
                    <div className="flex flex-col gap-2.5">
                      {month.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          {item.done ? (
                            <CheckCircle2 size={16} className="text-kolr-green shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={16} className="text-white/20 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm leading-relaxed ${item.done ? "text-kolr-text-muted line-through" : "text-white/80"}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
