"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════
   ANIMATION PRESETS
   ═══════════════════════════════════════════════ */

export const EASE = {
  outExpo: "expo.out",
  outQuart: "quart.out",
  inOutQuart: "quart.inOut",
  outBack: "back.out(1.7)",
  outElastic: "elastic.out(1, 0.5)",
} as const;

export const DURATION = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  xslow: 1.8,
} as const;

/* ═══════════════════════════════════════════════
   REVEAL ANIMATIONS
   ═══════════════════════════════════════════════ */

/** Fade-up reveal for elements when they enter viewport */
export function createRevealAnimation(
  elements: string | Element | Element[],
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    trigger?: string | Element;
    start?: string;
  } = {}
) {
  const {
    y = 60,
    duration = DURATION.slow,
    stagger = 0.1,
    delay = 0,
    trigger,
    start = "top 85%",
  } = options;

  return gsap.fromTo(
    elements,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: EASE.outExpo,
      scrollTrigger: {
        trigger: trigger || (typeof elements === "string" ? elements : undefined),
        start,
        toggleActions: "play none none none",
      },
    }
  );
}

/** Scale-up reveal */
export function createScaleReveal(
  elements: string | Element | Element[],
  options: {
    scale?: number;
    duration?: number;
    stagger?: number;
    trigger?: string | Element;
    start?: string;
  } = {}
) {
  const {
    scale = 0.8,
    duration = DURATION.slow,
    stagger = 0.1,
    trigger,
    start = "top 85%",
  } = options;

  return gsap.fromTo(
    elements,
    { scale, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      stagger,
      ease: EASE.outExpo,
      scrollTrigger: {
        trigger: trigger || (typeof elements === "string" ? elements : undefined),
        start,
        toggleActions: "play none none none",
      },
    }
  );
}

/* ═══════════════════════════════════════════════
   TEXT SPLIT HELPER
   ═══════════════════════════════════════════════ */

/** Splits text into individual span-wrapped characters */
export function splitTextIntoChars(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.textContent = "";
  element.setAttribute("aria-label", text);

  const chars: HTMLSpanElement[] = [];
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.setAttribute("aria-hidden", "true");
    element.appendChild(span);
    chars.push(span);
  });

  return chars;
}

/** Splits text into individual span-wrapped words */
export function splitTextIntoWords(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.textContent = "";
  element.setAttribute("aria-label", text);

  const words: HTMLSpanElement[] = [];
  text.split(" ").forEach((word, i) => {
    if (i > 0) {
      const space = document.createElement("span");
      space.textContent = "\u00A0";
      space.style.display = "inline-block";
      space.setAttribute("aria-hidden", "true");
      element.appendChild(space);
    }
    const wrapper = document.createElement("span");
    wrapper.style.display = "inline-block";
    wrapper.style.overflow = "hidden";
    wrapper.setAttribute("aria-hidden", "true");

    const inner = document.createElement("span");
    inner.textContent = word;
    inner.style.display = "inline-block";
    inner.style.transform = "translateY(105%)";

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    words.push(inner);
  });

  return words;
}

/* ═══════════════════════════════════════════════
   PARALLAX
   ═══════════════════════════════════════════════ */

export function createParallax(
  element: string | Element,
  options: {
    y?: number;
    speed?: number;
    trigger?: string | Element;
  } = {}
) {
  const { y = -100, trigger } = options;

  return gsap.to(element, {
    y,
    ease: "none",
    scrollTrigger: {
      trigger: trigger || element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
}

/* ═══════════════════════════════════════════════
   LINE DRAW
   ═══════════════════════════════════════════════ */

export function createLineDrawAnimation(
  element: string | SVGPathElement,
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
  } = {}
) {
  const { trigger, start = "top 80%", end = "bottom 20%" } = options;

  return gsap.fromTo(
    element,
    { strokeDashoffset: 1000 },
    {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || element,
        start,
        end,
        scrub: 1,
      },
    }
  );
}

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════ */

export function animateCounter(
  element: HTMLElement,
  endValue: number,
  options: {
    duration?: number;
    suffix?: string;
    prefix?: string;
    trigger?: string | Element;
  } = {}
) {
  const {
    duration = 2,
    suffix = "",
    prefix = "",
    trigger,
  } = options;

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: EASE.outQuart,
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
    },
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/* ═══════════════════════════════════════════════
   MAGNETIC EFFECT
   ═══════════════════════════════════════════════ */

export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3
) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: EASE.outQuart,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: EASE.outBack,
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}
