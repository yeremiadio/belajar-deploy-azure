import { PaymentTermsEnum } from '@/types/api/order';
import convertTitleCase from '@/utils/functions/convertTitleCase';

const useOrderTermsOptions = () => {
  const data = Object.values(PaymentTermsEnum).map((value) => {
    return {
      label: convertTitleCase(value),
      value,
    };
  });

  return { data };
};

export default useOrderTermsOptions;
