import { useGetUsertypeQuery } from "@/stores/userTypeStoreApi";

import { BasicSelectOpt } from "@/types/global";
import { IUsertypeData, IUsertypeRequestParams } from "@/types/api/userType";


interface IUserTypeOpt extends BasicSelectOpt<number>, IUsertypeData { }

interface ReturnVal {
  arr: IUserTypeOpt[];
  isLoading: boolean;
}
const useUsertypeOpts = (obj: IUsertypeRequestParams): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetUsertypeQuery(obj);
  const isLoading = loading || isFetching;
  if (!data || data.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((aCmp:IUsertypeData) => {
      return {
        label: aCmp.name,
        value: aCmp.id,
        ...aCmp,
      };
    }),
    isLoading,
  };
};

export default useUsertypeOpts;
