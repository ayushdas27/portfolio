"use client";

import { useState, useCallback, useEffect } from "react";
import SmoothScroll from "@/lib/smooth-scroll";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import StaggeredMenu from "@/components/StaggeredMenu";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      {/* Loading screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Scroll progress bar */}
      {!isLoading && <ScrollProgress />}

      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Navigation — StaggeredMenu stacked on left side */}
      {!isLoading && (
        <StaggeredMenu
          position="left"
          items={[
            { label: "About", ariaLabel: "Go to About section", link: "#about" },
            { label: "Foundation", ariaLabel: "Go to Foundation section", link: "#education" },
            { label: "Skills", ariaLabel: "Go to Skills section", link: "#skills" },
            { label: "Projects", ariaLabel: "Go to Projects section", link: "#projects" },
            { label: "Journey & Achievements", ariaLabel: "Go to Journey & Achievements section", link: "#experience" },
            { label: "Contact", ariaLabel: "Go to Contact section", link: "#contact" },
          ]}
          socialItems={[
            { label: "GitHub", link: "https://github.com/ayushdas27" },
            { label: "LinkedIn", link: "https://www.linkedin.com/in/ayushdasofficial27112007" },
            { label: "Twitter", link: "https://x.com/das_ayushh" },
            { label: "Instagram", link: "https://www.instagram.com/yu.shhh_" },
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          colors={["#0d0d0f", "#1e1e24"]}
          accentColor="#A02A22"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#A02A22"
        />
      )}

      {/* Main content */}
      <SmoothScroll>
        <main>
          {/* Hero — cinematic editorial 3D animated section */}
          <Hero />

          {/* Philosophy scroll-expand transition */}
          <Introduction />

          {/* About — portrait spotlight, bio narrative, stats counters & journey */}
          <About />

          {/* Foundation — academic degree, technical areas, hackathon award & verified metrics */}
          <Education />

          {/* Skills — full interactive 3D DriftWall */}
          <Skills />

          {/* Projects — 3D depth carousel + grid view */}
          <Projects />

          {/* Journey & Achievements — interactive milestones */}
          <Experience />

          {/* Contact — contact form, direct channels & status */}
          <Contact />
        </main>
      </SmoothScroll>

      {/* Floating Interactive Chat Box & Assistant */}
      {!isLoading && <ChatBox />}
    </>
  );
}
