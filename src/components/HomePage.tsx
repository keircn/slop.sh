'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { HeaderCardProps } from '~/lib/data/home';
import { PageTransition } from '~/components/PageTransition';
import { AnimatedSection } from '~/components/AnimatedSection';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface HomePageProps {
    initialGitHubData?: GitHubStatsData | null;
}

export function HomePage({ initialGitHubData }: HomePageProps) {
    const [githubData, setGithubData] = useState<GitHubStatsData | null>(
        initialGitHubData || null
    );
    const [isLoadingGithub, setIsLoadingGithub] = useState(!initialGitHubData);
    const { isMobile } = useMobile();

    useEffect(() => {
        if (initialGitHubData || !HeaderCardProps[0].links?.github) {
            setIsLoadingGithub(false);
            return;
        }

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

        loadGitHubData();
    }, [initialGitHubData]);

    return (
        <PageTransition>
            <main className='relative flex min-h-screen w-full flex-col overflow-hidden'>
                {/* Background decorative elements */}
                <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                    <motion.div
                        className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl'
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className='absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/3 blur-3xl'
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -10, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 5
                        }}
                    />
                </div>

                <div className='container relative z-10 mx-auto mt-16 flex flex-grow flex-col items-center justify-center pb-16'>
                    <div className='relative mt-16 w-full max-w-6xl space-y-12'>
                        <AnimatedSection direction="up" delay={0.1} intensity="subtle">
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
                        </AnimatedSection>

                        {HeaderCardProps[0].links?.github && !isMobile && (
                            <AnimatedSection direction="scale" delay={0.3} intensity="subtle">
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
                            </AnimatedSection>
                        )}

                        {HeaderCardProps[0].links?.github && isMobile && (
                            <AnimatedSection direction="up" delay={0.3} intensity="subtle">
                                <Card className='bg-card/30 w-full overflow-hidden border backdrop-blur-sm'>
                                    <div className='p-4'>
                                        <h3 className='text-foreground mb-4 flex items-center text-lg font-medium'>
                                            GitHub Stats
                                        </h3>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <motion.div
                                                className='text-center'
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4, duration: 0.3 }}
                                            >
                                                <p className='text-2xl font-bold text-primary'>
                                                    {githubData?.stats.repositories || 0}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>Repos</p>
                                            </motion.div>
                                            <motion.div
                                                className='text-center'
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5, duration: 0.3 }}
                                            >
                                                <p className='text-2xl font-bold text-primary'>
                                                    {githubData?.stats.stars || 0}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>Stars</p>
                                            </motion.div>
                                            <motion.div
                                                className='text-center'
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6, duration: 0.3 }}
                                            >
                                                <p className='text-2xl font-bold text-primary'>
                                                    {githubData?.stats.contributions || 0}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>Contributions</p>
                                            </motion.div>
                                            <motion.div
                                                className='text-center'
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7, duration: 0.3 }}
                                            >
                                                <p className='text-2xl font-bold text-primary'>
                                                    {githubData?.user?.followers || 0}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>Followers</p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </Card>
                            </AnimatedSection>
                        )}

                        {!isMobile && (
                            <AnimatedSection direction="blur" delay={0.5} duration={0.8}>
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
                            </AnimatedSection>
                        )}

                        {/* Future projects section with staggered animation */}
                        {/* <AnimatedSection direction="up" delay={0.7} stagger>
                            <ProjectsContainer title="Projects" projects={projects} />
                        </AnimatedSection> */}
                    </div>
                </div>

                <AnimatedSection direction="fade" delay={0.8}>
                    <Footer />
                </AnimatedSection>
            </main>
        </PageTransition>
    );
}
