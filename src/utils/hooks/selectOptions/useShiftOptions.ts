
import { BasicSelectOpt } from '@/types/global';

import { IShift } from '@/types/api/management/shift';
import { useGetShiftQuery } from '@/stores/managementStore/shiftStore/shiftStoreApi';

type Props = Partial<IShift>;

interface IShiftOpt extends BasicSelectOpt<number>, IShift { }

interface ReturnVal {
  arr: IShiftOpt[];
  isLoading: boolean;
}

const useShiftOptions = (props: Props, opt?: { skip?: boolean }): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetShiftQuery(props, { skip: opt?.skip });
  const isLoading = loading || isFetching;
  if (!data)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((item) => {
      return {
        label: item.name,
        value: item.id,
        ...item,
      };
    }),
    isLoading,
  };
};

export default useShiftOptions;
