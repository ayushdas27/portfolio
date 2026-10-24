"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  strength?: number;
  variant?: "primary" | "outline" | "ghost";
}

export default function MagneticButton({
  children,
  className = "",
  href,
  type,
  onClick,
  strength = 0.35,
  variant = "primary",
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || "ontouchstart" in window) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      });

      if (textRef.current) {
        gsap.to(textRef.current, {
          x: x * strength * 0.5,
          y: y * strength * 0.5,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "back.out(1.7)" });
      if (textRef.current) {
        gsap.to(textRef.current, { x: 0, y: 0, duration: 0.6, ease: "back.out(1.7)" });
      }
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  const baseStyles: Record<string, string> = {
    primary:
      "bg-ember text-white hover:bg-ember-bright border border-transparent shadow-[0_0_25px_rgba(160,42,34,0.4)]",
    outline:
      "bg-transparent text-white border border-white/20 hover:border-ember/50 hover:text-ember",
    ghost:
      "bg-white/5 text-white border border-transparent hover:bg-white/10",
  };

  const btnClass = `
    relative inline-flex items-center justify-center gap-2 
    px-8 py-4 rounded-full font-medium text-sm tracking-wide
    transition-colors duration-300 overflow-hidden cursor-pointer
    ${baseStyles[variant]}
    ${className}
  `;

  const Tag = href ? "a" : "button";
  const props = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
    : { type: type || "button", onClick };

  return (
    <Tag
      ref={btnRef as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
      className={btnClass}
      data-magnetic
      {...props}
    >
      <span ref={textRef} className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Tag>
  );
}
