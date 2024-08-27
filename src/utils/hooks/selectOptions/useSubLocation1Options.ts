
import { ISubLocation1Obj } from "@/types/api/management/location";
import { BasicSelectOpt } from "@/types/global"

import { useGetSublocation1ListQuery } from "@/stores/managementStore/locationStore/subLocationStoreApi";

type Props = Partial<ISubLocation1Obj>;

export interface ISubLocation1Opt
  extends BasicSelectOpt<number>,
  ISubLocation1Obj { }

interface ReturnVal {
  arr: ISubLocation1Opt[];
  isLoading: boolean;
}

const useSublocation1Opts = (props: Props, opt?: { skip?: boolean }): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetSublocation1ListQuery(props, { skip: opt?.skip });
  const isLoading = loading || isFetching;
  if (!data || data.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((val) => {
      return {
        label: val.name,
        value: val.id,
        ...val,
      };
    }),
    isLoading,
  };
};

export default useSublocation1Opts;
