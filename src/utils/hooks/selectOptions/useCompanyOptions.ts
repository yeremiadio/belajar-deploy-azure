import { useGetCompaniesV2Query } from '@/stores/managementStore/companyStore/companyStoreApi';
import { loadCookiesOfKeys } from '@/services/cookie';

import { IUserCredentialData } from '@/types/api/user';
import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { ICompanyV2QueryParameterObject } from '@/types/api/management/company';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<ICompanyV2QueryParameterObject>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useCompanyOpts = ({ page = 1, take = 10, isPaginated }: TBackendPaginationRequestObject<Props>, opt?: { skip?: boolean }): ReturnVal => {
  const { data, isLoading: loading } = useGetCompaniesV2Query({ page, take, isPaginated }, { skip: opt?.skip });

  const isLoading = loading;
  const { username } = loadCookiesOfKeys<IUserCredentialData>(['username']);

  if (!data || data.entities.length < 1)
    return {
      arr:
        username === 'adminSinarmas'
          ? [
            {
              label: 'Sinarmas',
              value: 128,
            },
          ]
          : [],
      isLoading,
    };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.name ?? '',
        value: val.id,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useCompanyOpts;
