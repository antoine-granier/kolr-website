// The web tools are free and open — no security gate. They must load in one
// click and stay crawlable for search engines. (Turnstile was removed here;
// the only sensitive endpoint, /api/extract-url, is protected on its own.)
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
