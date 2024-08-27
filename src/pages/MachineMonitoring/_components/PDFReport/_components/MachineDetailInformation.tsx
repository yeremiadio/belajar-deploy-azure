import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import { TMachineDevice } from '@/types/api/machineMonitoring';

import { getSensorData } from '@/utils/functions/getSensorData';

dayjs.extend(duration);

type Props = {
  device: TMachineDevice | undefined;
  isLoading: Boolean;

};

export const MachineDetailInformation: FC<Props> = ({ device, isLoading }) => {
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
    <div className='relative flex flex-col bg-transparent px-5'>
      {device ? (
        <>
          <div className="flex flex-col gap-2 w-full">
            {/* Header */}
            <div className="flex mb-2 p-3 border-b-[1px] border-b-rs-divider-gray font-bold text-black">
              <div className="flex items-center w-1/2">
                <p className="ml-2 min-w-0 text-xs">Parameter</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">Value</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">Status</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">Alert Time</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {device &&
                [...device.sensorlog.data]
                  .sort((a, b) => {
                    return convertSensorToRank(b.sensorcode) - convertSensorToRank(a.sensorcode);
                  })
                  .map((sensor, index) => {
                    const { name, unit } = getSensorData(sensor?.sensorcode);
                    const isAlert = sensor.alert ? true : false;
                    const isCritical = sensor.alert?.threatlevel === 2;
                    const isWarning = sensor.alert?.threatlevel === 1;
                    const timeDifference = dayjs().diff(sensor?.alert?.alertlog?.receivedon);
                    const duration = dayjs.duration(timeDifference);
                    const durationWaiting = duration.format('HH:mm:ss');

                    const statusClass = isCritical
                      ? 'bg-opacity-20 pb-3 mt-2 px-2 rounded-[10px] text-rs-alert-danger bg-rs-alert-danger'
                      : isWarning
                      ? 'bg-opacity-20 pb-3 mt-2 px-2 rounded-[10px] text-rs-alert-warning bg-rs-alert-warning'
                      : !isAlert
                      ? 'bg-opacity-20 pb-3 mt-2 px-2 rounded-[10px] text-rs-alert-green bg-rs-alert-green'
                      : !is_active
                      ? 'bg-opacity-20 pb-3 mt-2 px-2 rounded-[10px] text-rs-v2-silver bg-rs-v2-silver'
                      : '';

                    const statusText = isCritical
                      ? 'Critical'
                      : isWarning
                      ? 'Warning'
                      : !isAlert
                      ? 'Normal'
                      : !is_active
                      ? 'Off'
                      : 'Active';

                    return (
                      <div className="flex justify-middle mt-[-20px] mb-2 p-3 border-b-[1px] border-b-rs-divider-gray text-black" key={index}>
                      <div className="flex items-center w-1/2">
                        <p className="ml-2 min-w-0 text-xs">{name}</p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className="min-w-0 text-xs">{is_active ? sensor?.value + ` ${unit}` : '-'}</p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className={`min-w-0 text-xs ${statusClass}`}>{statusText}</p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className="min-w-0 text-xs">{isAlert ? durationWaiting : '-'}</p>
                      </div>
                    </div>
                    );
                  })}
            </div>
          </div>
        </>
      ) : (
        <p className="flex justify-center items-center h-[40px]">
          {isLoading ? 'Loading your data...' : 'Data not found'}
        </p>
      )}
    </div>
  );
};
