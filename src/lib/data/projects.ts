export interface Project {
  title: string;
  role: string;
  company: string;
  timeline: string;
  description: string;
  logo: string;
  image?: string;
  website: string;
  detailedInfo: {
    overview: string;
    projects?: string[];
    technologies: string[];
    responsibilities: string[];
  };
}

export const projects: Project[] = [
  {
    title: "AnonHost",
    role: "Founder/Head Developer",
    company: "AnonHost",
    timeline: "July 2024 - Present",
    description:
      "Through developing AnonHost I learned immensely about the process of creating a secure and anonymous file-sharing platform. I am responsible for all aspects of the project, from frontend to backend development.",
    logo: "/projects/anonhost-logo.svg",
    image: "/projects/anonhost.png",
    website: "https://anon.love",
    detailedInfo: {
      overview:
        "Through developing AnonHost I learned immensely about the process of creating a secure and anonymous file-sharing platform. I am responsible for all aspects of the project, from frontend to backend development.",
      projects: [
        "AnonHost - A fast, minimal file-sharing platform",
        "AnonLink - A URL shortener with a focus on simplicity",
        "AnonAPI - Developer-friendly, fully documented API for our services",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "Go",
        "PostgreSQL",
        "Git",
        "R2",
        "Cloudflare",
      ],
      responsibilities: [
        "Frontend development",
        "Backend architecture",
        "Security implementation",
        "User experience design",
        "API development",
        "Database management",
        "Deployment and maintenance",
      ],
    },
  },
  {
    title: "E-Z Docs",
    role: "Head Developer",
    company: "E-Z Docs",
    timeline: "November 2024 - March 2025",
    description:
      "Community driven documentation for the products provided by E-Z services. I am responsible for all aspects of the project, from the frontend to the hours of research I put in.",
    logo: "/projects/e-z.svg",
    image: "/projects/e-zdocs.png",
    website: "https://e-z.wiki",
    detailedInfo: {
      overview:
        "Community driven documentation for the products provided by E-Z services. I am responsible for all aspects of the project, from frontend to the hours of research I put in.",
      projects: ["E-Z Docs - Community driven documentation"],
      technologies: ["React", "TypeScript", "Node.js", "Git", "Vercel"],
      responsibilities: [
        "Frontend development",
        "User experience design",
        "API development",
        "Deployment and maintenance",
        "Information research & proofreading",
        "Community management",
        "Documentation writing",
      ],
    },
  },
];
