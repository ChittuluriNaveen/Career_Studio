"use client";

import React, { useEffect, useRef, useState } from "react";

interface LazySectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
}

export default function LazySectionReveal({
  children,
  className = "",
  delayMs = 0,
  threshold = 0.05,
  direction = "up",
}: LazySectionRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If reduced motion preferred or IntersectionObserver not supported, show immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px", // Trigger precisely as component enters visible viewport
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getTransformStyle = () => {
    if (isVisible) return "opacity-100 translate-y-0 translate-x-0 scale-100";

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-10 scale-100";
      case "down":
        return "opacity-0 -translate-y-10 scale-100";
      case "left":
        return "opacity-0 -translate-x-10 scale-100";
      case "right":
        return "opacity-0 translate-x-10 scale-100";
      case "scale":
        return "opacity-0 scale-95";
      case "fade":
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all duration-700 will-change-transform ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}
