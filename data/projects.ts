export type ProjectGroup = "ai-tools" | "travel" | "apps";

export type Project = {
  id: string;
  title: string;
  description: string;
  handwrittenNote?: string;
  category: string;
  group: ProjectGroup;
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
    description: "An AI-suggested fix is only a starting point. PatchVerdict checks controlled bugs, tests candidate patches, and brings the logs, diffs, and verdicts together so the evidence is easier to review.",
    handwrittenNote: "Evidence first.",
    category: "AI · Developer tools",
    group: "ai-tools",
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
    description: "New codebases can feel like a maze. RepoExplain turns a public GitHub link into a guided look at the tech stack, key files, and architecture, with AI explanations delivered as you explore.",
    handwrittenNote: "Find your way through code.",
    category: "AI · Code exploration",
    group: "ai-tools",
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
    description: "Plan a little escape to the Italian Dolomites. Explore cabins, choose your dates, make a reservation, and manage your stay from a dedicated guest account.",
    handwrittenNote: "A little room to unwind.",
    category: "Travel · Cabin reservations",
    group: "travel",
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
    description: "A place for stays worth discovering. Browse and filter listings, share reviews, or sign in to publish and manage a getaway of your own.",
    handwrittenNote: "Places worth finding.",
    category: "Travel · Listings & reviews",
    group: "travel",
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
    description: "A personal travel journal with a map at its heart. Save cities you’ve visited, add dates and notes, and revisit the memories behind each stop.",
    handwrittenNote: "A pin for every memory.",
    category: "Travel · Interactive maps",
    group: "travel",
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
    description: "A stock-trading practice project with account access and a dashboard for holdings and positions. Order flows and deeper analytics are still in development.",
    handwrittenNote: "Learning the moving parts.",
    category: "Finance · Trading dashboard",
    group: "apps",
    date: "Mar–Sep 2026",
    status: "In development",
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
  {
    id: "wild-oasis-admin",
    title: "Wild Oasis Admin",
    description: "Behind every welcoming stay is a team keeping things running. This dashboard brings cabin management, bookings, guest details, and business insights into one place.",
    handwrittenNote: "Behind the welcome.",
    category: "Hospitality · Admin dashboard",
    group: "travel",
    date: "Aug–Sep 2026",
    demoLabel: "View dashboard",
    technologies: ["React", "Supabase", "React Query"],
    image: "/images/screenshots/the-wild-oasis.png",
    imageAlt: "Screenshot of the Wild Oasis cabin management and administration dashboard",
    githubUrl: "https://github.com/prahans/The-wild-oasis",
    liveUrl: "https://the-wild-oasis-prahans.netlify.app/",
    featured: true,
    provisional: false,
    accent: "pink",
  },
  {
    id: "fast-react-pizza",
    title: "Fast React Pizza",
    description: "From first craving to order confirmation: explore the pizza menu, adjust your cart, place an order, and look up its details when you need them.",
    handwrittenNote: "Dinner starts here.",
    category: "Food · Online ordering",
    group: "apps",
    date: "Aug 2026",
    demoLabel: "Order pizza",
    technologies: ["React", "Redux Toolkit", "Tailwind CSS"],
    image: "/images/screenshots/fast-react-pizza.png",
    imageAlt: "Screenshot of the Fast React Pizza online pizza ordering application",
    githubUrl: "https://github.com/prahans/FAST-REACT-PIZZA",
    liveUrl: "https://fast-react-pizza-x5su.vercel.app/",
    featured: true,
    provisional: false,
    accent: "orange",
  },
];
