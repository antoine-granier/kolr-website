import Link from "next/link";
import "@/app/globals.css";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-black text-kolr-cyan mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
          <p className="text-kolr-text-muted mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/en"
            className="inline-flex items-center gap-2 bg-kolr-cyan text-black px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
