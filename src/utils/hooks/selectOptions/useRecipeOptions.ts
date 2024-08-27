import { useGetRecipesQuery } from '@/stores/managementStore/recipeStore';

import { Meta, TBackendPaginationRequestObject } from '@/types/api';
import {
  IRecipeObjResponse,
  IRecipeParameterObject,
} from '@/types/api/management/recipe';
import { BasicSelectOpt } from '@/types/global';

type Props = Partial<IRecipeParameterObject>;

interface ReturnVal {
  isLoading: boolean;
  arr: (Partial<IRecipeObjResponse> & BasicSelectOpt<number>)[];
  meta?: Meta;
}

const useRecipeOpts = (
  { page = 1, take = 10, isPaginated }: TBackendPaginationRequestObject<Props>,
  opt?: { skip?: boolean },
): ReturnVal => {
  const { data, isLoading: loading } = useGetRecipesQuery(
    { page, take, isPaginated },
    { skip: opt?.skip },
  );
  const isLoading = loading;

  if (!data || data.entities.length < 1)
    return {
      arr: [],
      isLoading,
    };

  return {
    arr: data.entities.map((val) => {
      return {
        label: val.name ?? '',
        value: val.id,
        ...val,
      };
    }),
    isLoading,
    meta: data.meta,
  };
};

export default useRecipeOpts;
