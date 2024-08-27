import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Nullable } from '@/types/global';

const useCountdown = (date: Nullable<string | dayjs.Dayjs | Date>) => {
  const parseTime = (timeStr: Nullable<string | dayjs.Dayjs | Date>) =>
    dayjs(timeStr);

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (date === null) {
      return;
    }

    const intervalId = setInterval(() => {
      const currentTime = dayjs();
      const diffSeconds = parseTime(date).diff(currentTime, 'second');

      if (diffSeconds <= 0) {
        clearInterval(intervalId); // Hentikan interval jika waktu habis
        setCountdown('00:00:00'); // Tampilkan 00:00:00 jika sudah habis
        return;
      }

      // Hitung jam, menit, dan detik
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = Math.floor(diffSeconds % 60);

      const newCountdown = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setCountdown(newCountdown);
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [date]);

  return countdown;
};

export default useCountdown;
