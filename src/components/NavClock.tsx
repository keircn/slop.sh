'use client';

import React, { useEffect, useState } from 'react';

function getLondonTime() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })
  );
}

export function NavClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getLondonTime());

    const interval = setInterval(() => {
      setTime(getLondonTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (!mounted || !time) {
    return (
      <span
        className='px-4 text-center font-mono text-base opacity-0 select-none md:text-lg'
        aria-hidden='true'
      >
        00:00:00
      </span>
    );
  }

  const hh = pad(time.getHours());
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());

  return (
    <span
      className='px-4 text-center font-mono text-base select-none md:text-lg'
      title='London time'
    >
      {hh}:{mm}:{ss}
    </span>
  );
}
