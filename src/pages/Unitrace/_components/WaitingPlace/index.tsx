import { Fragment, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import { EYardActivityStatusEnum } from '@/types/api/yard';
import { TReservationObject } from '@/types/api/reservation';

import { filteredByActivity } from '@/utils/functions/filteredDock';

import WaitingPopoverComponent from './WaitingPopoverComponent';
import AverageWaitingTimeComponent from '../AverageWaitingTime';

type Props = {
  reservationData: TReservationObject[];
};

const WaitingPlace = ({ reservationData }: Props) => {
  const reservationWaitingData = filteredByActivity(
    EYardActivityStatusEnum.WAITING,
    reservationData,
  );

  const scheduledForToday: number = useMemo(() => {
    if (!reservationData) return 0;
    const start_date = new Date(
      new Date().setHours(0, 0, 0, 0),
    ).toLocaleString();

    const end_date = new Date(
      new Date().setHours(23, 59, 59, 60),
    ).toLocaleString();

    const data = reservationData.filter(
      (item) =>
        start_date >= new Date(item.expectedCheckInDate).toLocaleString() &&
        end_date <= new Date(item.expectedCheckInDate).toLocaleString(),
    );
    return data.length;
  }, [reservationData]);

  return (
    <>
      <div className="mb-4 flex gap-4">
        <div className="flex w-[160px] flex-shrink-0 flex-col">
          <div className="mb-2 flex h-full flex-col items-center justify-center rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-[14px] text-center">
            <div className="mb-3 text-[12px]">Fleet Waiting</div>
            <div className="text-[18px] font-semibold text-rs-v2-mint 2xl:text-[22px]">
              {reservationWaitingData.length}
            </div>
          </div>
          <AverageWaitingTimeComponent
            reservationWaitingData={reservationWaitingData}
          />
        </div>
        <OverlayScrollbarsComponent
          className="z-[2] col-span-7 flex-grow rounded-[8px] border border-rs-v2-thunder-blue bg-transparent"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
          defer
        >
          <div className="">
            <div className="flex min-h-[178.38px] gap-5 p-2">
              {!isEmpty(reservationWaitingData) &&
                reservationWaitingData.map((value, index) => (
                  <Fragment key={index}>
                    <WaitingPopoverComponent waitingObj={value} />
                  </Fragment>
                ))}
            </div>
          </div>
        </OverlayScrollbarsComponent>
        <div className="flex-shrink-0">
          <div className="flex h-full w-[210px] items-center justify-center rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-[14px] py-[8px] text-center">
            <div>
              <div className="mb-2 text-[16px]">Scheduled for Today</div>
              <div className="h-full text-[46px] font-semibold text-rs-v2-mint">
                {scheduledForToday}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WaitingPlace;
