import { IoMdStopwatch } from 'react-icons/io';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useDynamicTime from '@/utils/hooks/useDynamicTime';

import { cn } from '@/lib/utils';

import { AvatarImage } from '@/assets/images';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { EYardActivityStatusEnum } from '@/types/api/yard';
import { TReservationObject } from '@/types/api/reservation';

import WorkOrderTable from '../WorkOrderTable';
import { IconStar } from '@/assets/images/Star';
import { IconArrowSmall } from '@/assets/images/ArrowSmall';

dayjs.extend(duration);

type Props = {
  yardData: TReservationObject;
  buttonTrigger: JSX.Element;
};

const DetailPopover = ({ yardData, buttonTrigger }: Props) => {
  const waitingTime = dayjs(yardData.waitingDate);
  const dockingTime = dayjs(yardData.dockingDate);

  // different time between docking and waiting
  const timeDifference = dockingTime.diff(waitingTime);
  const duration = dayjs.duration(timeDifference);
  const durationWaitingToDocking = duration.format('HH:mm:ss');

  return (
    <HoverCard>
      <HoverCardTrigger>{buttonTrigger}</HoverCardTrigger>
      <HoverCardContent className="w-[440px] rounded-[10px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-6 shadow-md">
        {/* <div className="mb-2 flex items-center justify-end">
          <Button
            className="p-0 text-white hover:bg-transparent hover:opacity-75 focus:bg-transparent"
            variant="ghost"
          >
            <MdOutlineClose />
          </Button>
        </div> */}

        <div className="mb-4 grid grid-cols-8 justify-end">
          <div className="col-span-5 flex">
            <img
              src={AvatarImage}
              alt="avatar"
              className="mr-4 h-[40px] w-[40px] rounded-full"
            />
            <div>
              <div>{yardData?.driver?.name}</div>
              <div className="text-rs-neutral-steel-gray">
                {yardData?.driver?.identity && yardData?.driver.identityNumber
                  ? `${yardData?.driver?.identity} - ${yardData?.driver?.identityNumber}`
                  : '-'}
              </div>
            </div>
          </div>

          <div
            className={cn(
              'col-span-3 text-right text-[12px]',
              yardData?.status === EYardActivityStatusEnum.DOCKING &&
                'text-[16px]',
            )}
          >
            <div className="text-[12px]">
              {yardData?.dock?.location?.name ?? '-'}
            </div>
            <div className="text-[12px] text-rs-neutral-steel-gray">
              {yardData?.dock?.name ?? '-'}
            </div>
          </div>
        </div>

        <div className="relative mb-4 rounded-[4px] bg-rs-v2-galaxy-blue p-3">
          {yardData?.isPriority && (
            <IconStar className="absolute right-5 top-5 h-5 w-5 text-rs-alert-yellow" />
          )}

          <div className="text-[18px] font-semibold">
            {yardData?.licensePlate?.plate ?? '-'}
          </div>
          <div className="text-[12px] text-rs-v2-mint">
            {yardData?.vendor?.name ?? '-'}
          </div>
          <div className="flex justify-between">
            <span className="text-[12px]">
              Reservation : {yardData?.id ?? '-'}
            </span>
            {yardData?.category && (
              <div
                className={cn(
                  'flex items-center justify-center gap-2 rounded-full px-4 py-1 text-center',
                  yardData.category === 'OUTBOUND'
                    ? 'bg-[#6d7a54] text-[#e5fc5a]'
                    : 'bg-[#426185] text-[#5aaefc]',
                )}
              >
                <span className="text-sm font-normal">{yardData.category}</span>
                <IconArrowSmall
                  className={cn(
                    'h-3.5 w-3.5',
                    yardData.category !== 'OUTBOUND' && 'rotate-180',
                  )}
                />
              </div>
            )}
          </div>
          <hr className="my-4 w-full border-[1px] border-rs-v2-gunmetal-blue" />

          <div className="grid grid-cols-2">
            <div className="text-[12px]">Expected Check-in</div>
            <div className="text-right text-[12px]">
              {yardData.expectedCheckInDate
                ? dayjs(yardData.expectedCheckInDate).format('DD-MM-YYYY')
                : '-'}
            </div>
            <div className="text-[12px]">Checkin</div>
            <div className="text-right text-[12px]">
              {yardData.actualCheckInDate
                ? dayjs(yardData.actualCheckInDate).format('HH:mm:ss')
                : '-'}
            </div>
            <div className="text-[12px]">Waiting</div>
            <div className="flex items-center justify-end  text-right text-[12px]">
              <div className="mr-1">
                {yardData.waitingDate
                  ? dayjs(yardData.waitingDate).format('HH:mm:ss')
                  : '-'}
              </div>
              |
              <div className="flex items-center">
                <IoMdStopwatch className="ml-1 mr-1 text-[12px] text-rs-v2-mint" />{' '}
                <div className="text-rs-v2-mint">
                  {yardData.dockingDate
                    ? // If the string length is 8, it means it's successfully formatted
                      durationWaitingToDocking.length === 8
                      ? durationWaitingToDocking
                      : '-'
                    : useDynamicTime(yardData.waitingDate, true).toString()}
                </div>
              </div>
            </div>

            <div className="text-[12px]">Docking</div>

            <div className="flex items-center justify-end  text-right text-[12px]">
              <div className="mr-1">
                {yardData.dockingDate &&
                  dayjs(yardData.dockingDate).format('HH:mm:ss')}
              </div>
              {yardData.dockingDate && (
                <>
                  |
                  <div className="flex items-center">
                    <IoMdStopwatch className="ml-1 mr-1 text-[12px] text-rs-v2-mint" />{' '}
                    <div className="text-rs-v2-mint">
                      {useDynamicTime(yardData.dockingDate, true).toString()}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-[12px]">Checkout</div>
            <div className="text-right text-[12px] ">
              {yardData.checkOutDate
                ? dayjs(yardData.checkOutDate).format('HH:mm:ss')
                : ''}
            </div>
          </div>
        </div>
        <div className="max-h-[172px] w-full overflow-y-auto">
          <WorkOrderTable yardData={yardData} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default DetailPopover;
