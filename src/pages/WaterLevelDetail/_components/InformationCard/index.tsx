import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useMemo } from 'react';

import Card from '@/components/Card';

import { cn } from '@/lib/utils';

import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

import { getSensorData } from '@/utils/functions/getSensorData';

type Props = {
  data: IDeviceLocationWaterLevelObj | undefined;
};

const InformationWaterLevelCard = ({ data }: Props) => {
  const deviceData = data?.device_summary;
  const detailInformationMemo = useMemo(
    () => [
      {
        label: 'Device Status',
        value: deviceData?.is_active ? 'ON' : 'OFF',
        className: 'text-rs-alert-green',
      },
      {
        label: 'Device ID',
        value: deviceData?.id ?? '-',
      },
      {
        label: 'Device Type',
        value: 'Water Level',
      },
      {
        label: 'Location',
        value: deviceData?.location.name ?? '-',
      },
      {
        label: 'Sensor Qty',
        value: 1,
      },
      {
        label: 'Sensor Type',
        value: getSensorData('wlvl').name,
      },
    ],
    [deviceData],
  );

  return (
    <Card className="overflow-y-hidden px-4 pb-4 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{deviceData?.name}</h2>
      </div>
      <OverlayScrollbarsComponent className="mt-5 h-fit bg-rs-v2-galaxy-blue">
        <div className="flex h-full flex-col gap-3 rounded-lg border border-rs-v2-thunder-blue bg-rs-v2-slate-blue px-3.5 py-3">
          {detailInformationMemo.map((item) => (
            <div className="flex justify-between gap-2 mb-1">
              <div className="flex gap-2 truncate">{item.label}</div>
              <div className="flex gap-2">
                <p className={cn(item.className, 'font-semibold')}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* {deviceData?.sensorlog?.data?.map((sensor, index) => {
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
          })} */}
        </div>
      </OverlayScrollbarsComponent>
    </Card>
  );
};

export default InformationWaterLevelCard;
