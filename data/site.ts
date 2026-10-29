// Personal details and optional actions live here. Unconfigured contact links stay hidden.
export const site = {
  name: "Anurag Panuhar",
  role: "Full-Stack Developer",
  location: "Nepal",
  github: "https://github.com/prahans",
  email: "prahanspanuhar4@gmail.com",
  linkedin: "https://www.linkedin.com/in/anurag-panuhar-786265381/",
  phone: "+9779707108983",
  phoneDisplay: "+977 9707108983",
  resume: undefined as string | undefined,
  heroWorkspaceSrc: "/images/hero/workspace-v1.webp",
  heroWorkspaceAlt: "A sunlit developer workspace with a laptop displaying code and a product interface, an open notebook, a mug, books, plants, a camera, and a Nepal mountain postcard.",
  greeting: "Hi there! I’m Anurag.",
  introduction: "I’m a full-stack developer who enjoys turning ideas into useful, real-world products. I love working on projects that solve meaningful problems and bring a little more clarity, joy, and convenience to people’s everyday lives.",
  about: "I’m a developer who genuinely enjoys creating things for the web. I like working on projects that solve real problems and make people’s lives a bit easier. When I’m not coding, you’ll probably find me exploring new ideas, learning something new, or enjoying a cup of coffee.",
  contact: "I’m always happy to connect, exchange ideas, or talk about interesting projects and opportunities.",
};

export const navigation = [
  { id: "home", label: "Home", number: "01" },
  { id: "work", label: "Work", number: "02" },
  { id: "about", label: "About", number: "03" },
  { id: "skills", label: "Skills", number: "04" },
  { id: "contact", label: "Contact", number: "05" },
] as const;
