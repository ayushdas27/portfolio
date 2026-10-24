"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ITEMS = [
  {
    date: "Current academic journey",
    category: "Academic Journey",
    title: "B.Tech CSE (AI/ML) Student",
    description:
      "Pursuing Computer Science and Engineering with a focus on artificial intelligence, machine learning, programming, and problem-solving.",
    bullets: [
      "Developing programming skills in Python, C, C#, and TypeScript.",
      "Exploring web development, databases, and computer vision.",
      "Applying technical knowledge to practical projects and research.",
    ],
  },
  {
    date: "2026",
    category: "GEOIMPATHON 1.0",
    title: "Hackathon Participant — 3rd Prize",
    description:
      "Participated in GEOIMPATHON 1.0, where my team progressed from an online round featuring 64 teams to the offline final round.",
    bullets: [
      "Secured third prize with my team.",
      "Won a cash prize of ₹2,000.",
      "Presented Agro Twin, a farm decision-support platform.",
    ],
  },
  {
    date: "2026",
    category: "AI/ML & Research Projects",
    title: "Student Developer & Research Enthusiast",
    description:
      "Exploring real-world challenges through software development, computer vision, and optimization techniques.",
    bullets: [
      "Developed Lunar Align, focused on satellite image correspondence.",
      "Explored quantum optimization for renewable energy selection.",
      "Built Agro Twin, a web-based agricultural decision-support platform.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".exp-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* Divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />

      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15 pointer-events-none blur-[150px]"
        style={{ backgroundColor: "var(--ember)" }}
      />

      <div className="section-container relative z-10">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-ember inline-block rounded-full" />
            <span className="text-ember text-xs font-bold tracking-[0.25em] uppercase">
              Milestones &amp; Learning
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
            Journey &amp; Achievements
          </h2>
          <p className="mt-4 text-base md:text-lg text-ash max-w-2xl leading-relaxed font-normal">
            My journey as a student developer, exploring computer science through academic learning, research, projects, and competitions.
          </p>
        </div>

        {/* Clean Boxless Editorial Experience List */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="exp-item group pb-12 border-b border-white/10 last:border-b-0 flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-12 transition-colors duration-300"
            >
              {/* Left Column: Date & Category */}
              <div className="md:w-1/3 flex-shrink-0">
                <span className="text-xs font-mono font-medium text-ash tracking-wider block mb-1">
                  {item.date}
                </span>
                <span className="text-sm font-semibold tracking-wider uppercase block font-mono text-ember">
                  {item.category}
                </span>
              </div>

              {/* Right Column: Title, Description & Bullets */}
              <div className="md:w-2/3">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-cloud transition-colors">
                  {item.title}
                </h3>
                <p className="text-base text-ash leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2.5">
                  {item.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-silver font-normal">
                      <span className="text-ember font-bold mt-0.5 text-xs">▸</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
