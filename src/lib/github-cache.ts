import { GitHubStatsData } from "~/types/HeaderCard";

type CacheEntry = {
    data: GitHubStatsData;
    timestamp: number;
};

class GitHubStatsCache {
    private cache: Record<string, CacheEntry> = {};
    private readonly TTL_MS = 60 * 60 * 1000;

    get(username: string): GitHubStatsData | null {
        const entry = this.cache[username];

        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > this.TTL_MS) {
            delete this.cache[username];
            return null;
        }

        return entry.data;
    }

    set(username: string, data: GitHubStatsData): void {
        this.cache[username] = {
            data,
            timestamp: Date.now()
        };
    }
}

const githubCache = new GitHubStatsCache();

export default githubCache;