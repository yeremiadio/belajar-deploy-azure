import { useGetDeliveryOrderQuery } from '@/stores/purchaseOrderStore/deliveryOrderApi';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { TOrderDelivery } from '@/types/api/order/orderDelivery';
import { TVendor } from '@/types/api/reservation';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<TVendor>;

interface ReturnVal<T> {
  isLoading: boolean;
  arr: T[];
  meta?: Meta;
}

const useDeliveryOrderOptions = (
  { page = 1, take = 100 }: TBackendPaginationRequestObject<Props>,
  opt?: { skip?: boolean },
): ReturnVal<BasicSelectOpt<number> & TOrderDelivery> => {
  const { data, isLoading } = useGetDeliveryOrderQuery(
    { page, take },
    { skip: opt?.skip },
  );
  if (!data || data.entities.length < 1) return { arr: [], isLoading };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.deliveryId ?? '',
        value: val.id,
        ...val,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useDeliveryOrderOptions;
