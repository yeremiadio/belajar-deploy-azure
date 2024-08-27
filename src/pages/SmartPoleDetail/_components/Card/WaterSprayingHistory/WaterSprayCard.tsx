import dayjs from 'dayjs';
import { FC } from 'react';

import { TWaterSprayHistory } from '@/types/api/smartPole';

interface Props {
  data: TWaterSprayHistory;
}

export const WaterSprayCard: FC<Props> = ({ data }) => {
  const { date, deviceStatus, isManual, volume, times } = data;

  return (
    <div className="py-4 px-5 bg-rs-v2-thunder-blue w-full h-fit rounded-lg box-border outline-none overflow-hidden flex items-center justify-between">
      <div className="flex items-start gap-2">
        <h1 className="text-base font-medium">{volume} L</h1>
        <h4 className="mt-[2px] text-sm font-bold text-rs-v2-mint">{times}x</h4>
      </div>
      <div className="whitespace-nowrap flex flex-col gap-1 text-sm font-medium items-end">
        <p className="text-rs-neutral-gray-gull">
          {dayjs(date).format("HH:mm:ss")}
        </p>
        <p>{isManual ? "Manual" : "Automation"} | {deviceStatus}</p>
      </div>
    </div>
  );
};
