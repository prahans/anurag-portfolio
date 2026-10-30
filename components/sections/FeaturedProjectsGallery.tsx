"use client";

import { useState } from "react";
import { projects, type ProjectGroup } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

type Filter = "all" | ProjectGroup;

const featuredProjects = projects.filter((project) => project.featured);
const filters: { id: Filter; title: string }[] = [
  { id: "all", title: "All projects" },
  { id: "ai-tools", title: "AI & tools" },
  { id: "travel", title: "Travel & stays" },
  { id: "apps", title: "Apps & dashboards" },
];

export function FeaturedProjectsGallery() {
  const [active, setActive] = useState<Filter>("all");
  const visible = active === "all"
    ? featuredProjects
    : featuredProjects.filter((project) => project.group === active);

  return (
    <div className="project-gallery">
      <div className="project-collection">
        <div className="project-collection-copy">
          <span className="project-collection-mark" aria-hidden="true">✳</span>
          <span className="project-collection-label">Personal projects</span>
          <span className="project-collection-separator" aria-hidden="true">/</span>
          <span className="project-collection-note">Curiosity, put to work.</span>
        </div>
        <span className="project-collection-total">
          {String(featuredProjects.length).padStart(2, "0")} selected builds
        </span>
      </div>

      <div className="project-filter-bar">
        <div className="project-filters" role="group" aria-label="Browse projects by category">
          {filters.map(({ id, title }) => {
            const count = id === "all"
              ? featuredProjects.length
              : featuredProjects.filter((project) => project.group === id).length;
            return (
              <button
                key={id}
                type="button"
                className="project-filter"
                aria-label={`Show ${title.toLowerCase()} (${count})`}
                aria-pressed={active === id}
                aria-controls="project-results"
                onClick={() => setActive(id)}
              >
                <span>{title}</span>
                <span className="project-filter-count" aria-hidden="true">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="project-filter-status" role="status" aria-live="polite" aria-atomic="true">
          Showing {visible.length} of {featuredProjects.length}
        </p>
      </div>

      <div className="project-grid" id="project-results">
        {visible.map((project, index) => (
          <Reveal key={project.id} delay={Math.min(index, 3) * 0.08}>
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
