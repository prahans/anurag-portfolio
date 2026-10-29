import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card project-card--${project.accent}`} aria-labelledby={`project-${project.id}`}>
      <div className="project-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.category}</span>
      </div>
      <div className="project-copy">
        <h3 id={`project-${project.id}`}>{project.title}</h3>
        <p>{project.description}</p>
        {project.provisional && <span className="project-status">Concept placeholder</span>}
        {(project.githubUrl || project.liveUrl) && (
          <div className="project-links">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub (opens in a new tab)`}>
                <GitHubIcon size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} (opens in a new tab)`}>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
        <ul className="project-tags" aria-label="Technologies">
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </div>
      <div className="project-visual">
        <div className="project-accent" aria-hidden="true" />
        <Image src={project.image} alt={project.imageAlt} width={420} height={330} sizes="(max-width: 600px) 180px, (max-width: 1000px) 35vw, 210px" />
      </div>
    </article>
  );
}
