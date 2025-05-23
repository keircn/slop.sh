import { GitHubStatsData } from '~/types/HeaderCard';
import type { ContributionData } from '~/types/GitHub';

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class GitHubCache<T> {
  private cache: Record<string, CacheEntry<T>> = {};
  private readonly TTL_MS: number;

  constructor(ttlMs: number = 24 * 60 * 60 * 1000) {
    this.TTL_MS = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.cache[key];

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.TTL_MS) {
      delete this.cache[key];
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }
}

export type LatestCommitData = {
  message: string;
  date: string;
  hash: string;
};

const githubStatsCache = new GitHubCache<GitHubStatsData>();
const githubContributionsCache = new GitHubCache<ContributionData>(3600 * 1000);
const githubLatestCommitCache = new GitHubCache<LatestCommitData>(3600 * 1000);

export { githubStatsCache, githubContributionsCache, githubLatestCommitCache };
