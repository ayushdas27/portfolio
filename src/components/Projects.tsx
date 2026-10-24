"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DepthCarousel } from "./DepthCarousel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  glowColor: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    id: "agro-twin",
    title: "Agro Twin",
    category: "Sustainable Agriculture & Satellite AI",
    tagline: "Smarter Farming for a Better Tomorrow",
    description:
      "Farm decision-support platform leveraging satellite data, AI, and simulation to help farmers make informed decisions for higher productivity and sustainable agriculture. Presented at GEOIMPATHON 1.0 (3rd Prize).",
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.35)",
    image: "/images/agro-twin.jpg",
    liveUrl: "https://agro-twin-xi.vercel.app/",
    tags: ["Satellite Data", "Crop Analysis", "GEOIMPATHON 1.0", "AI/ML"],
  },
  {
    id: "lunar-align",
    title: "Lunar Align",
    category: "Computer Vision & Remote Sensing",
    tagline: "Satellite Image Correspondence & Alignment",
    description:
      "Multi-modal, sun-angle and scale-invariant image correspondence using Chandrayaan-2 OHRC, TMC/TMC-2, and IIRS imagery with RootSIFT, FLANN, and RANSAC pipeline.",
    color: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.35)",
    image: "/images/lunar-align.jpg",
    githubUrl: "https://github.com/ayushdas27",
    tags: ["Chandrayaan-2", "RootSIFT", "RANSAC", "Feature Matching"],
  },
  {
    id: "urban-mobility",
    title: "Urban Mobility Intelligence",
    category: "Computer Vision & Smart Cities",
    tagline: "Safer Roads, Smarter Cities",
    description:
      "AI-powered urban mobility system leveraging bus-mounted cameras and computer vision to detect road defects, traffic congestion, unsafe driving, and infrastructure issues in real-time.",
    color: "#0284C7",
    glowColor: "rgba(2, 132, 199, 0.35)",
    image: "/images/urban-mobility.jpg",
    githubUrl: "https://github.com/ayushdas27",
    tags: ["Computer Vision", "Fleet Tracking", "Defect Detection", "Smart Cities"],
  },
  {
    id: "crop-health",
    title: "Crop Health Monitoring",
    category: "Satellite Earth Observation",
    tagline: "Monitor Crop Health with Satellite Intelligence",
    description:
      "Satellite-based vegetation index analysis (NDVI, NDRE, EVI) using Sentinel-2 10m imagery to detect crop stress, map field health, and optimize agricultural interventions.",
    color: "#16A34A",
    glowColor: "rgba(22, 163, 74, 0.35)",
    image: "/images/crop-health.jpg",
    liveUrl: "https://agro-twin-xi.vercel.app/",
    tags: ["Sentinel-2", "NDVI & NDRE", "Field Mapping", "Remote Sensing"],
  },
];

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "3d">("3d");
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const carouselItems = useMemo(
    () =>
      PROJECTS.map((p) => ({
        image: p.image,
        title: p.title,
        alt: p.title,
      })),
    []
  );

  const activeProject = PROJECTS[activeCarouselIndex] || PROJECTS[0];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".project-card-item");
      if (!cards || cards.length === 0) return;

      if (prefersReducedMotion) {
        cards.forEach((card) => gsap.set(card, { opacity: 1, y: 0 }));
        return;
      }

      gsap.fromTo(
        cards,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
          onComplete: () => {
            cards.forEach((card) => gsap.set(card, { clearProps: "transform" }));
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [viewMode]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* Divider */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />

      {/* Dynamic ambient background glow */}
      <div
        className="absolute top-1/3 -left-48 w-96 h-96 rounded-full opacity-25 pointer-events-none blur-[140px] transition-all duration-700"
        style={{
          backgroundColor:
            viewMode === "3d"
              ? activeProject.color
              : hoveredIndex !== null
              ? PROJECTS[hoveredIndex]?.color || "var(--ember)"
              : "var(--ember)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Section Header with View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-ember inline-block rounded-full" />
              <span className="text-ember text-xs font-bold tracking-[0.25em] uppercase">
                Featured Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Selected Projects
            </h2>
            <p className="mt-3 text-base text-ash max-w-xl font-normal">
              Real-world systems across agricultural decision-support, satellite imagery, computer vision, and urban intelligence.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-full bg-graphite/80 border border-white/10 backdrop-blur-md self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-ember text-white shadow-lg"
                  : "text-ash hover:text-white"
              }`}
            >
              Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                viewMode === "3d"
                  ? "bg-ember text-white shadow-lg"
                  : "text-ash hover:text-white"
              }`}
            >
              3D Depth View
            </button>
          </div>
        </div>

        {/* 2x2 Grid View (Matching Image 5 layout with real screenshots) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {PROJECTS.map((project, i) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="project-card-item rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 group hover:border-white/30 transition-all duration-500 shadow-2xl bg-obsidian/90 flex flex-col justify-between"
              >
                <div>
                  {/* Image container with aspect ratio and hover glow */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-void">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Glowing gradient hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${project.glowColor} 0%, transparent 75%)`,
                      }}
                    />

                    {/* External Link Overlay Badge */}
                    <a
                      href={project.liveUrl || project.githubUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-full text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:scale-110"
                      title={project.liveUrl ? "Visit Live Site" : "View Source Code"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  {/* Card content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-xs font-mono text-ember uppercase tracking-wider font-semibold">
                        {project.category}
                      </span>
                      {project.liveUrl && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Demo
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-ember transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs font-medium text-ember/80 mb-3 tracking-wide">
                      {project.tagline}
                    </p>

                    <p className="text-sm text-ash leading-relaxed mb-5 font-normal">
                      {project.description}
                    </p>

                    {/* Tech & focus tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 text-ash border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer links */}
                <div className="px-6 sm:px-8 pb-6 pt-3 border-t border-white/5 flex items-center justify-between">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white hover:text-ember transition-colors flex items-center gap-1.5"
                    >
                      Visit Website →
                    </a>
                  ) : (
                    <span className="text-xs text-ash/60">Research Project</span>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-ash hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      GitHub Profile →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3D Depth Carousel View */}
        {viewMode === "3d" && (
          <div className="flex flex-col items-center">
            <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] relative overflow-hidden flex items-center justify-center">
              <DepthCarousel
                items={carouselItems}
                cardWidth={440}
                cardHeight={275}
                radius={20}
                spread={95}
                depth={220}
                tilt={20}
                perspective={1300}
                visibleCards={3}
                blur={5}
                onChange={(index) => setActiveCarouselIndex(index)}
              />
            </div>

            {/* Active Project Details Card */}
            <div className="project-card-item mt-8 w-full max-w-3xl p-6 sm:p-8 rounded-2xl bg-obsidian/90 border border-white/10 backdrop-blur-md flex flex-col gap-5 shadow-2xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: activeProject.color }}
                    />
                    <span className="text-xs uppercase tracking-widest text-ash font-medium">
                      Project {activeCarouselIndex + 1} of {PROJECTS.length} · {activeProject.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs text-ember font-medium mt-0.5">
                    {activeProject.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-ember text-white hover:bg-ember-bright transition-colors flex items-center gap-1.5 shadow-md"
                    >
                      Visit Website
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 border border-white/15"
                    >
                      GitHub Profile
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-ash leading-relaxed font-normal">
                {activeProject.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-ash"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
