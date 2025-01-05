"use client";

import { useEffect, useRef, useState } from "react";

export const useCountdown = (countdown: number, interval = 1000) => {
  const intervalRef = useRef<number>(-1);
  const [count, setCount] = useState<number>(countdown);
  const [isCountdown, setIsCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isCountdown === null) {
      return;
    }

    intervalRef.current = window.setInterval(() => setCount(prev => prev - interval), interval);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [interval, isCountdown]);

  useEffect(() => {
    if (count === 0) setIsCountdown(null);
  }, [count]);

  const start = () => setIsCountdown(interval);
  const stop = () => setIsCountdown(null);
  const reset = () => {
    setCount(countdown);
    setIsCountdown(null);
  };

  return { isCountdown, count, start, stop, reset };
};
