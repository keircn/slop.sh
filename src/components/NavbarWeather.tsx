"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
} from "react-icons/wi";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
}

interface NavbarWeatherProps {
  location?: string;
}

export const NavbarWeather = memo(function NavbarWeather({
  location = "London,UK",
}: NavbarWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, [location]);

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
      iconMap[iconCode] || <WiDaySunny size={24} className="text-yellow-500" />
    );
  };

  if (isLoading || !weatherData) return null;

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
});
