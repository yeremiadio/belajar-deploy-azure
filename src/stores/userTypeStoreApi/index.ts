import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BackendResponse } from '@/types/api';
import { IUsertypeData, IUsertypeRequestObj, IUsertypeRequestParams } from '@/types/api/userType';

import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';
import { UsedAPI } from '@/utils/configs/endpoint';


export const userTypeStoreApi = createApi({
  reducerPath: "userTypeStoreApi",
  baseQuery: fetchBaseQuery({
      baseUrl: `${UsedAPI}/usertype`,
      prepareHeaders: (headers) => customPrepareHeaderRtkStore(headers),
  }),
  tagTypes: ['UserTypeList'],
  endpoints: (builder) => {
    return {
      getUsertype: builder.query<IUsertypeData[], Partial<IUsertypeRequestParams>>({
        query: (obj) => {
          const url = '/find'
          return {
            url,
            method: 'GET',
            params: {
              ...obj
          }
          };
        },
        transformResponse: (response: BackendResponse<IUsertypeData[]>) =>
          response.data,
        providesTags: ['UserTypeList'],
      }),
      createUsertype: builder.mutation<
        BackendResponse<{ id: number }[]>,
        Partial<IUsertypeRequestObj>
      >({
        query: (obj) => {
          return {
            url: '/create',
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['UserTypeList'],
      }),
      updateUsertype: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IUsertypeRequestObj>
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['UserTypeList'],
      }),
      deleteUsertype: builder.mutation<
      BackendResponse<string>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags:  ['UserTypeList'],
    }),
    };
  },
});

export const {
  useGetUsertypeQuery,
  useCreateUsertypeMutation,
  useDeleteUsertypeMutation,
  useUpdateUsertypeMutation,
  util: { resetApiState: resetUsertypeStoreApiState },
} = userTypeStoreApi;
