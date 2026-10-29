import type { CSSProperties } from "react";
import Image from "next/image";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { skills } from "@/data/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TechStack() {
  return (
    <section id="skills" className="tech-section" aria-labelledby="skills-heading">
      <Reveal delay={0.1}>
        <div className="tech-heading-row">
          <SectionHeading number="04" title="Tech Stack" id="skills-heading" />
          <span className="tech-caption">Tools I work with</span>
        </div>
        <ul className="skills-grid" aria-label="Technology stack">
          {skills.map((skill) => (
            <li key={skill.name} className="skill-item" title={skill.name}>
              <span className="skill-tile" style={{ "--skill-color": skill.color, "--skill-background": skill.background || "transparent" } as CSSProperties} aria-hidden="true">
                {skill.name === "GitHub" ? <GitHubIcon size={27} /> : skill.icon ? <Image src={skill.icon} alt="" width={27} height={27} /> : <span className={`skill-mark ${skill.mark.length > 2 ? "skill-mark--word" : ""}`}>{skill.mark}</span>}
              </span>
              <span className="skill-name">{skill.name === "Tailwind CSS" ? "Tailwind" : skill.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
