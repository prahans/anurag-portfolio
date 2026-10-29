import { MoveRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedWork() {
  return (
    <section id="work" className="featured-work section-divider" aria-labelledby="work-heading">
      <div className="container">
        <Reveal className="work-heading-row">
          <SectionHeading number="02" title="Featured Work" id="work-heading" />
          <MoveRight className="heading-arrow" size={37} strokeWidth={1} aria-hidden="true" />
          <p>A few things I&apos;ve been building, exploring,<br className="desktop-break" /> and learning along the way.</p>
          <span className="work-note">A little more to come</span>
        </Reveal>
        <div className="project-grid">
          {projects.filter((project) => project.featured).map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
