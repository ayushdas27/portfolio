"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = containerRef.current?.querySelectorAll(".sh-animate");
      if (!els) return;

      gsap.fromTo(
        els,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mb-16 md:mb-24 ${align === "center" ? "text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <span
          className="sh-animate inline-block text-ember text-xs font-medium tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className="sh-animate text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="sh-animate mt-4 md:mt-6 text-base md:text-lg text-ash max-w-xl leading-relaxed"
          style={align === "center" ? { marginLeft: "auto", marginRight: "auto" } : {}}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
