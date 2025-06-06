'use client';

import { motion } from 'framer-motion';
import { memo, useCallback, useEffect, useState } from 'react';
import { DiscordPresence } from '~/components/DiscordPresence';
import { ProfileInfo } from '~/components/ProfileInfo';
import { RepositoryList } from '~/components/RepositoryList';
import { Card, CardContent } from '~/components/ui/card';
import { Weather } from '~/components/Weather';
import { useMobile } from '~/hooks/useMobile';
import type { GitHubStatsData } from '~/types/GitHub';
import type { HeaderCardProps } from '~/types/HeaderCard';

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

  const fetchGitHubData = useCallback(async () => {
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
      console.error('Failed to fetch GitHub data:', err);
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
    fetchGitHubData();
  }, [fetchGitHubData]);

  useEffect(() => {
    fetchCustomRepos();
  }, [fetchCustomRepos]);

  const isLoadingRepos = isLoading || (usePinnedRepos && isLoadingCustomRepos);

  const displayAvatar = avatarUrl;
  const displayBio = githubData?.user?.bio || bio;

  const handleDiscordConnectionChange = useCallback((connected: boolean) => {
    setDiscordConnected(connected);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col items-center justify-center ${isMobile ? 'px-4' : ''}`}
    >
      <Card className='bg-card/30 relative w-full max-w-6xl overflow-hidden border-2 backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border' />
        </div>

        <CardContent className='mx-auto w-full p-6 pt-0'>
          <div className='mb-6'>
            <ProfileInfo
              name={githubData?.user?.name || name}
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
          </div>

          <div className='mb-6 flex flex-col items-center md:items-end'>
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

          <div className='mt-6'>
            <RepositoryList
              isLoading={isLoadingRepos}
              repositories={githubData?.topRepositories}
              customRepositories={customRepoData || []}
              pinnedRepositories={githubData?.pinnedRepositories}
              usePinnedRepos={usePinnedRepos}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
