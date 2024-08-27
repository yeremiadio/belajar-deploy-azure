import { BackendResponse } from '@/types/api';
import { IEmployeeType, IEmployeeTypeObj } from "@/types/api/management/employee";

import { employeeStoreAPI } from "../employeeStoreApi";

const employeetypeURL = "/employeetype";

export const employeeTypeStoreAPI = employeeStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getEmployeeType: builder.query<
        IEmployeeType[],
        Partial<IEmployeeTypeObj>
      >({
        query: (obj) => {
          return {
            url: employeetypeURL + "/find",
            method: 'GET',
            params: { ...obj },
          };
        },

        transformResponse: (response: BackendResponse<IEmployeeType[]>) =>
          response.data,
        providesTags: ["EmployeeTypeList"],
      }),
    };
  },
});

export const {
  useGetEmployeeTypeQuery,
  util: { resetApiState: resetEmployeeTypeStoreAPI },
} = employeeTypeStoreAPI;
