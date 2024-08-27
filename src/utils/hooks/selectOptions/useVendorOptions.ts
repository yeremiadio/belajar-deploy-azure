import { useGetVendorsQuery } from '@/stores/vendorStore/vendorStoreApi';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { TVendor } from '@/types/api/reservation';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<
  TBackendPaginationRequestObject<{
    search?: string;
    isPaginated?: boolean;
  }>
>;

interface ReturnVal<T> {
  isLoading: boolean;
  arr: T[];
  meta?: Meta;
}

const useVendorOptions = (
  { page = 1, take = 100, isPaginated = false }: Props,
  opt?: { skip?: boolean },
): ReturnVal<BasicSelectOpt<number> & TVendor> => {
  const { data, isLoading } = useGetVendorsQuery(
    { page, take, isPaginated },
    { skip: opt?.skip },
  );
  if (!data || data.entities.length < 1) return { arr: [], isLoading };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.name ?? '',
        value: val.id,
        ...val,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useVendorOptions;
