import { FC } from 'react';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { TValueOEE } from '@/types/api/machineMonitoring';

import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

import CircularChart from './CircularChart';

type Props = {
  deviceData: TValueOEE | undefined;
  isActive: Boolean;
};

const QualityCard: FC<Props> = ({ deviceData, isActive }) => {
  const language = useAppSelector(selectLanguage);
  const percent = deviceData?.quality.quality ?? 0;

  return (
    <div className="relative flex flex-col gap-4 bg-transparent p-5 border-none h-full">
      <h1 className="text-center text-l text-rs-v2-black-text-button">
        {localization('Quality', language)}
      </h1>

      <div className="relative flex flex-col items-center gap-2">
        <div className="top-2 left-1/2 absolute transform -translate-x-1/2">
          <CircularChart value={percent} is_Active={isActive} />
        </div>
        <div className="flex flex-col gap-1 mt-5 mb-5 pt-24 w-full text-[10px] text-rs-v2-galaxy-blue"> 
        <div className="flex justify-between items-start mt-5 border-t-[1px] border-t-rs-divider-gray">
            <p className="flex-1">NG Count</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.quality.notGoodCount}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="flex-1">Good Count</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.quality.goodCount}</p>
          </div>
          <div className="flex justify-between items-start">
            <p className="flex-1">Total Count</p>
            <p className="flex-shrink-0 ml-2 font-bold">{deviceData?.quality.totalCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityCard;
