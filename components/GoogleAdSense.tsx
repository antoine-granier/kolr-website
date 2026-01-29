"use client";

import { useEffect } from "react";

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAdSense({
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
}: GoogleAdSenseProps) {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction) return;

    try {
      // Push ad to the adsbygoogle array
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [isProduction]);

  // In development, show a placeholder
  if (!isProduction) {
    return (
      <div
        className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl p-8 flex items-center justify-center border border-gray-700/50"
        style={{ minHeight: "250px" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">📢</div>
          <p className="text-gray-400 text-sm">
            Ad Placeholder (Development Mode)
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Ads will appear here in production
          </p>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-1962397436964429"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-ad-layout-key={adLayoutKey}
      data-full-width-responsive="true"
    ></ins>
  );
}
