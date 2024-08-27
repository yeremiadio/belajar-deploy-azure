import React from 'react';

import { Vehicle } from '@/assets/images';
import { cn } from '@/lib/utils';
import { TReservationObject } from '@/types/api/reservation';
import useTimeDifference from '@/utils/hooks/useTimeDifferent';

import DetailPopover from '../DetailPopover';
import { IconStar } from '@/assets/images/Star';

type Props = {
  dockObj?: TReservationObject;
  rotate?: string;
  isRestricted?: boolean;
};

const DockHorizontalComponent: React.FunctionComponent<Props> = ({
  dockObj,
  rotate,
  isRestricted = false,
}) => {
  if (isRestricted) {
    return (
      <div
        className={cn(
          rotate,
          rotate ? 'mt-11' : 'mb-11',
          'box-border overflow-hidden rounded-[8px] border-[0px]',
        )}
      >
        <div className="relative h-full">
          <div className="h-full rounded-[8px] border border-rs-v2-red bg-rs-v2-slate-blue-60% shadow-[inset_0_0_16px_0_#8E2525BF]" />
          <div className="z-2 absolute left-0 top-0 h-full w-full">
            <div className="absolute right-[47%] top-[-4%] h-[106%] w-1 rotate-[385deg] bg-rs-v2-red" />
            <div className="absolute left-[47%] top-[-4%] h-[106%] w-1 rotate-[335deg] bg-rs-v2-red" />
          </div>
        </div>
      </div>
    );
  }

  const dynamicTime = useTimeDifference(dockObj?.dockingDate);

  const content = (
    <div className={cn(rotate, 'flex items-center justify-center')}>
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* {dockObj.isPriority && (
              <FaStar className="text-l absolute right-2 top-2 text-rs-gold-yellow" />
            )} */}
        <div
          className={cn(
            dockObj
              ? 'wrap-border-rs-linear-blue'
              : 'border-[3.8px] border-transparent',
            'mb-2 flex w-full items-center justify-center',
          )}
        >
          <div className={cn(' w-full', dockObj && 'border-rs-linear-blue')}>
            <div
              className={cn(
                'relative flex items-center justify-center  p-1',
                !dockObj && rotate,
                !dockObj &&
                  'rounded-[8px] border border-rs-v2-gunmetal-blue bg-rs-v2-slate-blue-60%',
              )}
            >
              {dockObj?.isPriority && (
                <IconStar className="absolute right-0 top-0 h-6 w-6 text-rs-alert-yellow" />
              )}
              <img
                src={Vehicle}
                alt="vehicle-1"
                className={cn(!dockObj && 'opacity-0')}
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            !dockObj && 'opacity-0',
            rotate,
            'flex h-[30px] w-[64px] items-center justify-center rounded-[4px] bg-rs-v2-navy-blue px-3 py-2 text-center text-xs text-rs-v2-mint xl:w-[60px] xl:text-sm',
          )}
        >
          {dynamicTime.toString()}
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

export default DockHorizontalComponent;
