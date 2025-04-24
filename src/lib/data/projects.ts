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
];
