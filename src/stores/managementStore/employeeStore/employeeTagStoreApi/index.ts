import { BackendResponse, IBackendDataPageShape, TPaginationResponse } from "@/types/api";
import { IEmployeeTag, IEmployeeTagObj } from "@/types/api/management/employee";

import { employeeStoreAPI } from "../employeeStoreApi";

const employeeTagURL = "/employee/tag";

export const employeeTagStoreAPI = employeeStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getEmployeeTag: builder.query<TPaginationResponse<IEmployeeTag[]>, Partial<IEmployeeTagObj>>({
        query: (obj) => {
          return {
            url: employeeTagURL + "/find",
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: IBackendDataPageShape<IEmployeeTag[]>) =>
          response.data,
        providesTags: ["EmployeeTagList"],
      }),
      createEmployeeTag: builder.mutation<
        BackendResponse<IEmployeeTag>,
        Partial<IEmployeeTagObj>
      >({
        query: (obj) => {
          return {
            url: employeeTagURL + "/create",
            body: obj,
            method: "POST",
          };
        },
        invalidatesTags: ["EmployeeTagList"],
      }),
      updateEmployeeTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IEmployeeTagObj>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${employeeTagURL}/update/${id}`,
            body: data,
            method: "PATCH",
          };
        },
        invalidatesTags: ["EmployeeTagList"],
      }),

      deleteEmployeeTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${employeeTagURL}/delete/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["EmployeeTagList"],
      }),

      resetEmployeeTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IEmployeeTagObj>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${employeeTagURL}/update/${id}`,
            body: data,
            method: "PATCH",
          };
        },
        invalidatesTags: ["EmployeeTagList"],
      }),
    };
  },
});

export const {
  useCreateEmployeeTagMutation,
  useDeleteEmployeeTagMutation,
  useGetEmployeeTagQuery,
  useUpdateEmployeeTagMutation,
  useResetEmployeeTagMutation,
  util: { resetApiState: resetEmployeeTagStoreAPI },
} = employeeTagStoreAPI;
