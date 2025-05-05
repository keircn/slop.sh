"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import { MdRefresh, MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useMobile } from "~/hooks/useMobile";
import { Weather } from "~/components/Weather";
import { z } from "zod";

const discordPresencePropsSchema = z.object({
  userId: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  onConnectionChange: z
    .function()
    .args(z.boolean())
    .returns(z.void())
    .optional(),
  weatherLocation: z.string().optional().default("London,UK"),

  presence: z.any().optional(),
  isConnected: z.boolean().optional().default(false),
  isLoading: z.boolean().optional().default(false),
  error: z.string().nullable().optional(),
  onRetryConnection: z.function().returns(z.void()).optional(),
});

type DiscordPresenceProps = z.infer<typeof discordPresencePropsSchema>;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      when: "afterChildren",
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
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export function DiscordPresence(rawProps: DiscordPresenceProps) {
  const props = discordPresencePropsSchema.parse(rawProps);
  const {
    userId,
    disabled = false,
    weatherLocation = "London,UK",
    presence,
    isConnected = false,
    isLoading = false,
    error = null,
    onRetryConnection,
  } = props;

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [, setIsVisible] = useState(true);
  const [showWeatherFallback, setShowWeatherFallback] = useState(false);

  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useMobile();

  const formatElapsedTime = useCallback((startTime: Date | null): string => {
    if (!startTime) return "";
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
      default:
        return "bg-gray-500";
    }
  }, []);

  const getMaxActivityHeight = useCallback((): string => {
    if (!presence || !presence.activities || presence.activities.length === 0)
      return "auto";
    return isMobile ? "6rem" : "6rem";
  }, [presence, isMobile]);

  const rotateActivity = useCallback(
    (direction: "next" | "prev" = "next") => {
      if (!presence || !presence.activities || presence.activities.length <= 1)
        return;

      setCurrentActivityIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % presence.activities.length;
        } else {
          return prevIndex === 0
            ? presence.activities.length - 1
            : prevIndex - 1;
        }
      });
    },
    [presence],
  );

  const handleNext = useCallback(() => {
    setSlideDirection(1);
    rotateActivity("next");
  }, [rotateActivity]);

  const handlePrev = useCallback(() => {
    setSlideDirection(-1);
    rotateActivity("prev");
  }, [rotateActivity]);

  const handleRetryConnection = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    setShowWeatherFallback(false);

    if (onRetryConnection) {
      onRetryConnection();
    }

    retryTimeoutRef.current = setTimeout(() => {
      if (!isConnected && error) {
        setShowWeatherFallback(true);
      }
    }, 10000);
  }, [onRetryConnection, isConnected, error]);

  useEffect(() => {
    if (presence?.activities?.length && presence.activities.length > 1) {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }

      activityIntervalRef.current = setInterval(() => {
        rotateActivity("next");
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
      setIsVisible(presence.status !== "offline");
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

  if (disabled || !userId || (presence && presence.status === "offline")) {
    return <Weather location={weatherLocation} disabled={false} />;
  }

  return (
    <motion.div
      key="discord-presence"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mt-4 rounded-lg border border-border p-3 overflow-hidden"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <FaDiscord className="text-[#5865F2]" size={18} />
            <h3 className="text-sm font-medium">Discord Presence</h3>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-1 text-xs text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Connected</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-1 text-xs text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Disconnected</span>
            </div>
          ) : null}
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-md" />
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {error === "Connection unavailable"
                ? "Discord status temporarily unavailable"
                : "Discord connection failed"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              className="text-xs flex items-center gap-1"
            >
              <MdRefresh />
              <span>Retry</span>
            </Button>
          </div>

          {showWeatherFallback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Weather location={weatherLocation} disabled={false} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      ) : presence ? (
        <div className="space-y-3">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Image
                src={presence.pfp}
                alt={presence.tag}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(presence.status)}`}
              />
            </div>
            <div>
              <p className="text-sm font-medium">{presence.tag}</p>
              {presence.customStatus?.name && (
                <p className="text-xs text-muted-foreground">
                  {presence.customStatus.emoji
                    ? presence.customStatus.emoji + " "
                    : ""}
                  {presence.customStatus.name}
                </p>
              )}
            </div>
          </motion.div>

          {presence.activities && presence.activities.length > 0 && (
            <div>
              {presence.activities.length > 1 && (
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-1">
                    {presence.activities.map((_: unknown, index: number) => (
                      <span
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full ${
                          index === currentActivityIndex
                            ? "bg-primary"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground"
                      aria-label="Previous activity"
                    >
                      <MdSkipPrevious size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground"
                      aria-label="Next activity"
                    >
                      <MdSkipNext size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div
                className="relative overflow-hidden"
                style={{ height: getMaxActivityHeight() }}
              >
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.div
                    key={currentActivityIndex}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full rounded-md border border-border bg-muted/30 p-2 text-sm"
                  >
                    {(() => {
                      const activity =
                        presence.activities[currentActivityIndex];
                      return (
                        <div className="grid grid-cols-[80px_1fr] gap-4">
                          {activity.assets?.largeImage && (
                            <Image
                              src={activity.assets.largeImage}
                              alt={activity.assets.largeText || activity.name}
                              width={80}
                              height={80}
                              className="rounded-md flex-shrink-0 w-20 h-20"
                            />
                          )}
                          <div className="grid content-center min-w-0 h-full">
                            <p className="font-medium truncate">
                              {activity.name}
                            </p>
                            {activity.details && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {activity.details}
                              </p>
                            )}
                            {activity.state && (
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.state?.replace(/;/g, ",")}
                              </p>
                            )}
                            {activity.timestamps?.start && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatElapsedTime(activity.timestamps.start)}{" "}
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
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              Not playing anything right now
            </motion.p>
          )}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Connecting to Discord...
            </p>
            {!isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryConnection}
                className="text-xs flex items-center gap-1"
              >
                <MdRefresh />
                <span>Retry</span>
              </Button>
            )}
          </div>
          {showWeatherFallback && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
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
