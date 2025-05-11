export type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

export type ContributionWeek = {
  firstDay: string;
  contributionDays: ContributionDay[];
};

export type GitHubContributionData = {
  weeks: ContributionWeek[];
  totalContributions: number;
};
