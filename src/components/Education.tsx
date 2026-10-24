"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const EDUCATION_CARD = {
  category: "DEGREE",
  title: "B.Tech in Computer Science and Engineering (AI/ML)",
  institution: "SRM Institute of Science and Technology (SRMIST)",
  status: "Currently pursuing",
};

const TECHNICAL_AREAS = [
  {
    title: "Programming Languages",
    description: "Python, C, C#, TypeScript, SQL",
    badge: "Core",
  },
  {
    title: "Web Development",
    description: "Django, HTML, CSS, MySQL",
    badge: "Stack",
  },
  {
    title: "AI/ML & Research",
    description: "Computer vision, image matching, quantum optimization",
    badge: "Research",
  },
  {
    title: "Tools & Technologies",
    description: "OpenCV, NumPy, Streamlit, Git, GitHub",
    badge: "Tools",
  },
];

const ACHIEVEMENT = {
  title: "3rd Prize",
  subtitle: "GEOIMPATHON 1.0",
  supportingText:
    "Advanced from an online selection round featuring 64 teams to the offline final round and secured third place with my team.",
  prize: "₹2,000",
};

const STATISTICS = [
  { value: 3, suffix: "", label: "Featured Projects" },
  { value: 1, suffix: "", label: "Competition Award" },
  { value: 1, suffix: "", label: "Academic Focus: AI/ML" },
  { value: 4, suffix: "+", label: "Areas of Exploration" },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const achieveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Cards reveal
      const cards = document.querySelectorAll(".edu-card");
      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cards,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
            onComplete: () => {
              gsap.set(cards, { clearProps: "transform" });
            },
          }
        );
      }

      // Achievement counters
      if (achieveRef.current) {
        const counters = achieveRef.current.querySelectorAll(".achieve-value");
        counters.forEach((el) => {
          const endValue = parseInt(el.getAttribute("data-value") || "0");
          const suffix = el.getAttribute("data-suffix") || "";

          if (prefersReducedMotion) {
            el.textContent = `${endValue}${suffix}`;
            return;
          }

          const obj = { value: 0 };

          gsap.to(obj, {
            value: endValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(obj.value)}${suffix}`;
            },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="relative py-32 md:py-48">
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />

      <div className="section-container">
        <SectionHeading
          eyebrow="Academic & Technical Background"
          title="Foundation"
          subtitle="Education, technical skills, projects, and milestones shaping my journey in AI/ML and software development."
        />

        {/* Featured Degree Card */}
        <div className="edu-card glass-card p-8 md:p-10 mb-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ember/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-ember" />
                <span
                  className="text-xs text-ember tracking-widest uppercase font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {EDUCATION_CARD.category}
                </span>
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {EDUCATION_CARD.title}
              </h3>
              <p className="text-base text-ash font-medium">
                {EDUCATION_CARD.institution}
              </p>
            </div>
            <span className="text-xs text-emerald-400 tracking-wider px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
              {EDUCATION_CARD.status}
            </span>
          </div>
        </div>

        {/* Technical Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {TECHNICAL_AREAS.map((item, i) => (
            <div key={i} className="edu-card glass-card p-6 md:p-7 group hover:border-ember/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-lg font-bold text-white group-hover:text-ember transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/5 text-ash border border-white/10">
                  {item.badge}
                </span>
              </div>
              <p className="text-sm text-ash leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Achievement Highlight Card */}
        <div className="edu-card glass-card p-7 md:p-8 mb-16 border border-ember/25 bg-gradient-to-r from-obsidian via-graphite/40 to-obsidian relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ember/15 border border-ember/30 flex items-center justify-center text-ember shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-mono font-semibold tracking-wider text-ember">
                    Hackathon Milestone
                  </span>
                  <span className="text-xs text-ash">·</span>
                  <span className="text-xs text-white/90 font-medium">
                    {ACHIEVEMENT.subtitle}
                  </span>
                </div>
                <h4
                  className="text-xl md:text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {ACHIEVEMENT.title}
                </h4>
                <p className="text-sm text-ash leading-relaxed max-w-2xl">
                  {ACHIEVEMENT.supportingText}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end shrink-0 pl-16 md:pl-0">
              <span className="text-xs uppercase tracking-wider text-ash mb-1">Cash Award</span>
              <span
                className="text-2xl font-bold text-white font-mono"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {ACHIEVEMENT.prize}
              </span>
              <span className="text-[11px] text-ash">Team Prize</span>
            </div>
          </div>
        </div>

        {/* Verifiable Statistics */}
        <div ref={achieveRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATISTICS.map((a) => (
            <div key={a.label} className="edu-card glass-card p-6 text-center">
              <span
                className="achieve-value block text-3xl md:text-4xl font-bold text-ember mb-2"
                data-value={a.value}
                data-suffix={a.suffix}
                style={{ fontFamily: "var(--font-display)" }}
              >
                0{a.suffix}
              </span>
              <span className="text-xs md:text-sm text-ash font-medium">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
