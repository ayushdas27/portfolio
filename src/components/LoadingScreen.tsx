"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          const exitTl = gsap.timeline({
            onComplete,
          });

          exitTl
            .to(counterRef.current, {
              opacity: 0,
              y: -30,
              duration: 0.4,
              ease: "power2.in",
            })
            .to(
              nameRef.current,
              {
                opacity: 0,
                y: -30,
                duration: 0.4,
                ease: "power2.in",
              },
              "<0.1"
            )
            .to(
              barRef.current?.parentElement!,
              {
                opacity: 0,
                duration: 0.3,
              },
              "<0.1"
            )
            .to(screenRef.current, {
              yPercent: -100,
              duration: 1,
              ease: "expo.inOut",
            });
        },
      });

      // Counter animation
      const counter = { value: 0 };
      tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(counter.value);
          setCount(v);
          if (counterRef.current) {
            counterRef.current.textContent = String(v);
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${v / 100})`;
          }
        },
      });

      // Name reveal
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
        0.5
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={screenRef} className="loading-screen">
      <span ref={counterRef} className="loading-counter">
        0
      </span>
      <div ref={nameRef} className="opacity-0">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 2vw, 18px)",
            color: "var(--ash)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Ayush Das
        </span>
      </div>
      <div className="loading-bar-track">
        <div ref={barRef} className="loading-bar-fill" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
