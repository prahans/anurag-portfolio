import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card project-card--${project.accent}`} aria-labelledby={`project-${project.id}`}>
      <div className="project-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="project-date">{project.date}</span>
        <span className="project-category">{project.category}</span>
      </div>
      <div className="project-copy">
        <h3 id={`project-${project.id}`}>{project.title}</h3>
        <p>{project.description}</p>
        {(project.status || project.provisional) && (
          <span className="project-status">{project.status ?? "Concept placeholder"}</span>
        )}
        <ul className="project-tags" aria-label="Technologies">
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {(project.githubUrl || project.liveUrl) && (
          <div className="project-links">
            {project.githubUrl && (
              <a className="project-link--code" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub (opens in a new tab)`}>
                <GitHubIcon size={16} />
                <span>Source code</span>
              </a>
            )}
            {project.liveUrl && (
              <a className="project-link--live" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.demoLabel ?? "Live demo"}: ${project.title} (opens in a new tab)`}>
                <span>{project.demoLabel ?? "Live demo"}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="project-visual">
        <div className="project-accent" aria-hidden="true" />
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={960}
          height={500}
          sizes="(max-width: 650px) 90vw, (max-width: 900px) 40vw, (max-width: 1200px) 24vw, 310px"
        />
      </div>
    </article>
  );
}
