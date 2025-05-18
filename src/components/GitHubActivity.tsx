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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      setIsLoading(true);
      const response = await fetch(`/api/github/activity?username=${username}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GitHub activity: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setContributionData(data);
    } catch (err) {
      console.error('Failed to fetch GitHub activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub activity');
      setContributionData(null);
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
      className='w-full flex justify-center'
    >
      <Card className='bg-card/30 relative overflow-hidden border-2 backdrop-blur-sm w-full max-w-6xl'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border' />
        </div>

        <CardContent className='p-6 w-full'>
          <div className='mx-auto w-full flex flex-col gap-4'>
            {contributionData && (
              <div className='flex flex-wrap items-center justify-between w-full px-2'>
                <div className='text-muted-foreground text-sm'>
                  <span>
                    {contributionData.totalContributions.toLocaleString()}{' '}
                    contributions in the last year
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className='text-red-500 text-sm'>
                {error}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className='w-full'>
              <Skeleton className='h-[160px] w-full' />
            </div>
          ) : contributionData ? (
            <div className='relative overflow-visible flex justify-center mt-4'>
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

                <div className='relative overflow-visible' style={{ width: 'fit-content' }}>
                  <div className='text-muted-foreground mb-1 flex text-xs relative' style={{ width: `${Math.max(...monthLabels.map(m => m.index)) * 16 + 100}px` }}>
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
                          <motion.button
                            key={dayIndex}
                            className='h-[12px] w-[12px] rounded-[4px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
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
                            onFocus={() => {
                              setTooltipContent(getTooltipText(day));
                              setShowTooltip(true);
                            }}
                            onBlur={() => setShowTooltip(false)}
                            aria-label={getTooltipText(day)}
                            role="gridcell"
                            tabIndex={0}
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
                        <div
                          className='border-border bg-popover/95 rounded-lg border px-3 py-2 text-xs whitespace-nowrap shadow-lg'
                          role="tooltip"
                          aria-live="polite"
                        >
                          <div className='flex flex-col gap-1'>
                            <div>{tooltipContent}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='text-muted-foreground border-border mt-4 flex items-center justify-center border-t pt-4 text-xs w-full'>
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
