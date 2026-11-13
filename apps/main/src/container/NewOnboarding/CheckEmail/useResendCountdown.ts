"use client";

import { useEffect, useState } from "react";

const COUNTDOWN_SECONDS = 60;

export function useResendCountdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return {
    seconds,
    isCounting: seconds > 0,
    start: () => setSeconds(COUNTDOWN_SECONDS),
  };
}
