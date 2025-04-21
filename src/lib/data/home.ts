import { HeaderCardProps as HeaderCardPropsType } from "~/types/HeaderCard";

export const HeaderCardProps: HeaderCardPropsType[] = [
  {
    name: "Keiran",
    githubUsername: "yourusername",
    title: "Full Stack Developer",
    bio: "I'm passionate about building high-quality web applications using modern technologies. I enjoy working with React, TypeScript, and exploring new frameworks.",
    avatarUrl: "https://github.com/yourusername.png",
    usePinnedRepos: true,
    customRepositories: [
      "yourusername/personal-website",
      "yourusername/project-manager",
      "yourusername/chat-app",
    ],
    links: {
      github: "https://github.com/yourusername",
      email: "mailto:hello@example.com",
      kofi: "https://ko-fi.com/yourusername",
      discord: "https://discord.com/users/yourdiscordid",
    },
    discordUserId: "yourdiscordid",
    stats: {
      projects: 12,
      stars: 45,
      contributions: 280,
    },
  },
];
