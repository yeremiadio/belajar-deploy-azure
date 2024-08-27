import {
  IGateway,
  IGatewayRequestObject,
} from '@/types/api/management/gateway';
import { BasicSelectOpt } from '@/types/global';

import { useGetGatewayListQuery } from '@/stores/managementStore/gatewayStoreApi';

type Props = Partial<IGatewayRequestObject> & { isPaginated: boolean };

interface IGatewayOpt extends BasicSelectOpt<number>, IGateway { }

interface ReturnVal {
  arr: IGatewayOpt[];
  isLoading: boolean;
}

const useGatewayOpts = (props: Props, opt?: { skip?: boolean }): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetGatewayListQuery(props, { skip: opt?.skip });
  const isLoading = loading || isFetching;
  if (!data || !data.entities)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.entities.map((item) => {
      return {
        label: item.name,
        value: item.id,
        ...item,
      };
    }),
    isLoading,
  };
};

export default useGatewayOpts;
