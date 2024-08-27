import { useGetInventoryTypeQuery } from '@/stores/managementStore/inventoryStore';

import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { BasicSelectOpt } from '@/types/global';
import { IInventoryParams } from '@/types/api/management/inventory';


type Props = Partial<IInventoryParams>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<string>[];
  meta?: Meta;
}

const useInventoryTypeOpts = (
  { page = 1, take = 10, isPaginated }: TBackendPaginationRequestObject<Props>,
  opt?: { skip?: boolean },
): ReturnVal => {
  const { data, isLoading: loading } = useGetInventoryTypeQuery(
    { page, take, isPaginated },
    { skip: opt?.skip },
  );
  const isLoading = loading;

  if (!data || data.entities.length < 1)
    return {
      arr: [],
      isLoading,
    };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.name ?? '',
        value: val.name,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useInventoryTypeOpts;
