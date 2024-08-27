import { useGetLocationQuery } from "@/stores/managementStore/locationStore/locationStoreApi";

import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { BasicSelectOpt } from "@/types/global"
import { ILocationObj } from "@/types/api/management/location";

type Props = Partial<ILocationObj>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useLocationOpts = ({ companyId, search, isPaginated, page = 1, take = 10 }: TBackendPaginationRequestObject<Props>, opt?: { skip?: boolean }): ReturnVal => {
  const { data, isLoading: loading, isFetching: fetching } = useGetLocationQuery({ companyId, search, page, take, isPaginated }, { skip: opt?.skip });
  const isLoading = loading ?? fetching;

  if (!data || data.entities.length < 1)
    return {
      arr: [],
      isLoading,
    };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.name ?? '',
        value: val.id,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useLocationOpts;

