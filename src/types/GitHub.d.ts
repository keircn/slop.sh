export type GitHubContributionData = {
  weeks: ContributionWeek[];
  totalContributions: number;
};

export type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

export type ContributionWeek = {
  firstDay: string;
  contributionDays: ContributionDay[];
};

interface GitHubActivityProps {
  username?: string;
  isLoading?: boolean;
}

export interface GitHubStatsProps {
  isLoading: boolean;
  stats: {
    projects: number;
    stars: number;
    contributions: number;
    pullRequests?: number;
    issues?: number;
  };
  languages?: Array<{
    name: string;
    count: number;
  }>;
}
