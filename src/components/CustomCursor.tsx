"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (dotRef.current) {
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    }

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const onMouseEnterInteractive = useCallback(() => {
    document.body.classList.add("cursor-hovering");
  }, []);

  const onMouseLeaveInteractive = useCallback(() => {
    document.body.classList.remove("cursor-hovering");
  }, []);

  useEffect(() => {
    // Detect touch device
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    window.addEventListener("mousemove", onMouseMove);

    // Add hover listeners to all interactive elements
    const interactives = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-magnetic]'
    );

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    // MutationObserver for dynamically added elements
    const observer = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-magnetic]'
      );
      newInteractives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, [onMouseMove, onMouseEnterInteractive, onMouseLeaveInteractive]);

  // Don't render until mounted on client, or if touch device
  if (!mounted || ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
