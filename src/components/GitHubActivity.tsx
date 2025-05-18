'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { TbRefresh } from 'react-icons/tb';
import { BiErrorCircle } from 'react-icons/bi';
import type {
  GitHubActivityProps,
  ContributionData,
  ContributionDay,
} from '~/types/GitHub';
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
  const [activeTooltip, setActiveTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: {
      count: number;
      date: string;
    } | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

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

  const handleShowTooltip = (element: HTMLDivElement, day: ContributionDay) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top;

    setActiveTooltip({
      visible: true,
      x: centerX,
      y: topY,
      content: {
        count: day.contributionCount,
        date: day.date,
      },
    });
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    day: ContributionDay
  ) => {
    handleShowTooltip(event.currentTarget, day);
  };

  const handleFocus = (
    event: React.FocusEvent<HTMLDivElement>,
    day: ContributionDay
  ) => {
    handleShowTooltip(event.currentTarget, day);
  };

  const handleHideTooltip = () => {
    setActiveTooltip((prev) => ({ ...prev, visible: false }));
  };

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
          <div className='mx-auto flex w-full flex-col gap-4'>
            <div className='flex w-full flex-wrap items-center justify-between px-2'>
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
                className='h-8'
              >
                <TbRefresh
                  className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className='w-full'>
              <Skeleton className='h-[160px] w-full' />
            </div>
          ) : contributionData ? (
            <div className='relative'>
              {/* Custom tooltip */}
              <AnimatePresence>
                {activeTooltip.visible && activeTooltip.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className='bg-popover text-popover-foreground fixed z-50 rounded-md px-3 py-2 text-sm shadow-md outline-none'
                    style={{
                      left: `${activeTooltip.x}px`,
                      top: `${activeTooltip.y - 10}px`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <div className='flex flex-col items-center gap-1'>
                      <span className='font-semibold'>
                        {activeTooltip.content.count}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        contribution
                        {activeTooltip.content.count !== 1 ? 's' : ''} on{' '}
                        {new Date(
                          activeTooltip.content.date
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div
                      className='bg-popover absolute h-2 w-2 rotate-45'
                      style={{
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className='relative mt-4 flex justify-center'
                style={{ isolation: 'isolate', position: 'relative' }}
              >
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
                    style={{ width: 'fit-content', position: 'relative' }}
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

                    <div className='mt-6 flex' style={{ position: 'relative' }}>
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
                              onMouseEnter={(e) => handleMouseEnter(e, day)}
                              onMouseLeave={handleHideTooltip}
                              onFocus={(e) => handleFocus(e, day)}
                              onBlur={handleHideTooltip}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {showLegend && (
                    <div className='text-muted-foreground border-border mt-4 flex w-full items-center justify-center border-t pt-4 text-xs'>
                      <span className='mr-2'>Less</span>
                      <div className='mx-2 flex gap-[3px]'>
                        <div
                          className='h-[12px] w-[12px] rounded-[4px]'
                          style={{
                            backgroundColor: getContributionColor(
                              0,
                              colorScheme
                            ),
                          }}
                        />
                        <div
                          className='h-[12px] w-[12px] rounded-[4px]'
                          style={{
                            backgroundColor: getContributionColor(
                              1,
                              colorScheme
                            ),
                          }}
                        />
                        <div
                          className='h-[12px] w-[12px] rounded-[4px]'
                          style={{
                            backgroundColor: getContributionColor(
                              4,
                              colorScheme
                            ),
                          }}
                        />
                        <div
                          className='h-[12px] w-[12px] rounded-[4px]'
                          style={{
                            backgroundColor: getContributionColor(
                              7,
                              colorScheme
                            ),
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
