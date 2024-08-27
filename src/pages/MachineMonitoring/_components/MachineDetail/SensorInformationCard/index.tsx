import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import Card from '@/components/Card';

import { cn } from '@/lib/utils';

import { TMachineDevice } from '@/types/api/machineMonitoring';

import { getSensorData } from '@/utils/functions/getSensorData';

dayjs.extend(duration);

type Props = {
  device: TMachineDevice | undefined;
  isLoading: Boolean;
};

export const SensorInformationCard: FC<Props> = ({ device, isLoading }) => {
  const is_active = device?.status === 1;

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
    <Card
      className={cn(
        'relative box-border flex h-full flex-col p-6 bg-rs-v2-navy-blue',
        'overflow-hidden',  
      )}
    >
      {device? 
      <>
      <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">
            <p className="font-semibold text-sm">
              {device?.name}
            </p>
          </div>
          <p className={cn(
            'bg-opacity-50 px-2 py-[1px] rounded-[10px] text-sm',
            is_active && 'text-rs-v2-mint bg-rs-v2-mint',
            !is_active && 'text-rs-v2-silver bg-rs-v2-silver'
          )}>{is_active ? "On" : "Off"}</p>
        </div><div className="flex flex-col gap-2 mt-4 w-full h-[200px] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {device && [...device.sensorlog.data]
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
                  const timeDifference = dayjs().diff(sensor?.alert?.alertlog?.receivedon);
                  const duration = dayjs.duration(timeDifference);
                  const durationWaiting = duration.format('HH:mm:ss');

                  return (
                    <div className="flex bg-rs-v2-navy-blue-60% mb-1 p-3 rounded-[8px]" key={index}>
                      <div className="flex items-center gap-1 w-1/2 truncate">
                        <div className="flex-shrink-0 bg-rs-v2-deep-indigo bg-opacity-50 p-2 rounded-[4px]">
                          {Icon && <Icon size={13} className="flex-shrink-0 text-rs-v2-mint" />}
                        </div>
                        <p className="ml-2 min-w-0 text-rs-v2-white text-xs truncate">{name}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs truncate w-1/2",
                        isCritical && 'text-rs-v2-red',
                        isWarning && 'text-rs-alert-yellow',
                        !is_active && 'text-rs-v2-silver'
                      )}>
                        {is_active ? sensor?.value + ` ${unit}` : '-'}
                        <span className="text-white"> | </span>
                        <p className="min-w-0 text-rs-v2-white">
                          {isAlert ? durationWaiting : '-'}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          </> : (
          <p className="flex justify-center items-center h-[40px]">
            {isLoading ? 'Loading your data...' : 'Data not found'}
          </p>
        )}
    </Card>
  );
};
