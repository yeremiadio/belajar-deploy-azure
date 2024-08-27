import {
  useGetDriverByIdQuery,
  useGetDriversQuery,
} from '@/stores/driverStore/driverStoreApi';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { TDriver } from '@/types/api/reservation';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<
  TDriver & {
    isPaginated?: boolean;
    isAvailable?: boolean; // To get only available drivers
  }
>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useDriverNameOptions = (
  {
    page = 1,
    take = 10,
    isPaginated = false,
    isAvailable,
    // To bypass current driver id from isAvailable filter
    excludedId,
  }: TBackendPaginationRequestObject<Props> & { excludedId?: number },
  opt?: { skip?: boolean },
): ReturnVal => {
  const { data: excludedDriver, isLoading: loadingExcludedDriver } =
    useGetDriverByIdQuery({ id: excludedId ?? 0 }, { skip: !excludedId });

  const { data, isLoading } = useGetDriversQuery(
    { page, take, isPaginated, isAvailable },
    { skip: opt?.skip },
  );
  if (!data || data.entities.length < 1 || loadingExcludedDriver)
    return { arr: [], isLoading };

  const listDriver = data.entities.map((val) => {
    return {
      label: val.name ?? '',
      value: val.id,
    };
  });
  const arr = excludedDriver
    ? listDriver.concat({
        label: excludedDriver.name ?? '',
        value: excludedDriver.id,
      })
    : listDriver;

  return {
    arr,
    isLoading,
    meta: data.meta,
  };
};

export default useDriverNameOptions;
