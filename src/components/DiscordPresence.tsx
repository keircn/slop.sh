"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaExclamationTriangle } from "react-icons/fa";
import { MdRefresh, MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Presence } from "~/types/Presence";
import { transformPresence } from "~/lib/discord";
import { useMobile } from "~/lib/hooks/useMobile";

interface DiscordPresenceProps {
  userId?: string;
  disabled?: boolean;
}

export function DiscordPresence({
  userId,
  disabled = false,
}: DiscordPresenceProps) {
  const [presence, setPresence] = useState<Presence | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const activityInterval = useRef<NodeJS.Timeout | null>(null);
  const { isMobile } = useMobile();

  const retryConnection = () => {
    setIsLoading(true);
    setError(null);
    setIsVisible(true);
    setConnectionAttempts((prev) => prev + 1);
  };

  const rotateActivity = useCallback(
    (direction: "next" | "prev" = "next") => {
      if (!presence || presence.activities.length <= 1) return;

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

  useEffect(() => {
    if (presence?.activities.length && presence.activities.length > 1) {
      if (activityInterval.current) {
        clearInterval(activityInterval.current);
      }

      activityInterval.current = setInterval(() => {
        rotateActivity("next");
      }, 8000);

      return () => {
        if (activityInterval.current) {
          clearInterval(activityInterval.current);
          activityInterval.current = null;
        }
      };
    }
  }, [presence?.activities, rotateActivity]);

  useEffect(() => {
    if (disabled) {
      setIsLoading(false);
      setIsVisible(false);
      return;
    }

    const DISCORD_WS_URL =
      process.env.NEXT_PUBLIC_DISCORD_WS_URL || "ws://localhost:6969/presence";
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    const reconnectDelay = 3000;

    const connectWebSocket = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.error(
          `Failed to connect to Discord presence service after ${maxReconnectAttempts} attempts`,
        );
        setIsLoading(false);
        setError("Connection failed after multiple attempts");
        setIsVisible(false);

        reconnectTimer = setTimeout(() => {
          reconnectAttempts = 0;
          connectWebSocket();
        }, 30000);

        return;
      }

      try {
        console.log(
          `Attempting to connect to Discord WebSocket at ${DISCORD_WS_URL} (attempt ${reconnectAttempts + 1})`,
        );
        ws = new WebSocket(DISCORD_WS_URL);

        const connectionTimeout = setTimeout(() => {
          if (ws && ws.readyState !== WebSocket.OPEN) {
            console.error("WebSocket connection timed out");
            ws.close();
            setIsLoading(false);
            setError("Connection timed out");
            setIsVisible(false);
          }
        }, 5000);

        ws.onopen = () => {
          console.log("Connected to Discord presence WebSocket");
          clearTimeout(connectionTimeout);
          setIsConnected(true);
          reconnectAttempts = 0;
          setError(null);

          if (userId) {
            ws?.send(JSON.stringify({ type: "REQUEST_USER", userId }));
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data && data.type === "PRESENCE_UPDATE") {
              const transformed = transformPresence(data.presence);
              setPresence(transformed);
              setIsLoading(false);

              setIsVisible(transformed.status !== "offline");
            } else if (data && data._id) {
              const transformed = transformPresence(data);
              setPresence(transformed);
              setIsLoading(false);

              setIsVisible(transformed.status !== "offline");
            } else if (data && data.type === "ERROR") {
              console.error("WebSocket error from server:", data.message);
              setError(`Server error: ${data.message}`);
              setIsLoading(false);
              setIsVisible(false);
            } else {
              console.warn("Unrecognized WebSocket message format:", data);
              setIsLoading(false);
            }
          } catch (err) {
            console.error("Failed to parse WebSocket message:", err);
            setError("Failed to parse data from Discord service");
            setIsLoading(false);
            setIsVisible(false);
          }
        };

        ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(
            `Discord presence WebSocket closed (code: ${event.code}, reason: ${event.reason})`,
          );
          setIsConnected(false);

          reconnectAttempts++;
          if (reconnectAttempts < maxReconnectAttempts) {
            console.log(
              `Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`,
            );
            reconnectTimer = setTimeout(connectWebSocket, reconnectDelay);
          } else {
            setError("Connection to Discord presence service closed");
            setIsLoading(false);
            setIsVisible(false);

            reconnectTimer = setTimeout(() => {
              reconnectAttempts = 0;
              connectWebSocket();
            }, 30000);
          }
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("Discord presence WebSocket error:", error);
          setError("Failed to connect to the Discord presence service");
          setIsLoading(false);
          setIsVisible(false);
          ws?.close();
        };
      } catch (err) {
        console.error("Failed to establish WebSocket connection:", err);
        setError(
          `Failed to connect to Discord presence service: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setIsLoading(false);
        setIsVisible(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimer);
    };
  }, [userId, connectionAttempts, disabled]);

  const formatElapsedTime = (startTime: Date | null): string => {
    if (!startTime) return "";

    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();

    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string): string => {
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
  };

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

  const [slideDirection, setSlideDirection] = useState(1);

  const handleNext = () => {
    setSlideDirection(1);
    rotateActivity("next");
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    rotateActivity("prev");
  };

  const getMaxActivityHeight = (): string => {
    if (!presence || presence.activities.length === 0) return "auto";
    return isMobile ? "6rem" : "6rem";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="discord-presence"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-4 rounded-lg border border-border p-3 overflow-hidden"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-2"
          >
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
            <motion.div
              variants={itemVariants}
              className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 rounded-md"
            >
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Connection Error</p>
                  <p className="text-xs mt-1">{error}</p>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryConnection}
                      className="text-xs flex items-center gap-1"
                    >
                      <MdRefresh />
                      <span>Retry</span>
                    </Button>
                  </div>
                </div>
              </div>
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
                  {presence.customStatus.name && (
                    <p className="text-xs text-muted-foreground">
                      {presence.customStatus.emoji} {presence.customStatus.name}
                    </p>
                  )}
                </div>
              </motion.div>

              {presence.activities.length > 0 && (
                <div>
                  {presence.activities.length > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-1">
                        {presence.activities.map((_, index) => (
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
                            <div className="flex items-start gap-2">
                              {activity.assets?.largeImage && (
                                <Image
                                  src={activity.assets.largeImage}
                                  alt={
                                    activity.assets.largeText || activity.name
                                  }
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-md flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {activity.name}
                                </p>
                                {activity.details && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {activity.details}
                                  </p>
                                )}
                                {activity.state && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {activity.state}
                                  </p>
                                )}
                                {activity.timestamps?.start && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatElapsedTime(
                                      activity.timestamps.start,
                                    )}{" "}
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

              {presence.activities.length === 0 && (
                <motion.p
                  variants={itemVariants}
                  className="text-sm text-muted-foreground"
                >
                  Not playing anything right now
                </motion.p>
              )}
            </div>
          ) : (
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              Discord presence unavailable
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
