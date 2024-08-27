import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import the Bahasa Indonesia locale

// Set the locale to Bahasa Indonesia
dayjs.locale('id');

export default function Datetime() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const formattedDate = currentTime.format('DD MMMM YYYY - HH:mm:ss');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="whitespace-nowrap text-rs-v2-light-grey">{formattedDate}</p>
  );
}
