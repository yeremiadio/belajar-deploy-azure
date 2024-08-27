import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { Nullable } from '@/types/global';

const useAverageDynamicTime = (
  dynamicTimes: Nullable<string | dayjs.Dayjs | Date>[],
  format: 'HH:mm:ss' | 'mm:ss' = 'HH:mm:ss',
) => {
  // Helper function to convert ISO time strings to Day.js objects
  const parseTime = (timeStr: Nullable<string | dayjs.Dayjs | Date>) =>
    dayjs(timeStr);

  const [averageTime, setAverageTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dynamicTimes.length > 0) {
        const currentTime = dayjs();
        const totalDiff = dynamicTimes.reduce((acc, time) => {
          const diffSeconds = currentTime.diff(parseTime(time), 'second');
          return acc + diffSeconds;
        }, 0);

        const averageSeconds = totalDiff / dynamicTimes.length;

        // Calculate total hours, minutes, and seconds
        const hours = Math.floor(averageSeconds / 3600);
        const minutes = Math.floor((averageSeconds % 3600) / 60);
        const seconds = Math.floor(averageSeconds % 60);

        const newAverageTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setAverageTime(newAverageTime);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dynamicTimes, format]);

  return averageTime;
};

export default useAverageDynamicTime;
