import { useGetSensorQuery } from '@/stores/managementStore/sensorStore/sensorStoreApi';
import { IGetSensorObj, ISensor } from '@/types/api/management/sensor';
import { BasicSelectOpt } from '@/types/global';

interface ISensorOpt extends BasicSelectOpt<number>, ISensor { }

interface ReturnVal {
  arr: ISensorOpt[];
  isLoading: boolean;
}
const useSensorOpts = (obj: IGetSensorObj): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetSensorQuery(obj);
  const isLoading = loading || isFetching;
  if (!data || data.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((aCmp) => {
      return {
        label: aCmp.name,
        value: aCmp.id,
        ...aCmp,
      };
    }),
    isLoading,
  };
};

export default useSensorOpts;
