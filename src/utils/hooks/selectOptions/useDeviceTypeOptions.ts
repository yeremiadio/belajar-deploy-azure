import { useMemo } from "react";

import { BasicSelectOpt } from "@/types/global";
import { IDeviceTypeShort } from "@/types/api/management/device";

import { useGetDevicetypesQuery } from "@/stores/managementStore/deviceTypeStore/deviceTypeStoreApi";

interface ReturnVal {
  arr: ADevicetypeOpt[];
  isLoading: boolean;
}

interface ADevicetypeOpt extends BasicSelectOpt<number>, IDeviceTypeShort { }

const useDeviceTypeOpts = (): ReturnVal => {
  const { data: list, isLoading, isFetching } = useGetDevicetypesQuery({});

  return useMemo<ReturnVal>(() => {
    let opts: ADevicetypeOpt[] = [];
    if (list && list.length) {
      list.forEach((val) => {
        opts.push({
          value: val.id,
          label: val.name,
          ...val,
        });
      });
    }
    return { arr: opts, isLoading: isLoading || isFetching };
  }, [list, isLoading, isFetching]);
};

export default useDeviceTypeOpts;
