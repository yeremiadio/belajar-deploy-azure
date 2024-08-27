import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BackendResponse, TPaginationResponse } from '@/types/api';
import { IBackendDataPageShape } from '@/types/api';

import { UsedAPI } from '@/utils/configs/endpoint';
import { loadCookie } from '@/services/cookie';
import { IInventory } from '@/types/api/management/inventory';

export const itemStoreApi = createApi({
  reducerPath: 'itemStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/items`,
    prepareHeaders: (headers) => {
      const token = loadCookie('token');
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query<
      TPaginationResponse<IInventory[]>,
      {
        page?: number;
        take?: number;
        name?: string;
      }
    >({
      query: ({ page = 1, take = 10, name }) => {
        return {
          url: '',
          method: 'GET',
          params: { page, take, name },
        };
      },
      transformResponse: (res: IBackendDataPageShape<IInventory[]>) => {
        return res?.data;
      },
      providesTags: ['Item'],
    }),

    getItemById: builder.query<IInventory, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (res: BackendResponse<IInventory>) => {
        return res.data;
      },
    }),

    postItem: builder.mutation<any, Partial<IInventory>>({
      query: (obj) => {
        return {
          url: '',
          method: 'POST',
          body: obj,
        };
      },
    }),

    patchItem: builder.mutation<
      any,
      {
        id: number;
      } & Partial<IInventory>
    >({
      query: ({ id, ...obj }) => {
        return {
          url: `/${id}`,
          method: 'PATCH',
          body: obj,
        };
      },
    }),

    deleteItem: builder.mutation<any, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  usePostItemMutation,
  usePatchItemMutation,
  useDeleteItemMutation,
  util: { resetApiState: resetItemStoreAPI },
} = itemStoreApi;
