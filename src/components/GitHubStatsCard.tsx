'use client';

import { motion } from 'framer-motion';
import { GitHubStats } from '~/components/GitHubStats';
import { Card, CardContent } from '~/components/ui/card';

interface GitHubStatsCardProps {
  isLoading: boolean;
  stats: {
    repositories: number;
    stars: number;
    contributions: number;
    pullRequests: number;
    issues: number;
    forks: number;
    followers: number;
    following: number;
  };
  languages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export const GitHubStatsCard = ({
  isLoading,
  stats,
  languages,
}: GitHubStatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className='relative mt-6 flex flex-col items-center justify-center'
    >
      <Card className='bg-card/30 w-full max-w-6xl overflow-hidden border-2 backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-8 -left-8 h-32 w-32 rounded-full border' />
          <div className='border-primary/20 absolute -right-10 bottom-10 h-20 w-20 rounded-full border' />
        </div>
        <CardContent className='p-6'>
          <GitHubStats
            isLoading={isLoading}
            stats={stats}
            languages={languages}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
