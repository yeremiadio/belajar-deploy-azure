import React from 'react';

import { VehicleRotate } from '@/assets/images';
import { cn } from '@/lib/utils';
import { TReservationObject } from '@/types/api/reservation';
import useTimeDifference from '@/utils/hooks/useTimeDifferent';

import DetailPopover from '../DetailPopover';
import { IconStar } from '@/assets/images/Star';

type Props = {
  dockObj?: TReservationObject;
  isRestricted?: boolean;
};

const DockVerticalComponent: React.FunctionComponent<Props> = ({
  dockObj,
  isRestricted,
}) => {
  if (isRestricted) {
    return (
      <div className="ml-[3.75rem] overflow-hidden rounded-[8px] border-[3.8px] border-transparent">
        <div className="relative h-full">
          <div className="h-full rounded-[8px] border border-rs-v2-red bg-rs-v2-slate-blue-60% shadow-[inset_0_0_16px_0_#8E2525BF]" />
          <div className="z-2 relative left-0 top-0 h-full w-full">
            <div className="absolute right-[49%] top-[-160%] h-[220%] w-1 rotate-[424deg] bg-rs-v2-red" />
            <div className="absolute left-[48%] top-[-160%] h-[220%] w-1 rotate-[297deg] bg-rs-v2-red" />
          </div>
        </div>
      </div>
    );
  }

  const dynamicTime = useTimeDifference(dockObj?.dockingDate);
  const content = (
    <div className="flex items-center justify-center gap-2">
      <div
        className={cn(
          'rotate-360 flex h-[30px] w-[66px] items-center justify-center overflow-hidden rounded-[4px] bg-rs-v2-navy-blue px-3 py-2 text-xs text-rs-v2-mint',
          !dockObj && 'opacity-0',
        )}
      >
        {dynamicTime.toString()}
      </div>
      <div
        className={cn(
          dockObj
            ? 'wrap-border-rs-linear-blue'
            : 'border-[3.8px] border-transparent',
          'flex w-full items-center justify-center',
        )}
      >
        <div className={cn('w-full', dockObj && 'border-rs-linear-blue')}>
          <div
            className={cn(
              'relative flex w-full items-center justify-center p-1',
              !dockObj &&
                'rounded-[8px] border border-rs-v2-gunmetal-blue bg-rs-v2-slate-blue-60%',
            )}
          >
            {dockObj?.isPriority && (
              <IconStar className="absolute right-0 top-0 h-6 w-6 text-rs-alert-yellow" />
            )}
            <img
              src={VehicleRotate}
              alt="vehicle-1"
              className={cn(!dockObj && 'opacity-0')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return dockObj ? (
    <DetailPopover yardData={dockObj} buttonTrigger={content} />
  ) : (
    content
  );
};

export default DockVerticalComponent;
