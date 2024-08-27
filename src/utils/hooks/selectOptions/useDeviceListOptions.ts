
import { BasicSelectOpt } from "@/types/global";
import { IGetDeviceObj } from "@/types/api/management/device";
import { useGetDevicesQuery } from "@/stores/managementStore/deviceStore/deviceStoreApi";

interface IDeviceOpt extends BasicSelectOpt<number>{}

interface ReturnVal {
  arr: IDeviceOpt[];
  isLoading: boolean;
}
const useDeviceListOpts = (obj: IGetDeviceObj): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetDevicesQuery(obj);
  const isLoading = loading || isFetching;
  if (!data || data.entities.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.entities.map((aCmp) => {
      return {
        label: aCmp.name,
        value: aCmp.id,
        ...aCmp,
      };
    }),
    isLoading,
  };
};

export default useDeviceListOpts;
