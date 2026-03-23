import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return generatePageMetadata({
    title: "Contact",
    description:
      "Get in touch with the Kolr team. Questions, feedback, feature requests — we'd love to hear from you.",
    path: "/contact",
    locale,
    keywords: ["contact kolr", "support", "feedback", "help"],
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
