import { FC, HTMLAttributes } from 'react';
import { IoTriangle } from 'react-icons/io5';
import { MdWater } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { selectLanguage } from '@/stores/languageStore/languageSlice';

import { TDeviceObject, TWaterLevelEwsFloodResponse } from '@/types/api/ews';

import { ROUTES } from '@/utils/configs/route';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';
import useDynamicTime from '@/utils/hooks/useDynamicTime';

type Props = {
  isOverThreshold: boolean;
  isWarning: boolean;
  deviceData: TDeviceObject<TWaterLevelEwsFloodResponse>;
};

export const Tooltip: FC<HTMLAttributes<HTMLDivElement> & Props> = ({
  isOverThreshold,
  isWarning,
  deviceData,
}) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const language = useAppSelector(selectLanguage);
  const alertDuration = useDynamicTime(deviceData?.alert?.receivedon, true);
  const lastUpdateTime = useDynamicLastUpdateTime({
    receivedOn: deviceData?.receivedon,
  });

  return (
    <div className="relative z-10 mt-[230px] flex h-fit w-fit flex-col items-center rounded-lg bg-rs-deep-navy p-4 text-xs">
      <div className="w-[270px]">
        <div className="mb-3 flex items-center justify-between border-b border-rs-v2-thunder-blue pb-2">
          <p className="text-medium border-b border-rs-v2-slate-blue-60% p-0 pb-0 font-bold uppercase">
            {deviceData?.name ?? '-'}
          </p>
          <Link
            className="text-medium cursor-pointer whitespace-nowrap font-semibold text-rs-v2-mint underline xl:text-xs"
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={
              gatewayId
                ? ROUTES.waterLevelGatewayDetail(
                    gatewayId,
                    deviceData.id.toString(),
                  )
                : ROUTES.waterLevelDetail(deviceData.id.toString())
            }
          >
            See Detail
          </Link>
        </div>
        <div className="flex-col gap-2 border-y border-rs-v2-thunder-blue py-2.5 text-white">
          <div className="flex justify-between font-semibold">
            <div className="flex items-center gap-2">
              <MdWater size={16} />
              <p>{localization('Water Level', language)}</p>
            </div>
            <div className="flex gap-2 font-bold">
              <p
                className={cn(
                  isOverThreshold && 'text-rs-alert-danger',
                  isWarning && 'text-rs-alert-yellow',
                )}
              >
                {deviceData?.current_water_level} cm
              </p>
              {(isOverThreshold || isWarning) && (
                <>
                  |
                  <p
                    className={cn(
                      isOverThreshold && 'text-rs-alert-danger',
                      isWarning && 'text-rs-alert-yellow',
                    )}
                  >
                    {alertDuration || '00:00:00'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <p className="my-3 bg-rs-v2-navy-blue py-1 text-center">Location</p>
          <div className="mb-2 flex justify-between text-xs">
            <p>Location</p>
            <p className="text-right font-semibold">
              {deviceData.location.name ?? '-'}
            </p>
          </div>
          <div className="flex justify-between text-xs">
            <p>Coordinate</p>
            <p className="text-right font-semibold">
              {deviceData.lattitude}, {deviceData.longtitude}
            </p>
          </div>
        </div>
        <p className="mt-3.5 text-center text-xs italic text-rs-neutral-chromium first-letter:capitalize">
          {lastUpdateTime}
        </p>
      </div>
      <IoTriangle className="absolute top-[-.6rem] text-rs-deep-navy" />
    </div>
  );
};
