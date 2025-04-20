"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import { GitHubStatsData, HeaderCardProps } from "~/types/HeaderCard";
import { ProfileInfo } from "~/components/ProfileInfo";
import { GitHubStats } from "~/components/GitHubStats";
import { RepositoryList } from "~/components/RepositoryList";
import { DiscordPresence } from "~/components/DiscordPresence";

export function HeaderCard({
  name,
  githubUsername,
  title,
  bio,
  avatarUrl,
  usePinnedRepos = false,
  customRepositories = [],
  links = {
    discord: undefined,
    github: undefined,
    email: undefined,
    kofi: undefined,
  },
  discordUserId = "",
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
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      if (!links.github) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/github/stats");

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setGithubData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch GitHub stats:", err);
        setError("Could not load GitHub stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubStats();
  }, [links.github]);

  useEffect(() => {
    const fetchCustomRepos = async () => {
      if (!usePinnedRepos || customRepositories.length === 0 || !links.github) {
        setIsLoadingCustomRepos(false);
        return;
      }

      try {
        setIsLoadingCustomRepos(true);
        const reposList = customRepositories.join(",");
        const response = await fetch(`/api/github/stats?repos=${reposList}`);

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setCustomRepoData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch custom repository data:", err);
        setError("Could not load custom repositories");
      } finally {
        setIsLoadingCustomRepos(false);
      }
    };

    fetchCustomRepos();
  }, [usePinnedRepos, customRepositories, links.github]);

  const isLoadingRepos = isLoading || (usePinnedRepos && isLoadingCustomRepos);

  const stats = {
    projects: githubData?.stats.repositories || propStats?.projects || 0,
    stars: githubData?.stats.stars || propStats?.stars || 0,
    contributions:
      githubData?.stats.contributions || propStats?.contributions || 0,
    pullRequests: githubData?.stats.pullRequests || 0,
    issues: githubData?.stats.issues || 0,
  };

  const displayAvatar = githubData?.user.avatarUrl || avatarUrl;
  const displayBio = githubData?.user.bio || bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col justify-center min-h-[70vh]"
    >
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-xl" />

      <Card className="overflow-hidden border-2 relative backdrop-blur-sm">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 border border-primary/30 rounded-full" />
          <div className="absolute top-20 -right-8 w-24 h-24 border border-primary/20 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-primary/20 rounded-full" />
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-14">
              <ProfileInfo
                name={githubData?.user.name || name}
                githubUsername={githubUsername}
                title={title}
                bio={displayBio}
                avatarUrl={displayAvatar}
                links={{
                  github: links.github,
                  email: links.email,
                  kofi: links.kofi,
                  discord: links.discord,
                }}
              />

              <DiscordPresence userId={discordUserId} />
            </div>

            <div className="space-y-4">
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
}
