import { useGetYardDashboardQuery } from '@/stores/yardStore/yardStoreApi';
import { BasicSelectOpt } from '@/types/global';

type Props = {
  gatewayId: number;
};

interface ReturnVal {
  arr: BasicSelectOpt<number>[];
  isLoading: boolean;
}

export const useWarehouseOpts = (
  props: Props,
  opt?: { skip?: boolean },
): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetYardDashboardQuery(props, { skip: opt?.skip });
  const isLoading = loading || isFetching;

  if (!data || !data.data || !data.data.docks)
    return {
      arr: [],
      isLoading,
    };

  return {
    arr: data.data.warehouses.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    }),
    isLoading,
  };
};
