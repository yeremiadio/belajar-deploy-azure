import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { Nullable } from '@/types/global';

dayjs.extend(duration);

export const formatElapsedTime = (
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
  withHours?: boolean,
): string => {
  const duration = dayjs.duration(endTime.diff(startTime));
  return duration.format(withHours ? 'HH:mm:ss' : 'mm:ss');
};

const useDynamicTime = (
  date: Nullable<string | dayjs.Dayjs | Date>,
  withHours?: boolean,
) => {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    if (date) {
      const startTime = dayjs(date);
      const timerID = setInterval(() => {
        const now = dayjs();
        const duration = formatElapsedTime(startTime, now, withHours);
        setElapsedTime(duration);
      }, 1000);

      return () => clearInterval(timerID);
    }
  }, [date, withHours]);

  return elapsedTime;
};

export default useDynamicTime;
// export default useDynamicTime;
