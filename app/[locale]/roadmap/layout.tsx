import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Roadmap",
    description: "See what's coming next for Kolr. Our public roadmap for Q2 2026: new tools, integrations, and features.",
    path: "/roadmap",
    locale,
    keywords: ["kolr roadmap", "upcoming features", "color tools roadmap"],
  });
}

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
