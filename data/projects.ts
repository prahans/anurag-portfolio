export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  provisional: boolean;
  accent: "lime" | "orange" | "pink";
};

// These are configurable content placeholders, not claims about completed work.
// Add real screenshots and URLs, then set provisional to false when ready.
export const projects: Project[] = [
  {
    id: "developer-toolkit",
    title: "Developer Toolkit",
    description: "A place for tools that make building for the web a little easier.",
    category: "Developer tools",
    technologies: ["Next.js", "TypeScript"],
    image: "/images/projects/developer-tools.svg",
    imageAlt: "Illustrative concept of a code editor, not a finished application",
    featured: true,
    provisional: true,
    accent: "lime",
  },
  {
    id: "everyday-web",
    title: "Everyday Web",
    description: "A space for useful web experiences built around everyday needs.",
    category: "Full-stack · Web",
    technologies: ["React", "Supabase"],
    image: "/images/projects/everyday-web.svg",
    imageAlt: "Illustrative concept of a nature-inspired website, not a finished application",
    featured: true,
    provisional: true,
    accent: "orange",
  },
  {
    id: "clearer-picture",
    title: "A Clearer Picture",
    description: "A place to explore simple ways of making complex information useful.",
    category: "Data · Interfaces",
    technologies: ["React", "Node.js"],
    image: "/images/projects/useful-data.svg",
    imageAlt: "Illustrative concept of a data dashboard, not a finished application",
    featured: true,
    provisional: true,
    accent: "pink",
  },
];
