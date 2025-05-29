'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCodeBranch, FaStar } from 'react-icons/fa';
import { Skeleton } from '~/components/ui/skeleton';
import { RepositoryListProps } from '~/types/Repository';

export function RepositoryList({
  repositories,
  customRepositories = [],
  isLoading,
  usePinnedRepos = false,
}: RepositoryListProps) {
  const displayRepositories = usePinnedRepos
    ? customRepositories && customRepositories.length > 0
      ? customRepositories
      : []
    : repositories;
  const displayTitle = usePinnedRepos
    ? 'Featured Repositories'
    : 'Top Repositories';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className='border-border mt-6 border-t pt-6'
    >
      <h3 className='mb-3 text-sm font-medium'>{displayTitle}</h3>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {isLoading ? (
          <>
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <RepositorySkeleton key={idx} />
              ))}
          </>
        ) : displayRepositories && displayRepositories.length > 0 ? (
          displayRepositories.slice(0, 4).map((repo) => (
            <Link
              key={repo.name}
              href={repo.url}
              target='_blank'
              rel='noopener noreferrer'
              className='border-border hover:bg-primary/5 rounded border p-3 transition-colors'
            >
              <h4 className='text-sm font-medium'>{repo.name}</h4>
              {repo.description && (
                <p className='text-muted-foreground mt-1 line-clamp-1 text-xs'>
                  {repo.description}
                </p>
              )}
              <div className='text-muted-foreground mt-2 flex items-center gap-3 text-xs'>
                <span className='flex items-center gap-1'>
                  <FaStar size={12} />
                  {repo.stars}
                </span>
                <span className='flex items-center gap-1'>
                  <FaCodeBranch size={12} />
                  {repo.forks}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className='border-border text-muted-foreground col-span-2 rounded-lg border p-3 text-center text-sm'>
            No repositories found
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RepositorySkeleton() {
  return (
    <div className='border-border rounded-lg border p-3'>
      <Skeleton className='mb-2 h-5 w-1/2' />
      <Skeleton className='mb-3 h-3 w-5/6' />
      <div className='flex items-center gap-3'>
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-3 w-16' />
      </div>
    </div>
  );
}
