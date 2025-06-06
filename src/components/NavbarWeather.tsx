'use client';

import { motion } from 'framer-motion';
import React, { memo, useEffect, useState } from 'react';
import {
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiNightClear,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from 'react-icons/wi';
import { NavbarWeatherData, NavbarWeatherProps } from '~/types/Navbar';

export const NavbarWeather = memo(function NavbarWeather({
  location = 'London,UK',
}: NavbarWeatherProps) {
  const [weatherData, setWeatherData] = useState<NavbarWeatherData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/weather?location=${encodeURIComponent(location)}`
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
        console.error('Failed to fetch weather data for navbar:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    const refreshInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [location]);

  const getWeatherIcon = (iconCode: string) => {
    const iconSize = 22;
    const iconMap: Record<string, React.ReactElement> = {
      '01d': <WiDaySunny size={iconSize} className='text-amber-400' />,
      '02d': <WiCloudy size={iconSize} className='text-gray-400' />,
      '03d': <WiCloudy size={iconSize} className='text-gray-400' />,
      '04d': <WiCloudy size={iconSize} className='text-gray-400' />,
      '09d': <WiRain size={iconSize} className='text-blue-400' />,
      '10d': <WiRain size={iconSize} className='text-blue-400' />,
      '11d': <WiThunderstorm size={iconSize} className='text-gray-600' />,
      '13d': <WiSnow size={iconSize} className='text-blue-100' />,
      '50d': <WiFog size={iconSize} className='text-gray-300' />,
      '01n': <WiNightClear size={iconSize} className='text-indigo-200' />,
      '02n': <WiCloudy size={iconSize} className='text-gray-500' />,
      '03n': <WiCloudy size={iconSize} className='text-gray-500' />,
      '04n': <WiCloudy size={iconSize} className='text-gray-500' />,
      '09n': <WiRain size={iconSize} className='text-blue-500' />,
      '10n': <WiRain size={iconSize} className='text-blue-500' />,
      '11n': <WiThunderstorm size={iconSize} className='text-gray-700' />,
      '13n': <WiSnow size={iconSize} className='text-blue-50' />,
      '50n': <WiFog size={iconSize} className='text-gray-400' />,
    };

    return (
      iconMap[iconCode] || (
        <WiDaySunny size={iconSize} className='text-amber-400' />
      )
    );
  };

  if (isLoading || !weatherData)
    return (
      <div className='flex items-center gap-2 text-sm opacity-50'>
        <div className='bg-accent/40 h-6 w-12 animate-pulse rounded'></div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className='flex items-center gap-1.5 rounded-lg px-2 py-1'
    >
      <div className='flex items-center'>
        {getWeatherIcon(weatherData.icon)}
      </div>
      <div className='hidden md:block'>
        <div className='text-sm font-medium'>{weatherData.temperature}°C</div>
        <div className='text-muted-foreground max-w-[100px] truncate text-xs'>
          {weatherData.location}
        </div>
      </div>
      <div className='md:hidden'>
        <div className='text-sm font-medium'>{weatherData.temperature}°C</div>
      </div>
    </motion.div>
  );
});
