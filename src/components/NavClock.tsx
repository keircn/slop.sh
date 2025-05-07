"use client";

import React, { useEffect, useState } from "react";

function getLondonTime() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/London" }),
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

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (!mounted || !time) {
    return (
      <span 
        className="font-mono text-base md:text-lg text-center px-4 select-none opacity-0"
        aria-hidden="true"
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
      className="font-mono text-base md:text-lg text-center px-4 select-none"
      title="London time"
    >
      {hh}:{mm}:{ss}
    </span>
  );
}
