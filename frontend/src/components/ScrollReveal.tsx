"use client";

import React, { useState, useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;       // in milliseconds
  duration?: number;    // in milliseconds
  animation?: "fade-up" | "fade-in" | "scale-in";
  repeat?: boolean;     // if true, animates on scroll-out and scroll-in
  threshold?: number;   // viewport intersection ratio threshold (0.0 to 1.0)
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 700,
  animation = "fade-up",
  repeat = true,        // repeating animations on enter/leave by default (smooth scroll experience)
  threshold = 0.1
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser supports IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (repeat) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters viewport for better visual timing
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [repeat, threshold]);

  // Timing and curve settings
  const transitionStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
  };

  const getAnimationStyles = (): React.CSSProperties => {
    if (animation === "fade-up") {
      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
      };
    }
    if (animation === "scale-in") {
      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.96)",
      };
    }
    // "fade-in"
    return {
      opacity: isVisible ? 1 : 0,
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...transitionStyles,
        ...getAnimationStyles()
      }}
    >
      {children}
    </div>
  );
}
