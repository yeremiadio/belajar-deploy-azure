import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import { cn } from '@/lib/utils';

import InformationWrapper from '@/pages/MachineMonitoring/_components/InformationWrapper';

import { getSensorData } from '@/utils/functions/getSensorData';
import { TWasteDevice } from '@/types/api/wasteMonitoring';

dayjs.extend(duration);

type Props = {
  devices: TWasteDevice;
};

export const SensorInformationCard: FC<Props> = ({ devices }) => {
  const { status, sensorlog } = devices;
  const is_active = status === 1;

  const convertSensorToRank = (sensor: string): number => {
    switch (sensor) {
      case 'temp':
        return 1;
      case 'hmdt':
        return 2;
      case 'smke':
        return 3;
      case 'lpg':
        return 4;
      case 'mthn':
        return 5;
      case 'co':
        return 6;
      case 'prpn':
        return 7;
      default:
        return 0;
    }
  };

  return (
    <div
      key={devices.id}
      className="flex flex-col gap-2 bg-rs-v2-galaxy-blue mb-3 p-3 rounded-md"
    >
      <div className="flex flex-row justify-between items-center">
        <span className="text-rs-neutral-gray-gull text-sm"> {devices.name}</span>
        <span className="text-rs-neutral-gray-gull text-sm"> {devices.location?.name}</span>
      </div>
      <hr className="border-[1px] border-rs-v2-gunmetal-blue w-full" />
      {[...sensorlog.data]
        .sort((a, b) => {
          return (
            convertSensorToRank(b.sensorcode) -
            convertSensorToRank(a.sensorcode)
          );
        })
        .map((sensor, index) => {
          const { Icon, name, unit } = getSensorData(sensor?.sensorcode);
          const isAlert = sensor.alert ? true : false;
          const isCritical = sensor.alert?.threatlevel === 2;
          const isWarning = sensor.alert?.threatlevel === 1;
          const timeDifference = dayjs().diff(
            sensor?.alert?.alertlog?.receivedon,
          );
          const duration = dayjs.duration(timeDifference);
          const durationWaiting = duration.format('HH:mm:ss');
          return (
            <InformationWrapper
              isCritical={isCritical}
              isWarning={isWarning}
              isActive={is_active}
              key={index}
            >
              <div className="flex items-center gap-1 truncate">
                {Icon && <Icon size={15} className="flex-shrink-0" />}
                <p className="min-w-0 text-rs-v2-white truncate">{name}</p>
              </div>
              <div
                className={cn(
                  'flex w-1/2 items-center gap-1 truncate text-xs',
                  isCritical && 'text-rs-v2-red',
                  isWarning && 'text-rs-alert-yellow',
                  !is_active && 'text-rs-v2-silver',
                )}
              >
                {is_active ? sensor?.value + ` ${unit}` : '-'}
                <span className="text-white"> | </span>
                <p className="min-w-0 text-rs-v2-white">
                  {isAlert ? durationWaiting : '-'}
                </p>
              </div>
            </InformationWrapper>
          );
        })}
    </div>
  );
};
