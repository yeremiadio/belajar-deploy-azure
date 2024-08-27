import { TReservationObject } from '@/types/api/reservation';

import DockVerticalComponent from './DockVerticalComponent';

type FilteredDocsData = {
  warehouseName: string;
  docks: {
    code: number;
    name: string;
    isRestricted: boolean;
  }[];
};

type Props = {
  docksData: FilteredDocsData;
  reservationData?: TReservationObject[];
};

const DockPlaceVertical = ({ docksData, reservationData }: Props) => {
  const sortedDocks = docksData?.docks?.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="grid grid-cols-9 gap-2">
      <div className="col-span-4 grid grid-rows-10 justify-end gap-y-0.5">
        {sortedDocks?.map((docks, index) => {
          const found = reservationData?.find(
            (yard: TReservationObject) =>
              yard.dockNumber === docks.code.toString(),
          );

          return (
            <DockVerticalComponent
              key={index}
              dockObj={found}
              isRestricted={docks.isRestricted}
            />
          );
        })}
      </div>
      <div className="col-span-5">
        <div className="wrap-border-rs-linear-blue mb-2 h-full  w-full">
          <div className="border-rs-linear-blue flex h-full w-full items-center justify-center bg-rs-v2-slate-blue-60%">
            {docksData?.warehouseName}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DockPlaceVertical;
