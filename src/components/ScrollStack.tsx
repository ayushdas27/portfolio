"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollStack.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
  style?: React.CSSProperties;
}

export const ScrollStackItem = ({
  children,
  itemClassName = "",
  style = {},
}: ScrollStackItemProps) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
    {children}
  </div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  stackPositionTop?: number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

export const ScrollStack = ({
  children,
  className = "",
  itemDistance = 24,
  itemScale = 0.025,
  stackPositionTop = 90,
  baseScale = 0.92,
  rotationAmount = 0,
  blurAmount = 3,
  onStackComplete,
}: ScrollStackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".scroll-stack-card");
      if (!cards.length) return;

      cards.forEach((card, i) => {
        card.style.position = "sticky";
        card.style.top = `${stackPositionTop + i * itemDistance}px`;
        card.style.zIndex = `${i + 1}`;
        card.style.transformOrigin = "top center";

        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const targetScale = Math.max(baseScale, 1 - (cards.length - 1 - i) * itemScale);

          gsap.to(card, {
            scale: targetScale,
            opacity: 0.65,
            filter: blurAmount ? `blur(${blurAmount}px)` : "none",
            rotationX: rotationAmount ? -3 : 0,
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: `top ${stackPositionTop + (i + 1) * itemDistance + 220}px`,
              end: `top ${stackPositionTop + (i + 1) * itemDistance}px`,
              scrub: 0.8, // Smooth scrub interpolation for silky transitions
              invalidateOnRefresh: true,
            },
          });
        } else if (onStackComplete) {
          ScrollTrigger.create({
            trigger: card,
            start: `top ${stackPositionTop + i * itemDistance}px`,
            onEnter: () => onStackComplete(),
            once: true,
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [itemDistance, itemScale, stackPositionTop, baseScale, rotationAmount, blurAmount, onStackComplete]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={containerRef}>
      <div className="scroll-stack-inner">{children}</div>
    </div>
  );
};

export default ScrollStack;
