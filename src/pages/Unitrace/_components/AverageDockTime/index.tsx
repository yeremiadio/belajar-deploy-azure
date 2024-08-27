import { useMemo } from 'react';

import useAverageDynamicTime from '@/utils/hooks/useAverageDynamicTime';

import { TReservationObject } from '@/types/api/reservation';

type Props = {
  reservationDockingData: TReservationObject[];
};

const AverageDockTimeComponent = ({ reservationDockingData }: Props) => {
  const dockingTimeData = reservationDockingData.filter(
    (item) => item.dockingDate,
  );

  const convertedTimes = useMemo(() => {
    return dockingTimeData.map((item) => item.dockingDate)?.filter(Boolean);
  }, [dockingTimeData]);

  const averageTime = useAverageDynamicTime(convertedTimes, 'HH:mm:ss');

  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-[14px] py-[10px] text-center">
      <div className="mb-3 text-[12px]">Average Docking Time</div>
      <div className="text-[18px] font-semibold text-rs-v2-mint 2xl:text-[22px]">
        {averageTime || '-'}
      </div>
    </div>
  );
};
export default AverageDockTimeComponent;
