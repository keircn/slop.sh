'use client';

import { useEffect, useState } from 'react';
import { GitHubStats } from '~/components/GitHubStats';
import type { GitHubStatsData } from '~/types/GitHub';

export function GitHubStatsContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GitHubStatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/github');

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub stats: ${response.status}`);
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch GitHub stats'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  if (error) {
    return (
      <div className='text-sm text-red-500'>
        Error loading GitHub stats: {error}
      </div>
    );
  }

  return (
    <GitHubStats
      isLoading={isLoading}
      stats={data?.stats || { repositories: 0, stars: 0, contributions: 0 }}
      languages={data?.languages || []}
    />
  );
}
