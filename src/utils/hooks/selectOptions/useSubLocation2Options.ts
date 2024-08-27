
import { ILocationWithSublocation2 } from "@/types/api/management/location";
import { BasicSelectOpt } from "@/types/global"

import { useGetSublocation2ListQuery } from "@/stores/managementStore/locationStore/subLocationStoreApi";

type Props = Partial<ILocationWithSublocation2>;

export interface ISubLocation2Opt
  extends BasicSelectOpt<number>,
  ILocationWithSublocation2 { }

interface ReturnVal {
  arr: ISubLocation2Opt[];
  isLoading: boolean;
}

const useSublocation2Opts = (props: Props): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetSublocation2ListQuery(props);
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

export default useSublocation2Opts;
