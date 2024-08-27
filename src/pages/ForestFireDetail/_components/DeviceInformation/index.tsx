import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { FC } from 'react';

import { getSensorData } from '@/utils/functions/getSensorData';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';
import useDynamicTime from '@/utils/hooks/useDynamicTime';

import { cn } from '@/lib/utils';

import Card from '@/components/Card';

import { TGatewayDevice } from '@/types/api/socket';

type Props = {
  deviceData?: TGatewayDevice;
};

const DeviceInformation: FC<Props> = ({ deviceData }) => {
  const isActive = deviceData?.status === 1;
  const receivedOn = deviceData?.sensorlog?.receivedon;
  const lastUpdateTime = useDynamicLastUpdateTime({
    receivedOn,
  });

  return (
    <Card className="h-[500px] overflow-hidden px-4 pb-4 pt-5 lg:h-full">
      <div className="flex h-full flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">{deviceData?.name ?? '-'}</h2>
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
          <p className="text-sm font-semibold">
            {deviceData?.location?.name ?? '-'}
          </p>
        </div>
        <OverlayScrollbarsComponent
          className="mt-5 h-full"
          options={{
            scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' },
          }}
          defer
        >
          <div className="flex flex-col gap-3.5">
            {deviceData?.sensorlog?.data?.map((sensor, index) => {
              const { Icon, name, unit } = getSensorData(sensor.sensorcode);
              const isWarning = sensor?.alert?.threatlevel === 1;
              const isCritical = sensor?.alert?.threatlevel === 2;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-rs-v2-thunder-blue px-[1.1rem] py-[1.25rem] lg:text-lg"
                >
                  <div className="flex items-center gap-3 truncate">
                    {Icon && (
                      <div className="rounded-md bg-rs-v2-slate-blue-60% p-2.5">
                        <Icon
                          size={16}
                          className="flex-shrink-0 text-rs-v2-mint"
                        />
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
                      {sensor?.value} {sensor?.unit ?? unit}
                    </p>
                    <p className="font-normal text-rs-neutral-dark-platinum">
                      |
                    </p>
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

export default DeviceInformation;
