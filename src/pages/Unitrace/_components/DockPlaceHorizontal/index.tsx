import { cn } from '@/lib/utils';

import { TReservationObject } from '@/types/api/reservation';

import DockHorizontalComponent from './DockHorizontalComponent';

type FilteredDocksData = {
  warehouseName: string;
  docks: {
    code: number;
    name: string;
    isRestricted: boolean;
  }[];
};

type Props = {
  rotate?: string;
  containerClassName?: string;
  docksData: FilteredDocksData;
  reservationData?: TReservationObject[];
};

const DockPlace = ({
  rotate,
  containerClassName,
  docksData,
  reservationData,
}: Props) => {
  const sortedDocks = docksData?.docks?.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className={cn(containerClassName)}>
      {!rotate && (
        <div className={cn('wrap-border-rs-linear-blue mb-2 w-full')}>
          <div
            className={cn(
              rotate,
              'border-rs-linear-blue flex h-[182px] w-full  items-center justify-center bg-rs-v2-slate-blue-60%',
            )}
          >
            {docksData?.warehouseName}
          </div>
        </div>
      )}

      <div className="grid grid-cols-10 gap-0.5">
        {sortedDocks?.map((docks, index) => {
          const found = reservationData?.find(
            (yard: TReservationObject) =>
              yard.dockNumber === docks.code.toString(),
          );

          return (
            <DockHorizontalComponent
              key={index}
              dockObj={found}
              rotate={rotate}
              isRestricted={docks.isRestricted}
            />
          );
        })}
      </div>
      {rotate && (
        <div className={cn('wrap-border-rs-linear-blue mt-2 w-full')}>
          <div
            className={cn(
              'border-rs-linear-blue flex h-[182px] w-full  items-center justify-center bg-rs-v2-slate-blue-60%',
            )}
          >
            {docksData?.warehouseName}
          </div>
        </div>
      )}
    </div>
  );
};
export default DockPlace;
