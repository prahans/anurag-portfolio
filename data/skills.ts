export type Skill = {
  name: string;
  mark: string;
  color: string;
  background?: string;
  icon?: string;
};

// Local SVGs avoid runtime requests. Text marks remain a fallback for future entries.
export const skills: Skill[] = [
  { name: "JavaScript", mark: "JS", color: "#2c291b", background: "#f5dc61", icon: "/images/skills/javascript.svg" },
  { name: "TypeScript", mark: "TS", color: "#ffffff", background: "#3178c6", icon: "/images/skills/typescript.svg" },
  { name: "React", mark: "React", color: "#087e9d", icon: "/images/skills/react.svg" },
  { name: "Next.js", mark: "N", color: "#101522", icon: "/images/skills/nextjs.svg" },
  { name: "Node.js", mark: "node", color: "#438336", icon: "/images/skills/nodejs.svg" },
  { name: "Tailwind CSS", mark: "~", color: "#0597be", icon: "/images/skills/tailwindcss.svg" },
  { name: "MongoDB", mark: "M", color: "#168244", icon: "/images/skills/mongodb.svg" },
  { name: "Supabase", mark: "S", color: "#23996e", icon: "/images/skills/supabase.svg" },
  { name: "Git", mark: "git", color: "#e74c31", icon: "/images/skills/git.svg" },
  { name: "GitHub", mark: "GH", color: "#101522" },
  { name: "VS Code", mark: "</>", color: "#167cbb", icon: "/images/skills/vscode.svg" },
];
