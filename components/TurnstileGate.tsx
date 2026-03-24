"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import Turnstile from "@/components/Turnstile";

interface TurnstileGateProps {
  children: React.ReactNode;
}

export default function TurnstileGate({ children }: TurnstileGateProps) {
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      setVerified(true);
      setChecking(false);
      return;
    }

    // Check signed cookie via server
    fetch("/api/check-verified")
      .then((res) => res.json())
      .then((data) => {
        if (data.verified) setVerified(true);
      })
      .finally(() => setChecking(false));
  }, [siteKey]);

  if (checking) return null;

  if (verified) return <>{children}</>;

  return (
    <div className="min-h-screen bg-kolr-bg flex items-center justify-center">
      <div className="relative bg-kolr-surface/90 backdrop-blur-xl border border-kolr-border rounded-2xl p-10 max-w-sm w-full mx-4 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-kolr-cyan/10 border border-kolr-cyan/20 flex items-center justify-center mb-5">
            <ShieldCheck size={28} className="text-kolr-cyan" />
          </div>

          <h2 className="text-lg font-bold mb-1.5 text-white">Security Check</h2>
          <p className="text-kolr-text-muted text-sm mb-6">
            Quick verification to keep bots away.
          </p>

          <div className="mb-4">
            <Turnstile
              onVerify={(token) => {
                setVerifying(true);
                fetch("/api/verify-turnstile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token }),
                }).then((res) => {
                  if (res.ok) {
                    setVerified(true);
                  }
                  setVerifying(false);
                });
              }}
            />
          </div>

          {verifying && (
            <p className="text-kolr-cyan text-xs animate-pulse">
              Verifying...
            </p>
          )}

          <p className="text-kolr-text-muted/50 text-xs mt-4">
            Protected by Cloudflare Turnstile
          </p>
        </div>
      </div>
    </div>
  );
}
