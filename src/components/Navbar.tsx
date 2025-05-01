"use client";

import React, { useState, useEffect, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
} from "react-icons/wi";
import { useMobile } from "~/hooks/useMobile";
import { useScrollDirection } from "~/hooks/useScrollDirection";
import { NavClock } from "~/components/NavClock";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
}

const WeatherDisplay = memo(
  ({ weatherData }: { weatherData: WeatherData | null }) => {
    const getWeatherIcon = (iconCode: string) => {
      const iconMap: Record<string, React.ReactElement> = {
        "01d": <WiDaySunny size={24} className="text-yellow-500" />,
        "02d": <WiCloudy size={24} className="text-gray-500" />,
        "03d": <WiCloudy size={24} className="text-gray-500" />,
        "04d": <WiCloudy size={24} className="text-gray-500" />,
        "09d": <WiRain size={24} className="text-blue-500" />,
        "10d": <WiRain size={24} className="text-blue-500" />,
        "11d": <WiThunderstorm size={24} className="text-gray-700" />,
        "13d": <WiSnow size={24} className="text-blue-200" />,
        "50d": <WiFog size={24} className="text-gray-400" />,
        "01n": <WiNightClear size={24} className="text-indigo-300" />,
        "02n": <WiCloudy size={24} className="text-gray-600" />,
        "03n": <WiCloudy size={24} className="text-gray-600" />,
        "04n": <WiCloudy size={24} className="text-gray-600" />,
        "09n": <WiRain size={24} className="text-blue-600" />,
        "10n": <WiRain size={24} className="text-blue-600" />,
        "11n": <WiThunderstorm size={24} className="text-gray-800" />,
        "13n": <WiSnow size={24} className="text-blue-100" />,
        "50n": <WiFog size={24} className="text-gray-500" />,
      };

      return (
        iconMap[iconCode] || (
          <WiDaySunny size={24} className="text-yellow-500" />
        )
      );
    };

    if (!weatherData) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm"
      >
        <div className="flex items-center">
          {getWeatherIcon(weatherData.icon)}
        </div>
        <div className="hidden md:block">
          <div className="font-medium">{weatherData.temperature}°C</div>
          <div className="text-xs text-muted-foreground">
            {weatherData.location}
          </div>
        </div>
        <div className="md:hidden">
          <div className="font-medium">{weatherData.temperature}°C</div>
        </div>
      </motion.div>
    );
  },
);

WeatherDisplay.displayName = "WeatherDisplay";

export function Navbar() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { isScrolledDown } = useScrollDirection();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/weather?location=London,UK`);

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();

        const simplifiedData = {
          location: data.location,
          temperature: data.temperature,
          description: data.description,
          icon: data.icon,
        };

        setWeatherData(simplifiedData);
      } catch (err) {
        console.error("Failed to fetch weather data for navbar:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    const refreshInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <div className="sticky top-0 z-50 w-full mt-8">
      <motion.header
        className={`w-full backdrop-blur-sm bg-background/50 border rounded border-border/40 max-w-4xl mx-auto px-4 ${isMobile ? "px-2" : ""}`}
        initial={{ y: 0, scale: 1 }}
        animate={{
          scale: isMobile ? 1 : isScrolledDown ? 1 : 1.15,
          y: 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="container mx-auto px-4 py-3"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                variants={logoVariants}
                className="relative font-semibold text-xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/10 blur-lg opacity-60 rounded-full" />
                <Link href="/" className="relative">
                  slop.sh
                </Link>
              </motion.div>
            </div>

            <div className="hidden md:flex flex-1 justify-center">
              <NavClock />
            </div>

            <div className="flex items-center gap-4">
              {!isLoading && <WeatherDisplay weatherData={weatherData} />}

              {/* <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </Button>
              </div> */}
            </div>
          </div>

          <AnimatePresence>
            {isOpen && isMobile && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:hidden pt-4 pb-2"
              >
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/projects"
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent/50"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </div>
  );
}
