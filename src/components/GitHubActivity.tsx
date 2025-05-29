'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
import { useMobile } from '~/hooks/useMobile';

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
  const { isMobile } = useMobile();
  const [squareSize, setSquareSize] = useState(12);
  const [squareGap, setSquareGap] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      if (containerWidth > 1200) {
        setSquareSize(16);
        setSquareGap(5);
      } else if (containerWidth > 800) {
        setSquareSize(14);
        setSquareGap(4);
      } else {
        setSquareSize(isMobile ? 10 : 12);
        setSquareGap(isMobile ? 3 : 4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const monthLabels = contributionData ? getMonthLabels(contributionData) : [];
  const dayLabels = getDayOfWeekLabels();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={`flex w-full justify-center ${className}`}
    >
      <Card className='bg-card/30 relative w-full max-w-7xl overflow-hidden border backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 rounded-full border md:h-60 md:w-60 lg:h-80 lg:w-80' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 rounded-full border md:h-32 md:w-32 lg:h-40 lg:w-40' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 rounded-full border md:h-80 md:w-80 lg:h-96 lg:w-96' />
        </div>

        <CardContent className='w-full p-4 md:p-6 lg:p-8' ref={containerRef}>
          <div className='mx-auto flex w-full max-w-[1200px] flex-col'>
            <div className='mb-6 flex w-full items-center justify-between md:mb-8'>
              <div className='text-muted-foreground flex items-center gap-2 text-sm md:text-base lg:text-lg'>
                {contributionData && showTotal && (
                  <span className='font-medium'>
                    {contributionData.totalContributions.toLocaleString()}{' '}
                    contributions in the last year
                  </span>
                )}
                {error && (
                  <div className='text-destructive flex items-center gap-1 md:gap-2'>
                    <BiErrorCircle className='h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6' />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={fetchGitHubActivity}
                disabled={isLoading}
                className='h-9 px-3 text-sm md:h-10 md:px-4 md:text-base lg:h-11'
              >
                <TbRefresh
                  className={`mr-2 h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <Skeleton className='h-[160px] w-full md:h-[200px] lg:h-[240px]' />
            ) : contributionData ? (
              <div className='flex flex-col items-center'>
                <div className='flex'>
                  <div className='text-muted-foreground mr-3 flex shrink-0 flex-col pt-6 text-xs md:mr-4 md:text-sm lg:text-base'>
                    {dayLabels.map((day, index) => (
                      <div
                        key={index}
                        className={`mb-[${squareGap}px] h-[${squareSize}px] pr-3 text-right`}
                        style={{
                          marginBottom: `${squareGap}px`,
                          height: `${squareSize}px`,
                        }}
                      >
                        {index % 2 === 0 ? day.day : ''}
                      </div>
                    ))}
                  </div>

                  <div className='relative overflow-x-auto'>
                    <div
                      className='text-muted-foreground relative mb-1 flex text-xs md:mb-2 md:text-sm lg:text-base'
                      style={{
                        width: `${contributionData.weeks.length * (squareSize + squareGap)}px`,
                      }}
                    >
                      {monthLabels.map((month, i) => (
                        <div
                          key={i}
                          className='absolute text-center'
                          style={{
                            left: `${month.index * (squareSize + squareGap)}px`,
                            fontWeight: 'medium',
                          }}
                        >
                          {month.month}
                        </div>
                      ))}
                    </div>

                    <div
                      className='relative mt-6 flex md:mt-8'
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      {contributionData.weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className='flex flex-col'
                          style={{
                            marginRight: `${squareGap}px`,
                            gap: `${squareGap}px`,
                          }}
                        >
                          {week.contributionDays.map((day, dayIndex) => (
                            <motion.div
                              key={dayIndex}
                              className='relative cursor-pointer transition-colors duration-200'
                              style={{
                                height: `${squareSize}px`,
                                width: `${squareSize}px`,
                                borderRadius: `${Math.max(2, squareSize * 0.3)}px`,
                                backgroundColor: getContributionColor(
                                  day.contributionCount,
                                  colorScheme
                                ),
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: (weekIndex * 7 + dayIndex) * 0.005,
                                duration: 0.3,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              aria-label={getTooltipText(day)}
                              role='gridcell'
                              tabIndex={0}
                              whileHover={{ scale: 1.5, zIndex: 50 }}
                              whileFocus={{ scale: 1.5, zIndex: 50 }}
                              whileTap={{ scale: 1.2 }}
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
                          <div className='border-border bg-popover/95 rounded-lg border px-2 py-1 text-xs whitespace-nowrap shadow-md md:px-3 md:py-2 md:text-sm lg:text-base'>
                            {tooltipContent}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showLegend && (
                  <div className='text-muted-foreground mt-6 flex items-center gap-2 text-xs md:mt-8 md:gap-3 md:text-sm lg:mt-10 lg:text-base'>
                    <span>Less</span>
                    <div
                      className='flex'
                      style={{ gap: `${Math.max(3, squareGap - 1)}px` }}
                    >
                      {[0, 1, 4, 7, 10].map((count, index) => (
                        <div
                          key={index}
                          className='rounded-[4px]'
                          style={{
                            height: `${Math.max(12, squareSize * 0.8)}px`,
                            width: `${Math.max(12, squareSize * 0.8)}px`,
                            borderRadius: `${Math.max(2, squareSize * 0.2)}px`,
                            backgroundColor: getContributionColor(
                              count,
                              colorScheme
                            ),
                          }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-muted-foreground flex h-[160px] items-center justify-center text-sm md:h-[200px] md:text-base lg:h-[240px] lg:text-lg'>
                No contribution data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
