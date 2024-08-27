import Card from '@/components/Card';

import { cn } from '@/lib/utils';

import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

import { getSensorData } from '@/utils/functions/getSensorData';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';
import useDynamicTime from '@/utils/hooks/useDynamicTime';

type Props = {
  data: IDeviceLocationWaterLevelObj | undefined;
};

const CurrentStatusCard = ({ data }: Props) => {
  const deviceData = data?.device_summary;
  const receivedOnDevice = deviceData?.receivedon;
  const receivedOn = deviceData?.alert?.receivedon;
  const threatLevel = deviceData?.alert?.alert.threatlevel;
  const isCritical = threatLevel === 2;
  const isWarning = threatLevel === 1;
  const { name, Icon, unit } = getSensorData('wlvl');
  const lastUpdate = useDynamicLastUpdateTime({
    receivedOn: receivedOnDevice,
  });
  return (
    <Card className="overflow-y-hidden px-4 pb-4 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Current Status</h2>
      </div>
      <div className="mt-5 h-fit">
        <div className="flex h-[220px] flex-col gap-3 rounded-lg overflow-y-auto">
          <div className="flex items-center justify-between rounded-lg bg-rs-v2-thunder-blue px-[1.1rem] py-[1rem] lg:text-lg">
            <div className="flex items-center gap-3 truncate">
              {Icon && (
                <div className="rounded-md bg-rs-v2-slate-blue-60% p-2.5">
                  <Icon size={16} className="flex-shrink-0 text-rs-v2-mint" />
                </div>
              )}
              <p className="truncate">{name}</p>
            </div>
            <div className="flex flex-shrink-0 gap-2 pe-3 font-semibold">
              <p
                className={cn(
                  isWarning && 'text-rs-alert-yellow',
                  isCritical && 'text-rs-v2-red',
                )}
              >
                {data?.device_summary.current_water_level ?? 0} {unit}
              </p>
              {isWarning || isCritical ? (
                <>
                  <p className="font-normal text-rs-neutral-dark-platinum">|</p>
                  <ElapsedTime
                    alertStart={receivedOn}
                    threatLevel={threatLevel}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
        <p className="text-xs italic text-rs-neutral-chromium first-letter:capitalize text-center mt-4 h-full">
          {lastUpdate}
        </p>
      </div>
    </Card>
  );
};
const ElapsedTime = ({
  alertStart,
  threatLevel,
}: {
  alertStart?: string | null;
  threatLevel?: number;
}) => {
  if (!alertStart) return <p className="w-[38px]">-</p>;

  const time = useDynamicTime(alertStart);

  return (
    <p
      className={cn(
        'w-[38px] font-semibold',
        threatLevel === 1 && 'text-rs-alert-yellow',
        threatLevel === 2 && 'text-rs-v2-red',
      )}
    >
      {time}
    </p>
  );
};
export default CurrentStatusCard;
