'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaCode,
  FaCodeBranch,
  FaExclamationCircle,
  FaGithub,
  FaStar,
  FaUserFriends,
} from 'react-icons/fa';
import { FaCodePullRequest } from 'react-icons/fa6';
import { Progress } from '~/components/ui/progress';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import type { GitHubStatsProps } from '~/types/GitHub';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='border-border hidden h-full flex-col justify-start md:flex'
    >
      <motion.h3
        variants={itemVariants}
        className='text-foreground mb-1 flex items-center text-xl font-medium'
      >
        <FaGithub className='mr-2' />
        GitHub Stats
        {isLoading && <span className='ml-2 animate-pulse'>Loading...</span>}
      </motion.h3>
      <motion.div
        variants={itemVariants}
        className='border-border/50 mb-6 -ml-1 max-w-40 border-b'
      />

      <motion.div
        variants={containerVariants}
        className='mb-6 grid grid-cols-2 gap-4'
      >
        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>

        <motion.div variants={itemVariants} className='flex items-center gap-3'>
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
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-6'>
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
          <motion.div variants={containerVariants} className='space-y-2'>
            {topLanguages.map((lang, index) => (
              <motion.div
                key={lang.name}
                variants={itemVariants}
                custom={index}
                className='space-y-1'
              >
                <div className='flex justify-between text-xs'>
                  <span>{lang.name}</span>
                  <span>{Math.round(lang.percentage)}%</span>
                </div>
                <Progress value={lang.percentage} className='h-1.5' />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className='text-muted-foreground text-xs'>
            No language data available
          </p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className='mt-auto pt-4'>
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
      </motion.div>
    </motion.div>
  );
}
