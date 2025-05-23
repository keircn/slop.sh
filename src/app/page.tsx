'use client';

import dynamic from 'next/dynamic';
import { HeaderCardProps } from '~/lib/data/home';
import { PageTransition } from '~/components/PageTransition';
import { Suspense, useEffect, useState } from 'react';
import { Card } from '~/components/ui/card';
import { Footer } from '~/components/Footer';
import { GitHubActivity } from '~/components/GitHubActivity';
import { GitHubStatsCard } from '~/components/GitHubStatsCard';
import type { GitHubStatsData } from '~/types/GitHub';
import { useMobile } from '~/hooks/useMobile';

const HeaderCard = dynamic(
  () =>
    import('~/components/HeaderCard').then((mod) => ({
      default: mod.HeaderCard,
    })),
  {
    loading: () => (
      <Card className='bg-primary/5 h-[600px] w-full animate-pulse' />
    ),
    ssr: false,
  }
);

// eslint-disable-next-line typescript/no-unused-vars
const ProjectsContainer = dynamic(
  () =>
    import('~/components/ProjectsContainer').then((mod) => ({
      default: mod.ProjectsContainer,
    })),
  {
    loading: () => (
      <Card className='bg-primary/5 h-[400px] w-full animate-pulse' />
    ),
  }
);

export default function Home() {
  const [githubData, setGithubData] = useState<GitHubStatsData | null>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);
  const { isMobile } = useMobile();

  useEffect(() => {
    async function loadGitHubData() {
      setIsLoadingGithub(true);
      try {
        const response = await fetch('/api/github/stats');
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        const data = await response.json();
        setGithubData(data);
      } catch (error) {
        console.error('Failed to load GitHub data for page:', error);
      } finally {
        setIsLoadingGithub(false);
      }
    }
    if (HeaderCardProps[0].links?.github) {
      loadGitHubData();
    } else {
      setIsLoadingGithub(false);
    }
  }, [HeaderCardProps[0].links?.github]);

  return (
    <PageTransition>
      <main className='relative flex min-h-screen w-full flex-col'>
        <div className='container mx-auto mt-16 flex flex-grow flex-col items-center justify-center pb-16'>
          <div className='relative z-10 mt-16 w-full max-w-6xl'>
            <Suspense
              fallback={
                <Card className='bg-primary/5 h-[600px] w-full animate-pulse' />
              }
            >
              <span id='header' />
              <HeaderCard
                name={HeaderCardProps[0].name}
                githubUsername={HeaderCardProps[0].githubUsername}
                title={HeaderCardProps[0].title}
                bio={HeaderCardProps[0].bio}
                avatarUrl={HeaderCardProps[0].avatarUrl}
                discordUserId={HeaderCardProps[0].discordUserId}
                links={HeaderCardProps[0].links}
                usePinnedRepos={HeaderCardProps[0].usePinnedRepos}
                customRepositories={HeaderCardProps[0].customRepositories}
              />
            </Suspense>

            {HeaderCardProps[0].links?.github && !isMobile && (
              <div className='mt-8'>
                <GitHubStatsCard
                  isLoading={isLoadingGithub}
                  stats={{
                    repositories:
                      githubData?.stats.repositories ||
                      HeaderCardProps[0].stats?.projects ||
                      0,
                    stars:
                      githubData?.stats.stars ||
                      HeaderCardProps[0].stats?.stars ||
                      0,
                    contributions:
                      githubData?.stats.contributions ||
                      HeaderCardProps[0].stats?.contributions ||
                      0,
                    pullRequests: githubData?.stats.pullRequests || 0,
                    issues: githubData?.stats.issues || 0,
                    forks: githubData?.stats.forks || 0,
                    followers: githubData?.user?.followers || 0,
                    following: githubData?.user?.following || 0,
                  }}
                  languages={
                    githubData?.languages?.map(
                      (lang: { name: string; count: number }) => ({
                        name: lang.name,
                        count: lang.count,
                        percentage: 0,
                      })
                    ) || []
                  }
                />
              </div>
            )}

            {!isMobile && (
              <div className='mt-8'>
                <Suspense
                  fallback={
                    <Card className='bg-primary/5 h-[200px] w-full animate-pulse' />
                  }
                >
                  <GitHubActivity
                    username={HeaderCardProps[0].githubUsername || ''}
                    showLegend
                    showTotal
                    colorScheme='default'
                    onError={(error) => {
                      console.error('GitHub activity error:', error);
                    }}
                  />
                </Suspense>
              </div>
            )}

            {/* <div className="mt-8">
              <ProjectsContainer title="Projects" projects={projects} />
            </div> */}
          </div>
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}
