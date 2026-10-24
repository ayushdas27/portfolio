"use client";

import { useMemo } from "react";
import SectionHeading from "./SectionHeading";
import DriftWall, { DriftWallItem } from "./DriftWall";

interface Skill {
  name: string;
  icon: string;
  category: string;
}

const SKILLS: Skill[] = [
  // Programming Languages
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB", category: "Languages" },
  { name: "C", icon: "https://cdn.simpleicons.org/c/A8B9CC", category: "Languages" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6", category: "Languages" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E", category: "Languages" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1", category: "Languages" },

  // AI/ML & Research
  { name: "OpenCV", icon: "https://cdn.simpleicons.org/opencv/5C3EE8", category: "AI & Research" },
  { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy/013243", category: "AI & Research" },
  { name: "Streamlit", icon: "https://cdn.simpleicons.org/streamlit/FF4B4B", category: "AI & Research" },

  // Web Development
  { name: "Django", icon: "https://cdn.simpleicons.org/django/092E20", category: "Web Development" },
  { name: "HTML5", icon: "https://cdn.simpleicons.org/html5/E34F26", category: "Web Development" },
  { name: "CSS3", icon: "https://cdn.simpleicons.org/css/1572B6", category: "Web Development" },

  // Tools & Hardware / Version Control
  { name: "Arduino IDE", icon: "/icons/arduino.svg", category: "Tools" },
  { name: "VS Code", icon: "/icons/vscode.svg", category: "Tools" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032", category: "Tools" },
  { name: "GitHub", icon: "https://cdn.simpleicons.org/github/ffffff", category: "Tools" },
];

export default function Skills() {
  const driftWallItems: DriftWallItem[] = useMemo(() => {
    return SKILLS.map((skill) => ({
      image: "/images/skill-tile-bg.png",
      title: skill.name,
      icon: skill.icon,
    }));
  }, []);

  return (
    <section id="skills" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-iron to-transparent"
        aria-hidden="true"
      />

      <div className="section-container">
        <SectionHeading
          eyebrow="Skills & Tools"
          title="Technical Arsenal"
          subtitle="Technologies and tools I explore and work with across AI/ML, computer vision, programming languages, web development, and research."
          align="center"
        />

        {/* DriftWall 3D animated skills container - full screen full bleed */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-screen overflow-hidden -translate-x-12 sm:-translate-x-16">
          <DriftWall
            items={driftWallItems}
            columns={6}
            tileWidth={210}
            tileHeight={138}
            gap={20}
            tilt={14}
            turn={-16}
            perspective={1000}
            depth={100}
            speed={40}
            direction="up"
            variance={0.4}
            parallax={0.6}
            lift={65}
            fade={0.4}
            dim={0.6}
            overlayColor="#050505"
          />
        </div>
      </div>
    </section>
  );
}
