// src/hooks/useRecipeTimer.js
import { useState, useEffect } from 'react';

const useRecipeTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            setIsActive(false);
            setHasFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = (duration = initialTime) => {
    setTime(duration);
    setIsActive(true);
    setHasFinished(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
    setHasFinished(false);
  };

  return {
    time,
    isActive,
    hasFinished,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};

export default useRecipeTimer;