import { useEffect, useState } from 'react';
import { getLastUpdateInformationTime } from '../functions/getLastUpdateInformationTime';

type Props = {
  receivedOn?: string;
};

/**
 * Generates the last update time based on the received time.
 * Updates every second for the first 60 seconds, then every minute thereafter.
 * @param {string} receivedOn - The time the data was received.
 * @returns {string} The last update time in the format "last updated X Y ago".
 */

const useDynamicLastUpdateTime = ({ receivedOn }: Props) => {
  const [lastUpdateTime, setLastUpdateTime] =
    useState<string>('last updated -');

  useEffect(() => {
    if (receivedOn) {
      let counter = 0;
      const intervalSecond = setInterval(() => {
        setLastUpdateTime(getLastUpdateInformationTime(receivedOn));
        counter++;
        if (counter === 60) {
          clearInterval(intervalSecond);
        }
      }, 1000);

      const intervalMinute = setInterval(() => {
        setLastUpdateTime(getLastUpdateInformationTime(receivedOn));
      }, 60000);

      return () => {
        clearInterval(intervalMinute);
        clearInterval(intervalSecond);
      };
    }
  }, [receivedOn]);

  return lastUpdateTime;
};

export default useDynamicLastUpdateTime;
