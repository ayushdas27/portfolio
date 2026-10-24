"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);

      if (navRef.current) {
        if (currentY > lastScrollY.current && currentY > 200) {
          gsap.to(navRef.current, { y: -100, duration: 0.4, ease: "power2.out" });
        } else {
          gsap.to(navRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = ["projects", "experience", "contact"];
    const triggers = sections.map((id) => {
      return ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
          isScrolled ? "glass-strong" : ""
        }`}
        style={{
          padding: isScrolled ? "12px 0" : "20px 0",
        }}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="relative z-10 text-white font-bold text-xl tracking-tight"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="text-ember">A</span>D
            <span className="text-ember">.</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-sm tracking-wide transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? "text-ember"
                    : "text-ash hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-ember rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              bg-ember text-void hover:bg-ember-bright transition-colors duration-300"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="w-2 h-2 bg-void rounded-full animate-pulse" />
            Let&apos;s Talk
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden relative z-[10001] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9989] bg-void/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="text-3xl font-bold text-white hover:text-ember transition-colors"
            style={{
              fontFamily: "var(--font-display)",
              transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
              transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
              opacity: mobileOpen ? 1 : 0,
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {link.label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          className="mt-4 px-8 py-4 rounded-full bg-ember text-void font-medium text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&apos;s Talk
        </a>
      </div>
    </>
  );
}
