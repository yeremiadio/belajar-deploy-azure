import { TWasteDevice } from '@/types/api/wasteMonitoring';
import { FC } from 'react';

type Props = {
  devices: TWasteDevice;
};

export const DeviceEmptyCard: FC<Props> = ({ devices }) => {
  return (
    <div
      key={devices.id}
      className='flex flex-col gap-2 bg-rs-v2-galaxy-blue mb-3 p-3 rounded-md'
    >
      <div className='flex flex-row justify-between items-center'>
        <span className='text-rs-neutral-gray-gull text-sm'>
          {devices.name}
        </span>
        <span className='text-rs-neutral-gray-gull text-sm'>
          {devices.location?.name}
        </span>
      </div>
      <hr className='border-[1px] border-rs-v2-gunmetal-blue w-full' />
      <p className='flex flex-col justify-between items-center text-xs'>No Data Found</p>

    </div>
  );
};
