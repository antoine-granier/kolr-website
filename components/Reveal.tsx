"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  animation?: "reveal-up" | "reveal-scale";
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  width?: "fit-content" | "100%";
}

export default function Reveal({
  children,
  animation = "reveal-up",
  delay = 0,
  className = "",
  width = "100%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const baseClasses =
    "opacity-0 transition-opacity duration-700 ease-out will-change-[opacity,transform]";
  const animationClasses =
    animation === "reveal-up"
      ? "transform translate-y-10"
      : "transform scale-1";
  const activeClasses = "opacity-100 translate-y-0 scale-100"; // sera neutralisé selon l'animation
  const widthClass = width === "fit-content" ? "w-fit" : "w-full";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${animationClasses} ${
        isVisible ? activeClasses : ""
      } ${widthClass} ${className}`}
      style={
        delay > 0
          ? { transitionDelay: `${delay * 0.2}s` } // 0.1s, 0.2s, ...
          : undefined
      }
    >
      {children}
    </div>
  );
}
