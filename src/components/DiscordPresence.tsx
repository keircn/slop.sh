'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDiscord } from 'react-icons/fa';
import { MdRefresh, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { useMobile } from '~/hooks/useMobile';
import { Weather } from '~/components/Weather';
import { z } from 'zod';
import { useDiscordPresence } from '~/hooks/useDiscordPresence';

const discordPresencePropsSchema = z.object({
  userId: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  onConnectionChange: z
    .function()
    .args(z.boolean())
    .returns(z.void())
    .optional(),
  weatherLocation: z.string().optional().default('London,UK'),
});

type DiscordPresenceProps = z.infer<typeof discordPresencePropsSchema>;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export function DiscordPresence(rawProps: DiscordPresenceProps) {
  const props = discordPresencePropsSchema.parse(rawProps);
  const {
    userId,
    disabled = false,
    weatherLocation = 'London,UK',
    onConnectionChange,
  } = props;

  const { presence, isConnected, isLoading, error, retryConnection } =
    useDiscordPresence(userId);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [, setIsVisible] = useState(true);
  const [showWeatherFallback, setShowWeatherFallback] = useState(false);

  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useMobile();

  const formatElapsedTime = useCallback((startTime: Date | null): string => {
    if (!startTime) return '';

    if (!(startTime instanceof Date) || isNaN(startTime.getTime())) {
      return '';
    }

    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      case 'offline':
      default:
        return 'bg-gray-500';
    }
  }, []);

  const getMaxActivityHeight = useCallback((): string => {
    if (!presence || !presence.activities || presence.activities.length === 0)
      return 'auto';
    return isMobile ? '8rem' : '10rem';
  }, [presence, isMobile]);

  const rotateActivity = useCallback(
    (direction: 'next' | 'prev' = 'next') => {
      if (!presence || !presence.activities || presence.activities.length <= 1)
        return;

      setCurrentActivityIndex((prevIndex) => {
        if (direction === 'next') {
          return (prevIndex + 1) % presence.activities.length;
        } else {
          return prevIndex === 0
            ? presence.activities.length - 1
            : prevIndex - 1;
        }
      });
    },
    [presence]
  );

  const handleNext = useCallback(() => {
    setSlideDirection(1);
    rotateActivity('next');
  }, [rotateActivity]);

  const handlePrev = useCallback(() => {
    setSlideDirection(-1);
    rotateActivity('prev');
  }, [rotateActivity]);

  const handleRetryConnection = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    setShowWeatherFallback(false);
    retryConnection();

    retryTimeoutRef.current = setTimeout(() => {
      if (!isConnected && error) {
        setShowWeatherFallback(true);
      }
    }, 10000);
  }, [retryConnection, isConnected, error]);

  useEffect(() => {
    if (presence?.activities?.length && presence.activities.length > 1) {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }

      activityIntervalRef.current = setInterval(() => {
        rotateActivity('next');
      }, 8000);

      return () => {
        if (activityIntervalRef.current) {
          clearInterval(activityIntervalRef.current);
          activityIntervalRef.current = null;
        }
      };
    }
  }, [presence?.activities, rotateActivity]);

  useEffect(() => {
    if (presence) {
      setIsVisible(presence.status !== 'offline');
    }
  }, [presence]);

  useEffect(() => {
    if (error && !isLoading) {
      retryTimeoutRef.current = setTimeout(() => {
        setShowWeatherFallback(true);
      }, 5000);
    } else {
      setShowWeatherFallback(false);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [error, isLoading]);

  useEffect(() => {
    return () => {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
        activityIntervalRef.current = null;
      }

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isConnected);
    }
  }, [isConnected, onConnectionChange]);

  if (disabled || !userId || (presence && presence.status === 'offline')) {
    return <Weather location={weatherLocation} disabled={false} />;
  }

  return (
    <motion.div
      key='discord-presence'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      className='border-border overflow-hidden rounded-lg border p-4 md:p-6 lg:p-8 w-full h-full flex flex-col'
    >
      <motion.div variants={itemVariants} className='flex items-center gap-4'>
        <div className='mb-3 md:mb-4 flex w-full items-center justify-between'>
          <div className='flex items-center gap-3 md:gap-4'>
            <FaDiscord className='text-[#5865F2]' size={20} />
            <h3 className='text-sm md:text-base lg:text-lg font-medium'>Discord Presence</h3>
          </div>

          {isConnected ? (
            <div className='flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-500'>
              <span className='h-2 w-2 md:h-2.5 md:w-2.5 animate-pulse rounded-full bg-green-500'></span>
              <span>Connected</span>
            </div>
          ) : error ? (
            <div className='flex items-center gap-1 md:gap-2 text-xs md:text-sm text-red-500'>
              <span className='h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-red-500'></span>
              <span>Disconnected</span>
            </div>
          ) : null}
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div variants={itemVariants} className='space-y-3 md:space-y-4 flex-grow'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full' />
            <div>
              <Skeleton className='mb-1 h-4 md:h-5 lg:h-6 w-24 md:w-32 lg:w-40' />
              <Skeleton className='h-3 md:h-4 w-16 md:w-24' />
            </div>
          </div>
          <Skeleton className='h-16 md:h-24 lg:h-32 w-full rounded-md' />
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants} className='space-y-3 md:space-y-4 flex-grow'>
          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm md:text-base'>
              {error === 'Connection unavailable'
                ? 'Discord status temporarily unavailable'
                : 'Discord connection failed'}
            </p>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRetryConnection}
              className='flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9 px-2 md:px-3'
            >
              <MdRefresh className="md:h-5 md:w-5" />
              <span>Retry</span>
            </Button>
          </div>

          {showWeatherFallback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <Weather location={weatherLocation} disabled={false} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      ) : presence ? (
        <div className='space-y-3 md:space-y-4 flex-grow flex flex-col'>
          <motion.div
            variants={itemVariants}
            className='flex items-center gap-3 md:gap-4'
          >
            <div className='relative'>
              <Image
                src={presence.pfp}
                alt={presence.tag}
                width={48}
                height={48}
                className='h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded object-cover'
              />
              <div
                className={`border-card absolute right-0 bottom-0 h-3 w-3 md:h-4 md:w-4 rounded-full border-2 ${getStatusColor(presence.status)}`}
              />
            </div>
            <div>
              <p className='text-sm md:text-base font-medium'>{presence.tag}</p>
              <div className='flex items-center gap-1'>
                {presence.customStatus?.name && (
                  <p className='text-muted-foreground text-xs md:text-sm'>
                    {presence.customStatus.emoji
                      ? presence.customStatus.emoji + ' '
                      : ''}
                    {presence.customStatus.name}
                  </p>
                )}
                {presence?.platform && (
                  <span className='text-muted-foreground md:inline hidden text-xs md:text-sm opacity-0 md:opacity-70'>
                    {typeof presence.platform === 'object' &&
                      !Array.isArray(presence.platform)
                      ? `• ${Object.keys(presence.platform)[0] || 'web'}`
                      : Array.isArray(presence.platform) &&
                        presence.platform.length > 0
                        ? `• ${presence.platform[0]}`
                        : ''}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {presence.activities && presence.activities.length > 0 && (
            <div>
              {presence.activities.length > 1 && (
                <div className='flex items-center justify-between mb-2 md:mb-3'>
                  <div className='flex gap-1.5 md:gap-2'>
                    {presence.activities.map((_: unknown, index: number) => (
                      <span
                        key={index}
                        className={`h-1.5 w-1.5 md:h-2 md:w-2 lg:h-2.5 lg:w-2.5 rounded-full ${index === currentActivityIndex
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                          }`}
                      />
                    ))}
                  </div>

                  <div className='flex gap-1.5 md:gap-2'>
                    <button
                      onClick={handlePrev}
                      className='hover:bg-muted/50 text-muted-foreground rounded-full p-1 md:p-1.5 lg:p-2 transition-colors'
                      aria-label='Previous activity'
                    >
                      <MdSkipPrevious size={16} className="md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className='hover:bg-muted/50 text-muted-foreground rounded-full p-1 md:p-1.5 lg:p-2 transition-colors'
                      aria-label='Next activity'
                    >
                      <MdSkipNext size={16} className="md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    </button>
                  </div>
                </div>
              )}

              <div
                className='relative overflow-hidden flex-grow'
                style={{ height: getMaxActivityHeight() }}
              >
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.div
                    key={currentActivityIndex}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial='enter'
                    animate='center'
                    exit='exit'
                    className='bg-secondary/30 absolute w-full rounded p-2 md:p-3 lg:p-4 text-sm md:text-base h-full'
                  >
                    {(() => {
                      const activity =
                        presence.activities[currentActivityIndex];
                      return (
                        <div className='grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr] gap-4'>
                          {activity.assets?.largeImage && (
                            <Image
                              src={activity.assets.largeImage}
                              alt={activity.assets.largeText || activity.name}
                              width={120}
                              height={120}
                              className='h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 flex-shrink-0 rounded-md object-cover'
                            />
                          )}
                          <div className='grid h-full min-w-0 content-center'>
                            <p className='truncate font-medium text-sm md:text-base'>
                              {activity.name}
                            </p>
                            {activity.details && (
                              <p className='text-muted-foreground mt-1 truncate text-xs md:text-sm'>
                                {activity.details}
                              </p>
                            )}
                            {activity.state && (
                              <p className='text-muted-foreground truncate text-xs md:text-sm'>
                                {activity.state?.replace(/;/g, ',')}
                              </p>
                            )}
                            {activity.timestamps?.start && (
                              <p className='text-muted-foreground mt-1 text-xs md:text-sm'>
                                {formatElapsedTime(activity.timestamps.start)}{' '}
                                elapsed
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

          {(!presence.activities || presence.activities.length === 0) && (
            <motion.div
              variants={itemVariants}
              className='bg-secondary/30 rounded p-3 md:p-4 flex items-center justify-center flex-grow min-h-[4rem] md:min-h-[6rem]'
            >
              <p className='text-muted-foreground text-sm md:text-base'>
                Not playing anything right now
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div variants={itemVariants} className='space-y-3 md:space-y-4 flex-grow'>
          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm md:text-base'>
              Connecting to Discord...
            </p>
            {!isLoading && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleRetryConnection}
                className='flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9 px-2 md:px-3'
              >
                <MdRefresh className="md:h-5 md:w-5" />
                <span>Retry</span>
              </Button>
            )}
          </div>
          {showWeatherFallback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <Weather location={weatherLocation} disabled={false} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
