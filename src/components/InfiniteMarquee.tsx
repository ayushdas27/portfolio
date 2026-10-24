"use client";

import { type ReactNode } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
}

export default function InfiniteMarquee({
  children,
  speed = 30,
  direction = "left",
  className = "",
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      aria-hidden="true"
    >
      <div
        className={`inline-flex ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
