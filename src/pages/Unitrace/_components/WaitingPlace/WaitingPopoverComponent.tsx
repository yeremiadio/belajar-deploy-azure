import { FC } from 'react';

import { Vehicle } from '@/assets/images';
import { TReservationObject } from '@/types/api/reservation';
import useTimeDifference from '@/utils/hooks/useTimeDifferent';
import { IconStar } from '@/assets/images/Star';

import DetailPopover from '../DetailPopover';

type Props = {
  waitingObj: TReservationObject;
};

const WaitingPopoverComponent: FC<Props> = ({ waitingObj }) => {
  const dynamicTime = useTimeDifference(waitingObj.waitingDate);

  return (
    <DetailPopover
      yardData={waitingObj}
      buttonTrigger={
        <div className="flex h-full items-center justify-center rounded-[4px] pt-1 text-center hover:bg-rs-alert-green-20% hover:outline hover:outline-2 hover:outline-rs-v2-aqua">
          <div className="relative flex flex-col items-center justify-center">
            {waitingObj?.isPriority && (
              <IconStar className="absolute right-0 top-0 h-6 w-6 text-rs-alert-yellow" />
            )}

            <img src={Vehicle} alt="vehicle-1" className="mb-2 h-full" />
            <div className="min-h-[30.59px] w-[64px] overflow-hidden rounded-[4px] bg-rs-v2-navy-blue px-3 py-2 text-xs">
              {dynamicTime.toString()}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default WaitingPopoverComponent;
