import {
  useGetLicensePlateByIdQuery,
  useGetLicensePlatesQuery,
} from '@/stores/licensePlateStore/licensePlateStoreApi';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { TLicensePlate } from '@/types/api/reservation';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<TLicensePlate>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useLicensePlateOptions = (
  {
    page = 1,
    take = 10,
    isAvailable,
    // To bypass current license plate id from isAvailable filter
    excludedId,
  }: TBackendPaginationRequestObject<Props> & {
    isAvailable: boolean;
    excludedId?: number;
  },
  opt?: { skip?: boolean },
): ReturnVal => {
  const { data: excludedLicensePlate, isLoading: loadingExcludedLicensePlate } =
    useGetLicensePlateByIdQuery(
      {
        id: excludedId ?? 0,
      },
      { skip: !excludedId },
    );

  const { data, isLoading } = useGetLicensePlatesQuery(
    { page, take, isAvailable },
    { skip: opt?.skip },
  );
  if (!data || data?.entities?.length < 1 || loadingExcludedLicensePlate)
    return { arr: [], isLoading };

  const listLicensePlate = data?.entities?.map((val) => {
    return {
      label: val?.plate ?? '',
      value: val?.id,
    };
  });

  const arr = excludedLicensePlate
    ? listLicensePlate.concat({
        label: excludedLicensePlate?.plate ?? '',
        value: excludedLicensePlate?.id,
      })
    : listLicensePlate;

  return {
    arr,
    isLoading,
    meta: data.meta,
  };
};

export default useLicensePlateOptions;
