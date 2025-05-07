import { useState, useEffect, useCallback } from "react";
import { Presence, Activity } from "~/types/Presence";

export function useDiscordPresence(userId?: string) {
  const [presence, setPresence] = useState<Presence | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeActivityTimestamps = (activity: Activity): Activity => {
    if (!activity || !activity.timestamps) return activity;

    const normalizedActivity = { ...activity };

    if (normalizedActivity.timestamps?.start) {
      normalizedActivity.timestamps.start = new Date(
        normalizedActivity.timestamps.start,
      );
    }

    if (normalizedActivity.timestamps?.end) {
      normalizedActivity.timestamps.end = new Date(
        normalizedActivity.timestamps.end,
      );
    }

    return normalizedActivity;
  };

  const normalizePlatform = (
    platform: string[] | Record<string, boolean> | string | null | undefined,
  ): string[] => {
    if (!platform) return [];

    if (Array.isArray(platform)) return platform;

    if (typeof platform === "object") {
      return Object.entries(platform)
        .filter(([, state]) => state !== false)
        .map(([platform]) => platform);
    }

    return [String(platform)];
  };

  const connectToWebSocket = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const wsUrl = process.env.NEXT_PUBLIC_DISCORD_WS_URL;
    if (!wsUrl) {
      console.error("WebSocket URL not configured in .env");
      setError("WebSocket URL not configured");
      setIsLoading(false);
      return;
    }

    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setIsConnected(true);
        setIsLoading(false);

        if (userId) {
          try {
            if (socket) {
              socket.send(JSON.stringify({ userId }));
            }
          } catch (err) {
            console.error("Error sending userId:", err);
          }
        }
      };

      socket.onmessage = (event) => {
        if (event.data === "connected" || event.data === "pong") return;

        try {
          const data = JSON.parse(event.data);

          if (data.activities && Array.isArray(data.activities)) {
            data.activities = data.activities.map(normalizeActivityTimestamps);
          }

          if (data.platform) {
            data.platform = normalizePlatform(data.platform);
          }

          setPresence(data as Presence);
        } catch (err) {
          console.error("Failed to parse message data:", err);
        }
      };

      socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("Connection error");
        setIsConnected(false);
        setIsLoading(false);
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        setIsLoading(false);
        setError(`Connection closed (${event.code})`);
      };

      const pingInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send("ping");
        }
      }, 10000);

      return () => {
        clearInterval(pingInterval);

        if (socket) {
          socket.onopen = null;
          socket.onmessage = null;
          socket.onerror = null;
          socket.onclose = null;

          if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
          ) {
            socket.close();
          }
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError("Failed to create connection");
      setIsLoading(false);
      setIsConnected(false);
      return () => {};
    }
  }, [userId]);

  useEffect(() => {
    const cleanup = connectToWebSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [connectToWebSocket]);

  const retryConnection = useCallback(() => {
    const cleanup = connectToWebSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connectToWebSocket]);

  return {
    presence,
    isConnected,
    isLoading,
    error,
    retryConnection,
  };
}
