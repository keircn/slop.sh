'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { motion } from 'framer-motion';
import { GitHubStatsData, HeaderCardProps } from '~/types/HeaderCard';
import { ProfileInfo } from '~/components/ProfileInfo';
import { GitHubStats } from '~/components/GitHubStats';
import { RepositoryList } from '~/components/RepositoryList';
import { Weather } from '~/components/Weather';
import { DiscordPresence } from '~/components/DiscordPresence';
import { useMobile } from '~/hooks/useMobile';

export const HeaderCard = memo(function HeaderCard({
  name,
  githubUsername,
  title,
  bio,
  avatarUrl,
  discordUserId,
  usePinnedRepos = false,
  customRepositories = [],
  links = {
    discord: undefined,
    github: undefined,
    email: undefined,
    kofi: undefined,
  },
  stats: propStats,
}: HeaderCardProps) {
  const [githubData, setGithubData] = useState<GitHubStatsData | null>(null);
  const [customRepoData, setCustomRepoData] = useState<Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCustomRepos, setIsLoadingCustomRepos] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const { isMobile } = useMobile();

  const fetchGitHubStats = useCallback(async () => {
    if (!links.github) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/github/stats');

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setGithubData(data);
    } catch (err) {
      console.error('Failed to fetch GitHub stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [links.github]);

  const fetchCustomRepos = useCallback(async () => {
    if (!usePinnedRepos || customRepositories.length === 0 || !links.github) {
      setIsLoadingCustomRepos(false);
      return;
    }

    try {
      setIsLoadingCustomRepos(true);
      const reposList = customRepositories.join(',');
      const response = await fetch(`/api/github/stats?repos=${reposList}`);

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setCustomRepoData(data);
    } catch (err) {
      console.error('Failed to fetch custom repository data:', err);
    } finally {
      setIsLoadingCustomRepos(false);
    }
  }, [usePinnedRepos, customRepositories, links.github]);

  useEffect(() => {
    fetchGitHubStats();
  }, [fetchGitHubStats]);

  useEffect(() => {
    fetchCustomRepos();
  }, [fetchCustomRepos]);

  const isLoadingRepos = isLoading || (usePinnedRepos && isLoadingCustomRepos);

  const stats = {
    projects: githubData?.stats.repositories || propStats?.projects || 0,
    stars: githubData?.stats.stars || propStats?.stars || 0,
    contributions:
      githubData?.stats.contributions || propStats?.contributions || 0,
    pullRequests: githubData?.stats.pullRequests || 0,
    issues: githubData?.stats.issues || 0,
  };

  const displayAvatar = avatarUrl;
  const displayBio = githubData?.user.bio || bio;

  const handleDiscordConnectionChange = useCallback((connected: boolean) => {
    setDiscordConnected(connected);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col justify-center ${isMobile ? 'px-4' : ''}`}
    >
      <Card className='bg-card/30 relative max-w-6xl overflow-hidden border-2 backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border' />
        </div>

        <CardContent className='p-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='flex flex-col space-y-14'>
              <ProfileInfo
                name={githubData?.user.name || name}
                githubUsername={githubUsername}
                title={title}
                bio={displayBio}
                dateOfBirth={new Date('2009-03-25')}
                avatarUrl={displayAvatar}
                links={{
                  github: links.github,
                  email: links.email,
                  kofi: links.kofi,
                  discord: links.discord,
                }}
              />
              {discordUserId ? (
                <DiscordPresence
                  userId={discordUserId}
                  weatherLocation='London,UK'
                  onConnectionChange={handleDiscordConnectionChange}
                  disabled={isLoading || !discordConnected}
                />
              ) : (
                <Weather location='London,UK' />
              )}
            </div>

            <div className='space-y-4'>
              <GitHubStats
                isLoading={isLoading}
                stats={stats}
                languages={githubData?.languages}
              />
            </div>
          </div>

          <RepositoryList
            isLoading={isLoadingRepos}
            repositories={githubData?.topRepositories}
            customRepositories={customRepoData || []}
            pinnedRepositories={githubData?.pinnedRepositories}
            usePinnedRepos={usePinnedRepos}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
});
