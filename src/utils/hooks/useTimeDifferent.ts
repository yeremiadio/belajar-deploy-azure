import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Nullable } from '@/types/global';

const useTimeDifference = (date: Nullable<string | dayjs.Dayjs | Date>) => {
  // Helper function to convert ISO time strings to Day.js objects
  const parseTime = (timeStr: Nullable<string | dayjs.Dayjs | Date>) =>
    dayjs(timeStr);

  const [timeDifference, setTimeDifference] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (date) {
        const currentTime = dayjs();
        const diffSeconds = currentTime.diff(parseTime(date), 'second');

        // Calculate total hours, minutes, and seconds
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = Math.floor(diffSeconds % 60);

        const newTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setTimeDifference(newTimeDifference);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [date]);

  return timeDifference;
};

export default useTimeDifference;
