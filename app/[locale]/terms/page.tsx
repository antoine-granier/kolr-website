"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <>
      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <Reveal animation="reveal-up">
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {t("title")}
            </h1>
            <p
              style={{
                color: "var(--kolr-text-muted)",
                marginBottom: "3rem",
                fontSize: "1.0625rem",
              }}
            >
              {t("lastUpdated")}
            </p>
          </Reveal>

          <div
            style={{
              fontSize: "1.0625rem",
              lineHeight: "1.8",
              color: "var(--kolr-text)",
            }}
          >
            <Reveal animation="reveal-up" delay={1}>
              <p style={{ marginBottom: "2rem" }}>{t("intro")}</p>
            </Reveal>

            <Reveal animation="reveal-up" delay={2}>
              <Section
                title={t("license.title")}
                content={t("license.content")}
              />
            </Reveal>

            <Reveal animation="reveal-up" delay={3}>
              <Section title={t("usage.title")} content={t("usage.content")} />
            </Reveal>

            <Reveal animation="reveal-up" delay={4}>
              <Section
                title={t("ownership.title")}
                content={t("ownership.content")}
              />
            </Reveal>

            <Reveal animation="reveal-up" delay={5}>
              <Section
                title={t("limitation.title")}
                content={t("limitation.content")}
              />
            </Reveal>

            <Reveal animation="reveal-up">
              <div
                style={{
                  backgroundColor: "var(--kolr-surface)",
                  padding: "2rem",
                  borderRadius: "1rem",
                  border: "1px solid var(--kolr-border)",
                }}
              >
                <p>{t("contact")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "1rem",
        }}
      >
        {title}
      </h2>
      <p style={{ color: "var(--kolr-text-muted)" }}>{content}</p>
    </div>
  );
}
