export interface Repository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
}

export interface RepositoryListProps {
  repositories?: Repository[];
  pinnedRepositories?: Repository[];
  customRepositories?: Repository[];
  isLoading: boolean;
  usePinnedRepos?: boolean;
}
