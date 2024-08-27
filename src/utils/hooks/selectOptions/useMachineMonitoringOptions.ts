
import { useGetmachineMonitoringListQuery } from "@/stores/machineMonitoringStore";
import { BasicSelectOpt } from "@/types/global";


export interface IMachineMonitoringOpt extends BasicSelectOpt<number>{}

interface ReturnVal {
  arr: IMachineMonitoringOpt[];
  isLoading: boolean;
}
const useMachineMonitoringListOpts = (
    gatewayId : number,
    opt?: { skip?: boolean },
  ): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetmachineMonitoringListQuery( { gatewayId },
    { skip: opt?.skip },);
  const isLoading = loading || isFetching;
  if (!data || data.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((aCmp) => {
      return {
        label: aCmp.machineName,
        value: aCmp.machineId,
        ...aCmp,
      };
    }),
    isLoading,
  };
};

export default useMachineMonitoringListOpts;
