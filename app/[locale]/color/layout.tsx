// Color pages are public and shareable (gallery links point here), so they
// render without a security gate. Abuse of the effectively-infinite /color
// space is handled by per-IP rate limiting in proxy.ts instead.
export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
