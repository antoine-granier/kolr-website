import TurnstileGate from "@/components/TurnstileGate";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TurnstileGate>{children}</TurnstileGate>;
}
