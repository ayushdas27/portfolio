"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 3, suffix: "", label: "Featured Projects" },
  { value: 1, suffix: "", label: "Competition Award" },
  { value: 1, suffix: "", label: "Academic Focus: AI/ML" },
  { value: 9, suffix: "", label: "Core Technologies" },
];

const JOURNEY = [
  {
    year: "2024–2025",
    title: "The Foundation",
    description:
      "Built my academic foundation and explored programming, problem-solving, and technology. Started developing an interest in how software turns ideas into practical solutions.",
  },
  {
    year: "2025–2026",
    title: "Exploring Computer Science",
    description:
      "Focused on programming and strengthening my technical skills while exploring web development, databases, and software engineering concepts.",
  },
  {
    year: "2026",
    title: "AI/ML & Innovation",
    description:
      "Explored real-world applications of artificial intelligence, computer vision, and optimization through hands-on projects and research.",
  },
  {
    year: "2026",
    title: "From Ideas to Projects",
    description:
      "Worked on Agro Twin, Lunar Align, and Quantum Optimization for Renewable Energy, applying technical concepts to challenges in agriculture, satellite imagery, and renewable energy.",
  },
  {
    year: "Now",
    title: "Building What's Next",
    description:
      "Pursuing B.Tech in CSE (AI/ML) at SRMIST, continuing to learn, experiment, and build projects while growing as a developer and problem-solver.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stats counter animation
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll(".stat-value");
        statEls.forEach((el) => {
          const endValue = parseInt(el.getAttribute("data-value") || "0");
          const suffix = el.getAttribute("data-suffix") || "";
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
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      }

      // Stats cards reveal
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll(".stat-card");
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
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Progressive timeline line draw
      if (lineRef.current && timelineRef.current) {
        if (prefersReducedMotion) {
          gsap.set(lineRef.current, { scaleY: 1 });
        } else {
          gsap.fromTo(
            lineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: timelineRef.current,
                start: "top 75%",
                end: "bottom 70%",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // macOS Genie-inspired alternating timeline cards reveal
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll<HTMLElement>(".timeline-item");
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

        if (prefersReducedMotion) {
          items.forEach((item) => {
            const card = item.querySelector<HTMLElement>(".journey-card");
            const dot = item.querySelector<HTMLElement>(".journey-dot");
            if (card) gsap.set(card, { opacity: 1, x: 0, y: 0, scale: 1, filter: "none" });
            if (dot) gsap.set(dot, { scale: 1, opacity: 1 });
          });
        } else {
          items.forEach((item, i) => {
            const card = item.querySelector<HTMLElement>(".journey-card");
            const dot = item.querySelector<HTMLElement>(".journey-dot");

            // Alternating entrance:
            // Card 1 (i=0) enters gently from the left (-50px)
            // Card 2 (i=1) enters gently from the right (+50px)
            // Card 3 (i=2) enters gently from the left (-50px)
            // Card 4 (i=3) enters gently from the right (+50px)
            // On mobile (<768px), cards are all right of the line, so enter with gentle x: 28px
            const enterFromLeft = i % 2 === 0;
            const initialX = isDesktop ? (enterFromLeft ? -50 : 50) : 28;
            const origin = isDesktop ? (enterFromLeft ? "right center" : "left center") : "left center";

            // Stagger delay between cards (100–160ms)
            const staggerDelay = i * 0.13;

            // 1. Timeline marker illuminates sequentially with glow
            if (dot) {
              gsap.fromTo(
                dot,
                {
                  scale: 0.35,
                  opacity: 0.3,
                  filter: "brightness(0.6)",
                },
                {
                  scale: 1,
                  opacity: 1,
                  filter: "brightness(1.25)",
                  duration: 0.6,
                  delay: staggerDelay,
                  ease: "back.out(1.8)",
                  scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                }
              );
            }

            // 2. Genie-inspired subtle unfolding card animation
            // Subtly expands from compressed state (scaleX: 0.98, scaleY: 0.96) and settles into exact layout position
            if (card) {
              gsap.fromTo(
                card,
                {
                  opacity: 0,
                  x: initialX,
                  scaleX: 0.98,
                  scaleY: 0.96,
                  transformOrigin: origin,
                  filter: "blur(4px)",
                },
                {
                  opacity: 1,
                  x: 0,
                  scaleX: 1,
                  scaleY: 1,
                  filter: "blur(0px)",
                  duration: 0.78,
                  delay: staggerDelay + 0.05,
                  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
                  scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                  onComplete: () => {
                    // Settle precisely in original position and clear transforms for hover styles
                    gsap.set(card, { clearProps: "transform,filter" });
                  },
                }
              );
            }
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 md:py-48">
      <div className="section-container">
        <SectionHeading
          eyebrow="ABOUT ME"
          title="From Curiosity to Innovation"
          subtitle="A Computer Science and Engineering student exploring the intersection of technology, artificial intelligence, and creative problem-solving."
        />

        {/* Profile / Bio Grid with Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 md:mb-28">
          {/* Portrait Image Column */}
          <div className="lg:col-span-5 relative group">
            <div className="relative mx-auto max-w-[360px] lg:max-w-none rounded-3xl p-1 bg-gradient-to-br from-white/15 via-ember/30 to-transparent shadow-[0_0_50px_rgba(160,42,34,0.2)]">
              <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] bg-obsidian">
                <img
                  src="/images/portrait.png"
                  alt="Ayush Das"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent pointer-events-none" />

                {/* Floating identity pill badge */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-obsidian/85 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="block text-white text-xs font-semibold tracking-wider uppercase" style={{ fontFamily: "var(--font-display)" }}>
                      Ayush Das
                    </span>
                    <span className="text-[11px] text-ash">
                      Student Developer &amp; AI/ML Enthusiast
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">SRMIST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/10 border border-ember/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-ember" />
              <span className="text-ember text-xs font-medium tracking-wide">
                Student Developer &amp; AI/ML Enthusiast
              </span>
            </div>

            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[1.25]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Building Ideas Through Code, Research &amp; Experimentation
            </h3>

            <p className="text-base text-ash leading-relaxed">
              I&apos;m Ayush Das, currently pursuing B.Tech in Computer Science and Engineering (AI/ML) at SRMIST. I enjoy exploring how technology works, learning new tools, and turning ideas into practical projects that solve real-world problems.
            </p>

            <p className="text-base text-ash leading-relaxed">
              My interests span software development, artificial intelligence, machine learning, computer vision, and web technologies. Through projects like Agro Twin, Lunar Align, and Quantum Optimization for Renewable Energy, I explore how programming and research can be applied to challenges in agriculture, satellite imagery, and sustainable energy.
            </p>

            <p className="text-base text-ash leading-relaxed">
              For me, development is more than writing code. It&apos;s about understanding a problem, experimenting with ideas, learning from mistakes, and continuously improving the solution. I&apos;m always looking to expand my technical knowledge, collaborate with curious minds, and build meaningful projects that combine innovation with practical impact.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              {["Python", "C", "C#", "TypeScript", "Django", "MySQL", "OpenCV", "NumPy", "Streamlit"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-graphite/70 border border-white/10 text-cloud/90 hover:border-ember/40 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24 md:mb-32">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-card glass-card p-6 md:p-8 text-center group"
            >
              <span
                className="stat-value block text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
                data-value={stat.value}
                data-suffix={stat.suffix}
                style={{ fontFamily: "var(--font-display)" }}
              >
                0{stat.suffix}
              </span>
              <span className="text-xs md:text-sm text-ash tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Journey Timeline */}
        <div className="mb-10 text-center md:text-left">
          <span
            className="text-ember text-xs font-semibold tracking-[0.3em] uppercase block mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Journey
          </span>
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Learning, Building &amp; Exploring
          </h3>
          <p className="mt-3 text-sm md:text-base text-ash max-w-xl font-normal leading-relaxed">
            A chronological timeline of milestones, curiosity-driven exploration, and continuous technical growth.
          </p>
        </div>

        <div ref={timelineRef} className="relative pt-4 pb-8">
          {/* Animated Connecting Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-ember via-ember-bright to-ember origin-top shadow-[0_0_10px_rgba(160,42,34,0.6)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-16">
            {JOURNEY.map((item, i) => (
              <div
                key={item.year}
                className={`timeline-item relative flex items-start gap-8 ${
                  i % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                } pl-12 md:pl-0`}
              >
                {/* Content Card with upward lift, glow, and border highlight */}
                <div className={`w-full md:w-[calc(50%-36px)] ${i % 2 === 0 ? "md:text-right" : ""}`}>
                  <div className="journey-card glass-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-ember/45 transition-all duration-400 group/card relative overflow-hidden shadow-lg hover:shadow-[0_16px_36px_-12px_rgba(160,42,34,0.25),0_0_20px_rgba(252,107,47,0.1)] hover:-translate-y-1">
                    {/* Subtle top accent gradient */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-400" />

                    <span
                      className="inline-block text-ember text-xs md:text-sm font-bold font-mono tracking-wider px-2.5 py-1 rounded bg-ember/10 border border-ember/20 mb-3"
                    >
                      {item.year}
                    </span>
                    <h4
                      className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover/card:text-ember transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-ash leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="journey-dot absolute left-4 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-ember border-[3px] border-void z-10 shadow-[0_0_14px_rgba(160,42,34,0.8)] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-[calc(50%-36px)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
