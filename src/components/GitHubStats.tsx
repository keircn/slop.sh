'use client';

import { motion } from 'framer-motion';
import {
  FaCode,
  FaStar,
  FaCodeBranch,
  FaUserFriends,
  FaGithub,
  FaExclamationCircle,
} from 'react-icons/fa';
import { Skeleton } from '~/components/ui/skeleton';
import { Progress } from '~/components/ui/progress';
import { Separator } from '~/components/ui/separator';
import type { GitHubStatsProps } from '~/types/GitHub';
import Link from 'next/link';
import { FaCodePullRequest } from 'react-icons/fa6';

export function GitHubStats({
  isLoading,
  stats,
  languages = [],
}: GitHubStatsProps) {
  const {
    repositories = 0,
    stars = 0,
    contributions = 0,
    pullRequests = 0,
    issues = 0,
  } = stats || {};

  const mockFollowers = stats?.followers || 0;
  const mockFollowing = stats?.following || 0;

  const topLanguages = languages.slice(0, 5).map((lang, index) => ({
    ...lang,
    percentage: 100 / (index + 1.5),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className='border-border hidden h-full flex-col justify-start md:flex'
    >
      <h3 className='text-foreground mb-1 flex items-center text-xl font-medium'>
        <FaGithub className='mr-2' />
        GitHub Stats
        {isLoading && <span className='ml-2 animate-pulse'>Loading...</span>}
      </h3>
      <div className='border-border/50 mb-6 -ml-1 max-w-40 border-b' />

      <div className='mb-6 grid grid-cols-2 gap-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaCode size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-24' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>
                  {repositories} Repositories
                </p>
                <p className='text-muted-foreground text-xs'>Created</p>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaStar size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-20' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>{stars} Stars</p>
                <p className='text-muted-foreground text-xs'>Received</p>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaCodeBranch size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-32' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>
                  {contributions} Contributions
                </p>
                <p className='text-muted-foreground text-xs'>Last year</p>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaUserFriends size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-28' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>{mockFollowers} Followers</p>
                <p className='text-muted-foreground text-xs'>
                  {mockFollowing} Following
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='mb-6 grid grid-cols-2 gap-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaCodePullRequest size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-24' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>
                  {pullRequests} Pull Requests
                </p>
                <p className='text-muted-foreground text-xs'>Submitted</p>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 rounded p-2'>
            <FaExclamationCircle size={16} className='text-primary' />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className='mb-1 h-4 w-20' />
                <Skeleton className='h-3 w-16' />
              </>
            ) : (
              <>
                <p className='text-sm font-medium'>{issues} Issues</p>
                <p className='text-muted-foreground text-xs'>Opened</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <h4 className='text-muted-foreground mb-3 text-xs font-medium'>
          Language Distribution
        </h4>
        {isLoading ? (
          <div className='space-y-2'>
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className='space-y-1'>
                  <Skeleton className='h-3 w-20' />
                  <Skeleton className='h-2 w-full' />
                </div>
              ))}
          </div>
        ) : languages.length > 0 ? (
          <div className='space-y-2'>
            {topLanguages.map((lang) => (
              <div key={lang.name} className='space-y-1'>
                <div className='flex justify-between text-xs'>
                  <span>{lang.name}</span>
                  <span>{Math.round(lang.percentage)}%</span>
                </div>
                <Progress value={lang.percentage} className='h-1.5' />
              </div>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-xs'>
            No language data available
          </p>
        )}
      </div>

      <div className='mt-auto pt-4'>
        <Separator className='mb-6' />
        <Link
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || ''}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary flex items-center text-xs hover:underline'
        >
          <FaGithub className='mr-1' size={14} />
          View full GitHub profile
        </Link>
      </div>
    </motion.div>
  );
}
