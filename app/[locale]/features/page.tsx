"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function FeaturesPage() {
  const t = useTranslations("features");

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal animation="reveal-up">
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 900,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("title")}
              </h1>
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "var(--kolr-text-muted)",
                  maxWidth: "700px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                {t("subtitle")}
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.5rem",
            }}
          >
            <Reveal animation="reveal-up" delay={1}>
              <FeatureCard
                icon="📸"
                color="var(--kolr-cyan)"
                title={t("photoExtraction.title")}
                description={t("photoExtraction.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={2}>
              <FeatureCard
                icon="📷"
                color="var(--kolr-green)"
                title={t("cameraIntegration.title")}
                description={t("cameraIntegration.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={3}>
              <FeatureCard
                icon="🎲"
                color="var(--kolr-orange)"
                title={t("randomGenerator.title")}
                description={t("randomGenerator.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={4}>
              <FeatureCard
                icon="🎨"
                color="var(--kolr-purple)"
                title={t("colorPicker.title")}
                description={t("colorPicker.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={1}>
              <FeatureCard
                icon="🎭"
                color="var(--kolr-red)"
                title={t("harmonyModes.title")}
                description={t("harmonyModes.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={2}>
              <FeatureCard
                icon="💾"
                color="var(--kolr-cyan)"
                title={t("gallery.title")}
                description={t("gallery.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={3}>
              <FeatureCard
                icon="📤"
                color="var(--kolr-green)"
                title={t("export.title")}
                description={t("export.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={4}>
              <FeatureCard
                icon="🌙"
                color="var(--kolr-purple)"
                title={t("darkMode.title")}
                description={t("darkMode.description")}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  color,
  title,
  description,
}: {
  icon: string;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "1.25rem",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          marginBottom: "2rem",
          boxShadow: `0 10px 30px ${color}44`,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          marginBottom: "1rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--kolr-text-muted)",
          lineHeight: "1.7",
          fontSize: "1.1rem",
        }}
      >
        {description}
      </p>
    </div>
  );
}
