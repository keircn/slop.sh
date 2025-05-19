'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { TbRefresh } from 'react-icons/tb';
import { BiErrorCircle } from 'react-icons/bi';
import type { GitHubActivityProps, ContributionData } from '~/types/GitHub';
import {
  getMonthLabels,
  getDayOfWeekLabels,
  getTooltipText,
  getContributionColor,
} from '~/lib/github-utils';

export function GitHubActivity({
  username,
  isLoading: initialLoading = false,
  colorScheme = 'default',
  showLegend = true,
  showTotal = true,
  className = '',
  onError,
}: GitHubActivityProps) {
  const [contributionData, setContributionData] =
    useState<ContributionData | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const [tooltipContent, setTooltipContent] = useState<string>('');
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
      setError('Username is required');
      onError?.('Username is required');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(
        `/api/github/activity?username=${encodeURIComponent(username)}`
      );

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
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch GitHub activity';
      setError(errorMessage);
      onError?.(errorMessage);
      setContributionData(null);
    } finally {
      setIsLoading(false);
    }
  }, [username, onError]);

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
      className={`flex w-full justify-center ${className}`}
    >
      <Card className='bg-card/30 relative w-full max-w-6xl overflow-hidden border backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border' />
        </div>

        <CardContent className='w-full p-6'>
          <div className='mx-auto flex w-full max-w-[800px] flex-col'>
            <div className='mb-6 flex w-full items-center justify-between'>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                {contributionData && showTotal && (
                  <span>
                    {contributionData.totalContributions.toLocaleString()}{' '}
                    contributions in the last year
                  </span>
                )}
                {error && (
                  <div className='text-destructive flex items-center gap-1'>
                    <BiErrorCircle className='h-4 w-4' />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={fetchGitHubActivity}
                disabled={isLoading}
                className='h-9 px-3'
              >
                <TbRefresh
                  className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <Skeleton className='h-[160px] w-full' />
            ) : contributionData ? (
              <div className='flex flex-col items-center'>
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

                  <div
                    className='relative overflow-visible'
                    style={{ width: 'fit-content' }}
                  >
                    <div
                      className='text-muted-foreground relative mb-1 flex text-xs'
                      style={{
                        width: `${Math.max(...monthLabels.map((m) => m.index)) * 16 + 100}px`,
                      }}
                    >
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
                              className='relative h-[12px] w-[12px] cursor-pointer rounded-[4px] transition-colors duration-200'
                              style={{
                                backgroundColor: getContributionColor(
                                  day.contributionCount,
                                  colorScheme
                                ),
                              }}
                              aria-label={getTooltipText(day)}
                              role='gridcell'
                              tabIndex={0}
                              whileHover={{ scale: 1.5, zIndex: 50 }}
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 10,
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
                  </div>
                </div>

                {showLegend && (
                  <div className='text-muted-foreground mt-6 flex items-center gap-2 text-xs'>
                    <span>Less</span>
                    <div className='flex gap-[3px]'>
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor: getContributionColor(0, colorScheme),
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor: getContributionColor(1, colorScheme),
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor: getContributionColor(4, colorScheme),
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor: getContributionColor(7, colorScheme),
                        }}
                      />
                      <div
                        className='h-[12px] w-[12px] rounded-[4px]'
                        style={{
                          backgroundColor: getContributionColor(
                            10,
                            colorScheme
                          ),
                        }}
                      />
                    </div>
                    <span>More</span>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-muted-foreground flex h-[160px] items-center justify-center text-sm'>
                No contribution data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
