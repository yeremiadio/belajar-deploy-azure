import { useGetWaterlevelOptionsQuery } from '@/stores/waterLevelStore/waterLevelStoreApi';
import { WaterLevelDeviceSensorEnum } from '@/types/api/waterLevel';

type Props = {
  gatewayId: number 
}

const useWaterLevelDeviceOptions = ({gatewayId}: Props) => {
  const { data: items, isLoading } = useGetWaterlevelOptionsQuery({gatewayId : gatewayId});

  const dataOptions = items?.map((value) => {
    return {
      label: WaterLevelDeviceSensorEnum[value as keyof typeof WaterLevelDeviceSensorEnum],
      value,
    };
  });

  return { dataOptions, isLoading };
};

export default useWaterLevelDeviceOptions;
