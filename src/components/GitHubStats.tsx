'use client';

import { motion } from 'framer-motion';
import { FaCode, FaStar, FaCodeBranch } from 'react-icons/fa';
import { Skeleton } from '~/components/ui/skeleton';
import { GitHubStatsProps } from '~/types/GitHub';

export function GitHubStats({
  isLoading,
  stats,
  languages = [],
}: GitHubStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className='border-border hidden h-full flex-col justify-center border-l py-2 pl-6 md:flex'
    >
      <h3 className='text-muted-foreground mb-4 text-sm font-medium'>
        GitHub Stats{' '}
        {isLoading && <span className='ml-2 animate-pulse'>Loading...</span>}
      </h3>
      <div className='space-y-4'>
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
                  {stats.projects} Repositories
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
                <p className='text-sm font-medium'>{stats.stars} Stars</p>
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
                  {stats.contributions} Contributions
                </p>
                <p className='text-muted-foreground text-xs'>Last year</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='border-border mt-6 w-full border-t pt-4'>
        <h4 className='text-muted-foreground mb-3 text-xs font-medium'>
          Top Languages
        </h4>
        {isLoading ? (
          <div className='flex flex-wrap gap-1.5'>
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} className='h-6 w-16 rounded-full' />
              ))}
          </div>
        ) : languages.length > 0 ? (
          <div className='flex flex-wrap gap-1.5'>
            {languages.slice(0, 5).map((lang) => (
              <span
                key={lang.name}
                className='bg-primary/10 text-primary rounded-full px-2 py-1 text-xs'
              >
                {lang.name}
              </span>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-xs'>
            No language data available
          </p>
        )}
      </div>
    </motion.div>
  );
}
