import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import { TMachineDevice, TMachineStateTime } from '@/types/api/machineMonitoring';

dayjs.extend(duration);

type Props = {
  device: TMachineDevice | undefined;
  isLoading: Boolean;
  dataMachineState: TMachineStateTime[] | undefined;
};

export const MachineStateInformation: FC<Props> = ({ dataMachineState, device, isLoading }) => {
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '00:00:00';
  
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');
    const timeDifference = end.diff(start);
  
    const duration = dayjs.duration(timeDifference);
    return duration.format('HH:mm:ss');
  };
  return (
    <div className="relative flex flex-col bg-transparent px-5">
      {device ? (
        <>
          <div className="flex flex-col gap-2 w-full">
            {/* Header */}
            <div className="flex mb-2 p-3 border-b-[1px] border-b-rs-divider-gray font-bold text-black">
              <div className="flex items-center w-1/2">
                <p className="ml-2 min-w-0 text-xs">Start</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">End</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">Duration</p>
              </div>
              <div className="flex items-center w-1/4">
                <p className="min-w-0 text-xs">Status</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {dataMachineState &&
                dataMachineState.map((value, index) => {
                  const durationWaiting = calculateDuration(value.startTime, value.endTime);

                  const statusClass =
                    value.status === 'Maintenance'
                      ? 'pb-3 mt-2 px-2 text-rs-alert-danger'
                      : value.status === 'Iddle'
                        ? 'pb-3 mt-2 px-2 text-rs-neutral-gray-gull'
                        : value.status === 'Running'
                          ? 'pb-3 mt-2 px-2 text-rs-alert-green'
                          : value.status === 'Off'
                            ? 'pb-3 mt-2 px-2 text-rs-v2-linear-black'
                            : '';

                  return (
                    <div
                      className="flex justify-middle mt-[-20px] mb-2 p-3 border-b-[1px] border-b-rs-divider-gray text-black"
                      key={index}
                    >
                      <div className="flex items-center w-1/2">
                        <p className="ml-2 min-w-0 text-xs">
                          {value.startTime ? value.startTime : '-'}
                        </p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className="min-w-0 text-xs">
                          {value.endTime ? value.endTime : '-'}
                        </p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className="min-w-0 text-xs">
                          {durationWaiting ?? '-'}
                        </p>
                      </div>
                      <div className="flex items-center w-1/4">
                        <p className={`min-w-0 text-xs ${statusClass}`}>
                          {value.status}
                        </p>
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
