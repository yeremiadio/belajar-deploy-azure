import { BasicSelectOpt } from '@/types/global';

import { useGetMachineRecipesDetailsQuery } from '@/stores/managementStore/recipeStore';

import { IRecipeObjResponse } from '@/types/api/management/recipe';

type Props = { id: number };

interface IMachineRecipeOpt
  extends BasicSelectOpt<number>,
    Partial<IRecipeObjResponse> {}

interface ReturnVal {
  arr: IMachineRecipeOpt[];
  isLoading: boolean;
}

const useMachineRecipeOpts = (
  props: Props,
  opt?: { skip?: boolean },
): ReturnVal => {
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetMachineRecipesDetailsQuery(props, { skip: opt?.skip });

  const isLoading = loading || isFetching;

  if (!data)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.machineRecipes.map((val) => {
      return {
        label: val.machine.name,
        value: val.machineId,
        ...val,
      };
    }),
    isLoading,
  };
};

export default useMachineRecipeOpts;
