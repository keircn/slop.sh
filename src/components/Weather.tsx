'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiHumidity,
  WiNightClear,
  WiRain,
  WiSnow,
  WiThermometer,
  WiThunderstorm,
  WiWindy,
} from 'react-icons/wi';
import { Skeleton } from '~/components/ui/skeleton';
import { useMobile } from '~/hooks/useMobile';
import { WeatherData, WeatherProps } from '~/types/Weather';

export function Weather({
  location = 'London,UK',
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
          `/api/weather?location=${encodeURIComponent(location)}`
        );

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();

        if (data.updatedAt && typeof data.updatedAt === 'string') {
          data.updatedAt = new Date(data.updatedAt);
        } else {
          data.updatedAt = new Date();
        }

        setWeatherData(data);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        setError('Could not load weather information');
        setIsLoading(false);
      }
    };

    fetchWeather();

    const refreshInterval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [location, disabled]);

  const [iconSize, setIconSize] = useState(isMobile ? 28 : 32);

  useEffect(() => {
    const updateIconSize = () => {
      const size = isMobile
        ? 28
        : window.innerWidth > 1280
          ? 48
          : window.innerWidth > 768
            ? 40
            : 32;
      setIconSize(size);
    };

    updateIconSize();
    window.addEventListener('resize', updateIconSize);

    return () => window.removeEventListener('resize', updateIconSize);
  }, [isMobile]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      '01d': <WiDaySunny size={iconSize} className='text-yellow-500' />,
      '02d': <WiCloudy size={iconSize} className='text-gray-500' />,
      '03d': <WiCloudy size={iconSize} className='text-gray-500' />,
      '04d': <WiCloudy size={iconSize} className='text-gray-500' />,
      '09d': <WiRain size={iconSize} className='text-blue-500' />,
      '10d': <WiRain size={iconSize} className='text-blue-500' />,
      '11d': <WiThunderstorm size={iconSize} className='text-gray-700' />,
      '13d': <WiSnow size={iconSize} className='text-blue-200' />,
      '50d': <WiFog size={iconSize} className='text-gray-400' />,

      '01n': <WiNightClear size={iconSize} className='text-indigo-300' />,
      '02n': <WiCloudy size={iconSize} className='text-gray-600' />,
      '03n': <WiCloudy size={iconSize} className='text-gray-600' />,
      '04n': <WiCloudy size={iconSize} className='text-gray-600' />,
      '09n': <WiRain size={iconSize} className='text-blue-600' />,
      '10n': <WiRain size={iconSize} className='text-blue-600' />,
      '11n': <WiThunderstorm size={iconSize} className='text-gray-800' />,
      '13n': <WiSnow size={iconSize} className='text-blue-100' />,
      '50n': <WiFog size={iconSize} className='text-gray-500' />,
    };

    return (
      iconMap[iconCode] || (
        <WiDaySunny size={isMobile ? 28 : 32} className='text-yellow-500' />
      )
    );
  };

  const formatUpdatedTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  const getWeatherCardHeight = (): string => {
    return isMobile ? '8.5rem' : '10rem';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key='weather-widget'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          className='flex h-full w-full flex-col overflow-hidden p-4 md:p-6 lg:p-8'
        >
          <motion.div
            variants={itemVariants}
            className='mb-3 flex items-center justify-between md:mb-4'
          >
            <div className='flex items-center gap-2 md:gap-3'>
              <WiDaySunny className='text-primary' size={20} />
              <h3 className='text-sm font-medium md:text-base lg:text-lg'>
                Weather
              </h3>
            </div>

            {!isLoading && !error && weatherData && (
              <div className='text-muted-foreground text-xs md:text-sm'>
                Updated at {formatUpdatedTime(weatherData.updatedAt)}
              </div>
            )}
          </motion.div>

          <div
            className='relative my-auto'
            style={{ height: getWeatherCardHeight() }}
          >
            {isLoading ? (
              <motion.div
                variants={itemVariants}
                className='absolute inset-0 space-y-3 md:space-y-4'
              >
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-8 w-40 md:h-10 md:w-48 lg:h-12 lg:w-56' />
                  <Skeleton className='h-8 w-10 rounded-full md:h-10 md:w-12 lg:h-12 lg:w-14' />
                </div>
                <div className='mt-2 flex items-center justify-between md:mt-3'>
                  <Skeleton className='h-4 w-20 md:h-5 md:w-28 lg:h-6 lg:w-32' />
                  <Skeleton className='h-4 w-20 md:h-5 md:w-28 lg:h-6 lg:w-32' />
                </div>
                <div className='mt-1 grid grid-cols-2 gap-2 md:mt-2 md:gap-4'>
                  <Skeleton className='h-4 w-full md:h-5 lg:h-6' />
                  <Skeleton className='h-4 w-full md:h-5 lg:h-6' />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                variants={itemVariants}
                className='absolute inset-0 flex items-center justify-center rounded-md border border-red-200 bg-red-50 p-3 md:p-4 lg:p-6 dark:border-red-900/30 dark:bg-red-950/20'
              >
                <p className='text-sm text-red-600 md:text-base lg:text-lg dark:text-red-400'>
                  {error}
                </p>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                variants={itemVariants}
                className='absolute inset-0 flex flex-col space-y-3 md:space-y-4 lg:space-y-5'
              >
                <div className='flex items-center justify-between'>
                  <div className='min-w-0 flex-1'>
                    <h4 className='truncate text-base font-medium md:text-lg lg:text-xl'>
                      {weatherData.location}
                    </h4>
                    <p className='text-muted-foreground truncate text-sm md:text-base'>
                      {weatherData.description}
                    </p>
                  </div>
                  <div className='ml-2 flex flex-shrink-0 items-center md:ml-4'>
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1 md:gap-2'>
                    <WiThermometer
                      size={isMobile ? 18 : iconSize * 0.6}
                      className='text-primary'
                    />
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-sm md:text-base lg:text-lg'}`}
                    >
                      {weatherData.temperature}°C
                      <span
                        className={`${isMobile ? 'text-[10px]' : 'text-xs md:text-sm'} text-muted-foreground ml-1 md:ml-2`}
                      >
                        Feels like {weatherData.feelsLike}°C
                      </span>
                    </span>
                  </div>
                </div>

                <div className='border-border mt-1 grid grid-cols-2 gap-2 border-t pt-2 md:mt-3 md:gap-4 md:pt-3'>
                  <div className='flex items-center gap-1 md:gap-2'>
                    <WiHumidity
                      size={isMobile ? 16 : iconSize * 0.5}
                      className='text-blue-400'
                    />
                    <span
                      className={`${isMobile ? 'text-[10px]' : 'text-xs md:text-sm lg:text-base'}`}
                    >
                      {weatherData.humidity}% Humidity
                    </span>
                  </div>
                  <div className='flex items-center gap-1 md:gap-2'>
                    <WiWindy
                      size={isMobile ? 16 : iconSize * 0.5}
                      className='text-blue-400'
                    />
                    <span
                      className={`${isMobile ? 'text-[10px]' : 'text-xs md:text-sm lg:text-base'}`}
                    >
                      {weatherData.windSpeed} km/h Wind
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className='text-muted-foreground absolute inset-0 flex items-center justify-center p-4 md:p-6'
              >
                <p className='text-sm md:text-base lg:text-lg'>
                  Weather information unavailable
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
