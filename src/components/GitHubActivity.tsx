'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { GitHubActivityProps, ContributionWeek } from '~/types/GitHub';
import {
  getMonthLabels,
  getDayOfWeekLabels,
  getTooltipText,
} from '~/lib/github-utils';

export function GitHubActivity({
  username,
  isLoading: initialLoading = false,
}: GitHubActivityProps) {
  const [contributionData, setContributionData] = useState<{
    weeks: ContributionWeek[];
    totalContributions: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left + 10;
      const y = event.clientY - rect.top - 40;
      setTooltipPosition({ x, y });
    },
    []
  );

  const fetchGitHubActivity = useCallback(async () => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/github/activity?username=${username}`);

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setContributionData(data);
    } catch (err) {
      console.error('Failed to fetch GitHub activity:', err);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubActivity();
  }, [fetchGitHubActivity]);

  const monthLabels = contributionData ? getMonthLabels(contributionData) : [];
  const dayLabels = getDayOfWeekLabels();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className='w-full'
    >
      <Card className='bg-card/30 relative overflow-hidden border-2 backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border' />
        </div>

        <CardContent className='p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-muted-foreground text-sm font-medium'>
              Contribution Activity
              {isLoading && (
                <span className='ml-2 animate-pulse'>Loading...</span>
              )}
            </h3>
            {contributionData && (
              <div className='text-muted-foreground text-sm'>
                {contributionData.totalContributions.toLocaleString()}{' '}
                contributions in the last year
              </div>
            )}
          </div>

          {isLoading ? (
            <div className='w-full'>
              <Skeleton className='h-[160px] w-full' />
            </div>
          ) : contributionData ? (
            <div className='relative overflow-visible'>
              <div className='flex'>
                <div className='text-muted-foreground mr-3 flex shrink-0 flex-col pt-6 text-xs'>
                  {dayLabels.map((day, index) => (
                    <div
                      key={index}
                      className='mb-[4px] h-[12px] pr-3 text-right'
                    >
                      {index % 2 === 0 ? day.day : ''}
                    </div>
                  ))}
                </div>

                <div className='relative w-full flex-1 overflow-visible'>
                  <div className='text-muted-foreground mb-1 flex text-xs'>
                    {monthLabels.map((month, i) => (
                      <div
                        key={i}
                        className='absolute text-center'
                        style={{ left: `${month.index * 16}px` }}
                      >
                        {month.month}
                      </div>
                    ))}
                  </div>

                  <div
                    className='relative mt-6 flex'
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {contributionData.weeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className='mr-[4px] flex flex-col gap-[4px]'
                      >
                        {week.contributionDays.map((day, dayIndex) => (
                          <motion.div
                            key={dayIndex}
                            className='h-[12px] w-[12px] rounded-[4px] transition-colors duration-200'
                            style={{
                              backgroundColor:
                                day.contributionCount === 0
                                  ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
                                  : day.contributionCount <= 3
                                    ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)'
                                    : day.contributionCount <= 6
                                      ? 'color-mix(in srgb, var(--color-primary) 50%, transparent)'
                                      : day.contributionCount <= 9
                                        ? 'color-mix(in srgb, var(--color-primary) 70%, transparent)'
                                        : 'var(--color-primary)',
                            }}
                            onMouseEnter={() => {
                              setTooltipContent(getTooltipText(day));
                              setShowTooltip(true);
                            }}
                            onMouseLeave={() => setShowTooltip(false)}
                            whileHover={{ scale: 1.3 }}
                          />
                        ))}
                      </div>
                    ))}
                    {showTooltip && (
                      <div
                        className='pointer-events-none absolute z-[100]'
                        style={{
                          top: tooltipPosition.y,
                          left: tooltipPosition.x,
                          transform: 'translateY(-100%)',
                        }}
                      >
                        <div className='border-border bg-popover/95 rounded-lg border px-2 py-1 text-xs whitespace-nowrap shadow-md'>
                          {tooltipContent}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='text-muted-foreground border-border mt-4 flex items-center justify-end border-t pt-4 text-xs'>
                    <span className='mr-2'>Less</span>
                    <div className='mx-2 flex gap-[3px]'>
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, var(--color-primary) 50%, transparent)',
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, var(--color-primary) 70%, transparent)',
                        }}
                      />
                      <div className='bg-primary h-[12px] w-[12px] rounded-[4px]' />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-muted-foreground flex h-[160px] items-center justify-center text-sm'>
              No contribution data available
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
