import { useGetCompanyByIdQuery } from '@/stores/managementStore/companyStore/companyStoreApi';
import { ICompany } from '@/types/api/management/company';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<ICompany>;

interface ReturnVal {
  arr: BasicSelectOpt<number>[];
  isLoading: boolean;
}

const useGatewayThemeByCompanyOpts = (
  props: Props,
  opt?: { skip?: boolean },
): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetCompanyByIdQuery(props, { skip: opt?.skip });
  const isLoading = loading || isFetching;
  if (!data || !data.modules)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.modules.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    }),
    isLoading,
  };
};

export default useGatewayThemeByCompanyOpts;
