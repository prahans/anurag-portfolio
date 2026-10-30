export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status?: string;
  demoLabel?: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  provisional: boolean;
  accent: "lime" | "orange" | "pink";
};

// Only real projects are listed. Dates reflect GitHub repository activity.
// Add other work here once its screenshot, details, and links are ready.
export const projects: Project[] = [
  {
    id: "patchverdict",
    title: "PatchVerdict",
    description: "AI can suggest a fix, but how do you know it works? PatchVerdict investigates bugs, tests candidate repairs in a sandbox, and makes the evidence behind each verdict easier to inspect.",
    category: "AI · Developer tools",
    date: "Sep–Oct 2026",
    status: "Read-only showcase",
    demoLabel: "Live showcase",
    technologies: ["TypeScript", "Next.js", "E2B"],
    image: "/images/screenshots/patchVerdict.png",
    imageAlt: "Screenshot of the PatchVerdict web application",
    githubUrl: "https://github.com/prahans/patch-verdict",
    liveUrl: "https://patchverdict.duckdns.org/",
    featured: true,
    provisional: false,
    accent: "lime",
  },
  {
    id: "repo-explain",
    title: "RepoExplain",
    description: "A friendlier starting point for unfamiliar codebases. Paste a public GitHub repository to explore its stack, important files, and architecture through structured, streaming AI explanations.",
    category: "AI · Code exploration",
    date: "Sep 2026",
    status: "Public beta",
    demoLabel: "Try it live",
    technologies: ["Next.js", "TypeScript", "MongoDB"],
    image: "/images/screenshots/repoExplain.png",
    imageAlt: "Screenshot of the RepoExplain web application",
    githubUrl: "https://github.com/prahans/repo-explain",
    liveUrl: "https://repo-explain-gamma.vercel.app/",
    featured: true,
    provisional: false,
    accent: "orange",
  },
  {
    id: "the-wild-oasis",
    title: "The Wild Oasis",
    description: "A little getaway begins here. Explore cozy cabins in the Italian Dolomites, choose your dates, and manage your stay from a welcoming guest space.",
    category: "Travel · Cabin reservations",
    date: "Sep 2026",
    demoLabel: "Explore cabins",
    technologies: ["Next.js", "TypeScript", "Supabase"],
    image: "/images/screenshots/the-wild-oasis-website.png",
    imageAlt: "Screenshot of The Wild Oasis luxury cabin reservation website",
    githubUrl: "https://github.com/prahans/The-wild-oasis-website",
    liveUrl: "https://the-wild-oasis-website-zeta-puce.vercel.app/",
    featured: true,
    provisional: false,
    accent: "lime",
  },
  {
    id: "wanderlust",
    title: "WanderLust",
    description: "For the places worth discovering and stories worth sharing. Browse unique stays, find your next favorite spot, and share listings and reviews with fellow travelers.",
    category: "Travel · Listings & reviews",
    date: "Jan–Sep 2026",
    demoLabel: "Explore stays",
    technologies: ["Node.js", "Express", "MongoDB"],
    image: "/images/screenshots/wanderlust.png",
    imageAlt: "Screenshot of WanderLust vacation rental listing and discovery website",
    githubUrl: "https://github.com/prahans/wanderLust",
    liveUrl: "https://wanderlust-okyq.onrender.com/listings",
    featured: true,
    provisional: false,
    accent: "pink",
  },
  {
    id: "worldwise",
    title: "WorldWise",
    description: "Every place has a story. Pin cities on an interactive map, remember where you've been, and collect the little notes that make each journey yours.",
    category: "Travel · Interactive maps",
    date: "Aug 2026",
    demoLabel: "Explore the map",
    technologies: ["React", "Leaflet", "JSON Server"],
    image: "/images/screenshots/worldWise.png",
    imageAlt: "Screenshot of WorldWise, an interactive travel map and city journal",
    githubUrl: "https://github.com/prahans/worldWise",
    liveUrl: "https://world-wise-prahans1.vercel.app/",
    featured: true,
    provisional: false,
    accent: "orange",
  },
  {
    id: "stock-trading-platform",
    title: "Stock Trading Platform",
    description: "A hands-on look inside an investing dashboard: secure accounts, holdings, and positions, with more trading features still taking shape.",
    category: "Finance · Trading dashboard",
    date: "Mar–Sep 2026",
    status: "Still in the making",
    demoLabel: "View website",
    technologies: ["React", "TypeScript", "MongoDB"],
    image: "/images/screenshots/zerodha.png",
    imageAlt: "Screenshot of the stock trading platform website inspired by Zerodha",
    githubUrl: "https://github.com/prahans/full-stack-stock-trading-platform",
    liveUrl: "https://full-stack-stock-trading-platform-f.vercel.app/",
    featured: true,
    provisional: false,
    accent: "lime",
  },
];
