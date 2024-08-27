import { useGetLOVQuery } from '@/stores/lovStore';
import { LOVTypeEnum } from '@/types/api';
import convertTitleCase from '@/utils/functions/convertTitleCase';

const useClassVehicleOptions = () => {
  const { data: items, isLoading } = useGetLOVQuery({type: LOVTypeEnum.LICENSE_PLATE_TYPE});

  const dataOptions = items?.map((value) => {
    return {
      label: convertTitleCase(value),
      value,
    };
  });

  return { dataOptions, isLoading };
};

export default useClassVehicleOptions;
