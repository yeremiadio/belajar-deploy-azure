import { useGetUserQuery } from '@/stores/managementStore/userStore';

import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import { IUserParams } from '@/types/api/user';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<IUserParams>;

interface ReturnVal {
  isLoading: boolean;
  arr: BasicSelectOpt<number>[];
  meta?: Meta;
}

const useUserOpts = ( { page = 1, take = 10, isPaginated }: TBackendPaginationRequestObject<Props>,
    opt?: { skip?: boolean },): ReturnVal => {
    const { data, isLoading: loading } =  useGetUserQuery(
        { page, take, isPaginated },
        { skip: opt?.skip },
        );
  const isLoading = loading;

  if (!data || data.entities.length < 1)
    return {
      arr:
        [],
      isLoading,
    };

  return {
    arr: data.entities.map((val) => {
      return {
        label: `${val.firstname} ${val.lastname}` ?? '',
        value: val.id,
        ...val,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useUserOpts;
