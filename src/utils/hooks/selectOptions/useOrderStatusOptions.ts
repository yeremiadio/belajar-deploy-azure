import { OrderStatusEnum } from '@/types/api/order';
import convertTitleCase from '@/utils/functions/convertTitleCase';

const useOrderStatusOptions = () => {
  const data = Object.values(OrderStatusEnum).map((value) => {
    return {
      label: convertTitleCase(value),
      value,
    };
  });

  return { data };
};

export default useOrderStatusOptions;
