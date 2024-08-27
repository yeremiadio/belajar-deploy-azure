import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  filteredByActivity,
  transformDocksData,
} from '@/utils/functions/filteredDock';

import { EYardActivityStatusEnum } from '@/types/api/yard';
import { TReservationObject } from '@/types/api/reservation';

import { useGetYardDashboardQuery } from '@/stores/yardStore/yardStoreApi';

import DockPlaceHorizontal from '../DockPlaceHorizontal';
import DockPlaceVertical from '../DockPlaceVertical';
import AverageDockTimeComponent from '../AverageDockTime';

type Props = {
  reservationData: TReservationObject[];
};

const DockingPlace = ({ reservationData }: Props) => {
  const { gatewayId } = useParams<'gatewayId'>();
  const { data: docksData } = useGetYardDashboardQuery(
    {
      gatewayId: Number(gatewayId),
    },
    {
      skip: !gatewayId,
    },
  );

  const transformedDocksData = useMemo(() => {
    return transformDocksData(docksData?.data) ?? [];
  }, [docksData]);

  const reservationDockingData = filteredByActivity(
    EYardActivityStatusEnum.DOCKING,
    reservationData,
  );

  return (
    <div className="flex gap-4">
      <div className="w-[160px] flex-shrink-0">
        <div className="mb-2 flex flex-col items-center justify-center rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-[14px] py-[10px] text-center">
          <div className="mb-3 text-[12px]">Fleet Docking</div>
          <div className="text-[18px] font-semibold text-rs-v2-mint 2xl:text-[22px]">
            {reservationDockingData.length}
          </div>
        </div>
        <AverageDockTimeComponent
          reservationDockingData={reservationDockingData}
        />
      </div>
      <div className="flex-grow gap-4 rounded-[12px] border border-rs-v2-thunder-blue bg-rs-v2-dark-grey p-7">
        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6">
            <DockPlaceHorizontal
              docksData={transformedDocksData[0]}
              containerClassName="mb-12"
              reservationData={reservationDockingData}
            />
            <DockPlaceHorizontal
              rotate="rotate-180"
              docksData={transformedDocksData[2]}
              containerClassName="mb-12"
              reservationData={reservationDockingData}
            />
          </div>
          <div className="col-span-4">
            <DockPlaceVertical
              docksData={transformedDocksData[1]}
              reservationData={reservationDockingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DockingPlace;
