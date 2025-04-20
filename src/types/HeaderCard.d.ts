export interface GitHubStatsData {
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    bio: string;
    company: string | null;
    location: string | null;
    websiteUrl: string | null;
    twitterUsername: string | null;
    followers: number;
    following: number;
  };
  stats: {
    repositories: number;
    stars: number;
    forks: number;
    contributions: number;
    pullRequests: number;
    issues: number;
  };
  languages: Array<{
    name: string;
    count: number;
  }>;
  topRepositories: Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
  }>;
  pinnedRepositories: Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
  }>;
}

export interface HeaderCardProps {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  githubUsername?: string | null;
  discordUserId?: string;
  usePinnedRepos?: boolean;
  customRepositories?: string[];
  links?: {
    discord: string | undefined;
    github?: string;
    email?: string;
    kofi?: string;
  };
  stats?: {
    projects?: number;
    stars?: number;
    contributions?: number;
  };
}
