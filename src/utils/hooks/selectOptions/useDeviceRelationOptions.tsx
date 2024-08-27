import { useGetDeviceRelationQuery } from '@/stores/managementStore/deviceStore/deviceSensorStoreApi';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { BasicSelectOpt as IBasicSelectOption } from '@/types/global';

interface ReturnVal {
  arr: IBasicSelectOption<number>[];
  isLoading: boolean;
  meta?: Meta;
}

interface Props {
  sensortypeId: number;
}

const useDeviceRelationOptions = (
  { sensortypeId, page = 1, take = 10 }: TBackendPaginationRequestObject<Props>,
  opt?: { skip?: boolean },
): ReturnVal => {
  const {
    data,
    isLoading: loading,
    // isFetching,
  } = useGetDeviceRelationQuery(
    { sensortypeId, page, take, versionHeader: 2 },
    { skip: opt?.skip },
  );
  const isLoading = loading;

  if (!data || data?.entities?.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data?.entities?.map((val) => {
      return {
        label: val?.device?.name ?? '',
        value: val?.id,
      };
    }),
    isLoading,
    meta: data?.meta,
  };
};

export default useDeviceRelationOptions;
