import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import { TMachineDevice } from '@/types/api/machineMonitoring';

import { getSensorData } from '@/utils/functions/getSensorData';
import InformationWrapper from '@/pages/MachineMonitoring/_components/InformationWrapper';

dayjs.extend(duration);

type Props = {
  device: TMachineDevice;
};

export const MachineInformationCard: FC<Props> = ({ device }) => {
  const { status, sensorlog} = device;
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
    <div className="flex flex-col gap-2">
      {[...sensorlog.data]
        .sort((a, b) => {
          return (
            convertSensorToRank(b.sensorcode) -
            convertSensorToRank(a.sensorcode)
          );
        })
        .map((sensor, index) => {
          const { Icon, name, unit } = getSensorData(sensor?.sensorcode);
          const isCritical = sensor.alert?.threatlevel === 2;
          const isWarning = sensor.alert?.threatlevel === 1;
          return ( 
            <InformationWrapper
            isCritical={isCritical}
            isWarning={isWarning}
            isActive={is_active}
            key={index}
          >
            <div className="flex items-center gap-1 truncate">
              {Icon && <Icon size={15} className="flex-shrink-0" />}
              <p className="min-w-0 font-normal text-rs-v2-white truncate">{name}</p>
            </div>
            <p className="flex-shrink-0 font-semibold text-rs-v2-white">
            {is_active ? sensor?.value + ` ${unit}` : '-'}
            </p>
          </InformationWrapper>
          );
        })}
    </div>
  );
};
