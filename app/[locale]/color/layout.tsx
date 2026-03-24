import TurnstileGate from "@/components/TurnstileGate";

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TurnstileGate>{children}</TurnstileGate>;
}
