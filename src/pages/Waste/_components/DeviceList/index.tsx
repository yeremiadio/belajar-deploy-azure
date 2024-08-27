import { TWasteDevice } from '@/types/api/wasteMonitoring';
import { getSensorData } from '@/utils/functions/getSensorData';
import { FC } from 'react';

type Props = {
  devices: TWasteDevice;
};

export const DeviceInformationCard: FC<Props> = ({ devices }) => {
  const { status, sensorlog } = devices;
  const isActive = status === 1;

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
        <span className="text-rs-neutral-gray-gull text-sm">
          {devices.name}
        </span>
        <span className="text-rs-neutral-gray-gul text-sm">
          {devices.location?.name}
        </span>
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
          return (
            <div key={index} className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-1 truncate">
                {Icon && <Icon size={15} className="flex-shrink-0" />}
                <p className="min-w-0 text-rs-v2-white text-sm truncate">
                  {' '}
                  {name}
                </p>
              </div>
              <p className="flex-shrink-0 text-rs-v2-white text-sm">
                {isActive ? sensor?.value + ` ${unit}` : '-'}
              </p>
            </div>
          );
        })}
    </div>
  );
};
