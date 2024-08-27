import { useGetMachineQuery } from '@/stores/managementStore/machineStore/machineStoreApi';

import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { IMachineParameterObject } from '@/types/api/management/machine';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<IMachineParameterObject>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useMachineOpts = (
  { page = 1, take = 10 }: TBackendPaginationRequestObject<Props>,
  opt?: { skip?: boolean },
): ReturnVal => {
  const { data, isLoading: loading } = useGetMachineQuery(
    { page, take },
    { skip: opt?.skip },
  );
  const isLoading = loading;

  if (!data || data.entities.length < 1)
    return {
      arr:
        [],
      isLoading,
    };

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

export default useMachineOpts;
