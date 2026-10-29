export type Skill = {
  name: string;
  mark: string;
  color: string;
  background?: string;
};

// Text marks are intentionally used where a brand icon is not included.
export const skills: Skill[] = [
  { name: "JavaScript", mark: "JS", color: "#2c291b", background: "#f5dc61" },
  { name: "TypeScript", mark: "TS", color: "#ffffff", background: "#3178c6" },
  { name: "React", mark: "React", color: "#087e9d" },
  { name: "Next.js", mark: "N", color: "#101522" },
  { name: "Node.js", mark: "node", color: "#438336" },
  { name: "Tailwind CSS", mark: "~", color: "#0597be" },
  { name: "MongoDB", mark: "M", color: "#168244" },
  { name: "Supabase", mark: "S", color: "#23996e" },
  { name: "Git", mark: "git", color: "#e74c31" },
  { name: "GitHub", mark: "GH", color: "#101522" },
  { name: "VS Code", mark: "</>", color: "#167cbb" },
];
