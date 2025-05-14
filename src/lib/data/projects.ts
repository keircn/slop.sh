export interface Project {
  role: string;
  company: string;
  timeline: string;
  description: string;
  logo: string;
  website: string;
}

export const projects: Project[] = [
  {
    role: 'Founder/Head Developer',
    company: 'AnonHost',
    timeline: 'July 2024 - Present',
    description:
      'Through developing AnonHost I learned immensely about the process of creating a secure and anonymous file-sharing platform. I am responsible for all aspects of the project, from frontend to backend development.',
    logo: '/projects/anonhost-logo.svg',
    website: 'https://anon.love',
  },
  {
    role: 'Head Developer',
    company: 'E-Z Docs',
    timeline: 'November 2024 - March 2025',
    description:
      'Community driven documentation for the products provided by E-Z services. I am responsible for all aspects of the project, from the frontend to the hours of research I put in.',
    logo: '/projects/e-z.svg',
    website: 'https://e-z.wiki',
  },
];
