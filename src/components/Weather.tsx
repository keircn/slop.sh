"use client";

import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
  WiWindy,
  WiHumidity,
  WiThermometer,
} from "react-icons/wi";
import { Skeleton } from "~/components/ui/skeleton";
import { useMobile } from "~/hooks/useMobile";

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  updatedAt: Date;
}

interface WeatherProps {
  location?: string;
  disabled?: boolean;
}

export function Weather({
  location = "London,UK",
  disabled = false,
}: WeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { isMobile } = useMobile();

  useEffect(() => {
    if (disabled) {
      setIsLoading(false);
      setIsVisible(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/weather?location=${encodeURIComponent(location)}`,
        );

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();

        if (data.updatedAt && typeof data.updatedAt === "string") {
          data.updatedAt = new Date(data.updatedAt);
        } else {
          data.updatedAt = new Date();
        }

        setWeatherData(data);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError("Could not load weather information");
        setIsLoading(false);
      }
    };

    fetchWeather();

    const refreshInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [location, disabled]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      "01d": (
        <WiDaySunny size={isMobile ? 28 : 32} className="text-yellow-500" />
      ),
      "02d": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-500" />,
      "03d": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-500" />,
      "04d": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-500" />,
      "09d": <WiRain size={isMobile ? 28 : 32} className="text-blue-500" />,
      "10d": <WiRain size={isMobile ? 28 : 32} className="text-blue-500" />,
      "11d": (
        <WiThunderstorm size={isMobile ? 28 : 32} className="text-gray-700" />
      ),
      "13d": <WiSnow size={isMobile ? 28 : 32} className="text-blue-200" />,
      "50d": <WiFog size={isMobile ? 28 : 32} className="text-gray-400" />,

      "01n": (
        <WiNightClear size={isMobile ? 28 : 32} className="text-indigo-300" />
      ),
      "02n": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-600" />,
      "03n": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-600" />,
      "04n": <WiCloudy size={isMobile ? 28 : 32} className="text-gray-600" />,
      "09n": <WiRain size={isMobile ? 28 : 32} className="text-blue-600" />,
      "10n": <WiRain size={isMobile ? 28 : 32} className="text-blue-600" />,
      "11n": (
        <WiThunderstorm size={isMobile ? 28 : 32} className="text-gray-800" />
      ),
      "13n": <WiSnow size={isMobile ? 28 : 32} className="text-blue-100" />,
      "50n": <WiFog size={isMobile ? 28 : 32} className="text-gray-500" />,
    };

    return (
      iconMap[iconCode] || (
        <WiDaySunny size={isMobile ? 28 : 32} className="text-yellow-500" />
      )
    );
  };

  const formatUpdatedTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const getWeatherCardHeight = (): string => {
    return isMobile ? "8.5rem" : "8rem";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="weather-widget"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`overflow-hidden ${isMobile ? "pt-2 px-2" : ""}`}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <WiDaySunny className="text-primary" size={18} />
              <h3 className="text-sm font-medium">Weather</h3>
            </div>

            {!isLoading && !error && weatherData && (
              <div className="text-xs text-muted-foreground">
                Updated at {formatUpdatedTime(weatherData.updatedAt)}
              </div>
            )}
          </motion.div>

          <div className="relative" style={{ height: getWeatherCardHeight() }}>
            {isLoading ? (
              <motion.div
                variants={itemVariants}
                className="space-y-2 absolute inset-0"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 w-10 rounded-full" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                variants={itemVariants}
                className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 rounded-md absolute inset-0"
              >
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                variants={itemVariants}
                className="space-y-3 absolute inset-0"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-medium truncate">
                      {weatherData.location}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {weatherData.description}
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <WiThermometer
                      size={isMobile ? 18 : 20}
                      className="text-primary"
                    />
                    <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
                      {weatherData.temperature}°C
                      <span
                        className={`${isMobile ? "text-[10px]" : "text-xs"} text-muted-foreground ml-1`}
                      >
                        Feels like {weatherData.feelsLike}°C
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1 border-t border-border pt-2">
                  <div className="flex items-center gap-1">
                    <WiHumidity
                      size={isMobile ? 16 : 18}
                      className="text-blue-400"
                    />
                    <span className={`${isMobile ? "text-[10px]" : "text-xs"}`}>
                      {weatherData.humidity}% Humidity
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WiWindy
                      size={isMobile ? 16 : 18}
                      className="text-blue-400"
                    />
                    <span className={`${isMobile ? "text-[10px]" : "text-xs"}`}>
                      {weatherData.windSpeed} km/h Wind
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.p
                variants={itemVariants}
                className="text-sm text-muted-foreground absolute inset-0 flex items-center justify-center"
              >
                Weather information unavailable
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
