import { useGetLOVQuery } from '@/stores/lovStore';
import { LOVTypeEnum } from '@/types/api';

const useIdentityTypeOptions = () => {
  const { data: items, isLoading } = useGetLOVQuery({type: LOVTypeEnum.DRIVER_IDENTITY_TYPE});

  const dataOptions = items?.map((value) => {
    return {
      label: value,
      value,
    };
  });

  return { dataOptions, isLoading };
};

export default useIdentityTypeOptions;
