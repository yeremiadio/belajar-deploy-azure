import { IEmployeeType } from "@/types/api/management/employee";
import { BasicSelectOpt } from "@/types/global";

import { useGetEmployeeTypeQuery } from "@/stores/managementStore/employeeStore/employeeTypeStoreApi";

type Props = Partial<IEmployeeType>;

interface IEmployeeTypeOpt extends BasicSelectOpt<number>, IEmployeeType { }

interface ReturnVal {
  arr: IEmployeeTypeOpt[];
  isLoading: boolean;
}

const useEmployeeTypeOpts = (props: Props): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetEmployeeTypeQuery(props);
  const isLoading = loading || isFetching;
  if (!data || data.length < 1)
    return {
      arr: [],
      isLoading,
    };
  return {
    arr: data.map((val) => {
      return {
        label: val.name,
        value: val.id,
        ...val,
      };
    }),
    isLoading,
  };
};

export default useEmployeeTypeOpts;
