import { IEmployee } from "@/types/api/management/employee";
import { BasicSelectOpt } from "@/types/global";

import { useGetEmployeeQuery } from "@/stores/managementStore/employeeStore/employeeStoreApi";

type Props = Partial<IEmployee>;

interface IEmployeeIdOpt extends BasicSelectOpt<number>, IEmployee { }

interface ReturnVal {
  arr: IEmployeeIdOpt[];
  isLoading: boolean;
}

const useEmployeeOpts = (props: Props): ReturnVal => {
  const { data, isLoading: loading, isFetching } = useGetEmployeeQuery(props);
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

export default useEmployeeOpts;
