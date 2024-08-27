import { FC } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import Card from '@/components/Card';

import { getSensorData } from '@/utils/functions/getSensorData';
import useDynamicTime from '@/utils/hooks/useDynamicTime';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';

import { TGatewayDevice } from '@/types/api/socket';

import { cn } from '@/lib/utils';

type Props = {
  deviceData?: TGatewayDevice;
};

const InformationCard: FC<Props> = ({ deviceData }) => {
  const lastUpdateTime = useDynamicLastUpdateTime({
    receivedOn: deviceData?.sensorlog?.receivedon,
  });
  const isActive = deviceData?.status === 1;

  return (
    <Card className="px-4 pb-4 pt-5">
      <div className="flex h-full flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">{deviceData?.name}</h2>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-4 w-4 rounded-full',
                isActive ? 'bg-rs-v2-mint' : 'bg-rs-neutral-gray-gull',
              )}
            />
            <p className="text-sm">{isActive ? 'ON' : 'OFF'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">Location</p>
          <p className="text-sm font-semibold">{deviceData?.location?.name}</p>
        </div>
        <OverlayScrollbarsComponent
          className="mt-5 h-full"
          options={{
            scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' },
          }}
          defer
        >
          <div className="flex h-full flex-col gap-3 rounded-lg border border-rs-v2-thunder-blue bg-rs-v2-slate-blue px-3.5 py-3">
            {deviceData?.sensorlog?.data?.map((sensor, index) => {
              const { Icon, name } = getSensorData(sensor?.sensorcode);
              const isWarning = sensor?.alert?.threatlevel === 1;
              const isCritical = sensor?.alert?.threatlevel === 2;
              return (
                <div className="flex justify-between gap-2" key={index}>
                  <div className="flex gap-2 truncate">
                    {Icon && <Icon size={20} className="flex-shrink-0" />}
                    <p>{name}</p>
                  </div>
                  <div className="flex gap-2">
                    <p
                      className={cn(
                        'text-rs-alert-green',
                        isWarning && 'text-rs-alert-yellow',
                        isCritical && 'text-rs-v2-red',
                        'font-semibold',
                      )}
                    >
                      {sensor?.value}
                    </p>
                    <p className="font-semibold">|</p>
                    <ElapsedTime
                      alertStart={sensor?.alert?.alertlog?.receivedon}
                      threatLevel={sensor?.alert?.threatlevel}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </OverlayScrollbarsComponent>
        <p className="mt-2 text-center text-xs font-semibold italic text-rs-neutral-chromium">
          {lastUpdateTime}
        </p>
      </div>
    </Card>
  );
};

const ElapsedTime = ({
  alertStart,
  threatLevel,
}: {
  alertStart?: string;
  threatLevel?: number;
}) => {
  if (!alertStart) return <p className="w-[38px]"></p>;

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

export default InformationCard;
