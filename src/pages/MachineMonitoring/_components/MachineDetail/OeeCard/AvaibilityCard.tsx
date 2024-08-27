import { FC } from 'react';

import Card from '@/components/Card';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { TValueOEE } from '@/types/api/machineMonitoring';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

import CircularChart from './CircularChart';


type Props = {
  deviceData: TValueOEE | undefined;
  isActive: Boolean;
};

const AvailabilityCard: FC<Props> = ({ deviceData, isActive }) => {
  const language = useAppSelector(selectLanguage);
  const percent = deviceData?.availability.availability ?? 0;

  return (
    <Card className="relative flex flex-col gap-4 p-5 h-full">
      <h1 className="text-center text-l">
        {localization('Availability', language)}
      </h1>
      <div className="relative flex flex-col items-center gap-2">
        <div className="top-2 left-1/2 absolute transform -translate-x-1/2">
          <CircularChart value={percent} is_Active={isActive} />
        </div>
        <div className="flex flex-col gap-1 mt-10 pt-24 w-full text-[10px]"> 
          <div className="flex justify-between items-start">
            <p className="flex-1">Run Time</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.availability.actualRunTime}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="flex-1">Plan Prod Time</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.availability.plannedProdTime}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="flex-1">Downtime</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.availability.actualDownTime}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AvailabilityCard;
