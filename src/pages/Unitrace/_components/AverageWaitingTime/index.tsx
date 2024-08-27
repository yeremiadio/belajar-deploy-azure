import { useMemo } from 'react';

import useAverageDynamicTime from '@/utils/hooks/useAverageDynamicTime';

import { TReservationObject } from '@/types/api/reservation';

type Props = {
  reservationWaitingData: TReservationObject[];
};

const AverageWaitingTimeComponent = ({ reservationWaitingData }: Props) => {
  const waitingTimeData = reservationWaitingData.filter(
    (item) => item.waitingDate,
  );

  const convertedTimes = useMemo(() => {
    return waitingTimeData.map((item) => item.waitingDate)?.filter(Boolean);
  }, [waitingTimeData]);

  const averageTime = useAverageDynamicTime(convertedTimes, 'HH:mm:ss');

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-[14px] text-center">
      <div className="mb-3 text-[12px]">Average Waiting</div>
      <div className="text-[18px] font-semibold text-rs-v2-mint 2xl:text-[22px]">
        {averageTime || '-'}
      </div>
    </div>
  );
};
export default AverageWaitingTimeComponent;
