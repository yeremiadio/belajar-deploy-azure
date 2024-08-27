import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { UsedAPI } from '@/utils/configs/endpoint';

import { BackendResponse } from '@/types/api';

import { loadCookie } from '@/services/cookie';

import { IEmployee, IEmployeeObj } from '@/types/api/management/employee';

export const employeeStoreAPI = createApi({
  reducerPath: "employeeStoreAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/employeetracker`,
    prepareHeaders: (headers) => {
      const token = loadCookie('token');
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['EmployeeList', "EmployeeTagList", "EmployeeTypeList"],
  endpoints: (builder) => {
    return {
      getEmployee: builder.query<IEmployee[], Partial<IEmployeeObj>>({
        query: (obj) => {
          return {
            url: '/employee/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (res: BackendResponse<IEmployee[]>) => {
          return res.data;
        },
        providesTags: ['EmployeeList'],
      }),
    };
  },
});

export const {
  useGetEmployeeQuery,
  util: { resetApiState: resetEmployeeStoreAPI },
} = employeeStoreAPI;
