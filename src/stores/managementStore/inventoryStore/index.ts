import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import {
  IAssignInventoryGroupObj,
  IGroupPriceObj,
  IInventory,
  IInventoryGroup,
  IInventoryGroupWithPrice,
  IInventoryParams,
  IInventoryType,
} from '@/types/api/management/inventory';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import {
  TInventoryTransactionRequestObject,
  TInventoryTransaction,
} from '@/types/api/inventory';

const inventoryUrl = '/inventory';
const inventoryGroupUrl = '/inventory-group';

export const inventoryStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getInventory: builder.query<
        TPaginationResponse<IInventory[]>,
        TBackendPaginationRequestObject<Partial<IInventoryParams>>
      >({
        query: (obj) => {
          return {
            url: `${inventoryUrl}`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: IBackendDataPageShape<IInventory[]>) =>
          response.data,
        providesTags: ['InventoryList'],
      }),
      getInventoryById: builder.query<IInventory, { id: number }>({
        query: ({ id }) => {
          return {
            url: `${inventoryUrl}/${id}`,
            method: 'GET',
          };
        },
        transformResponse: (res: BackendResponse<IInventory>) => {
          return res.data;
        },
      }),
      createInventory: builder.mutation<IInventory, Partial<IInventory>>({
        query: (data) => ({
          url: `${inventoryUrl}`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['InventoryList'],
      }),
      updateInventory: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IInventory>;
        }
      >({
        query: ({ id, data }) => ({
          url: `${inventoryUrl}/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['InventoryList'],
      }),
      deleteInventory: builder.mutation<IInventory, number>({
        query: (id) => ({
          url: `${inventoryUrl}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['InventoryList'],
      }),
      getInventoryType: builder.query<
        TPaginationResponse<IInventoryType[]>,
        TBackendPaginationRequestObject<Partial<IInventoryParams>>
      >({
        query: (obj) => {
          return {
            url: `${inventoryUrl}/type`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<IInventoryType[]>,
        ) => response.data,
        providesTags: ['InventoryTypeList'],
      }),
      createInventoryGroups: builder.mutation<
        IInventoryGroup,
        Partial<IInventoryGroup>
      >({
        query: (obj) => ({
          url: `${inventoryGroupUrl}`,
          method: 'POST',
          body: obj,
        }),
        invalidatesTags: ['InventoryList', 'GroupPriceList'],
      }),
      updateInventoryGroups: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IInventory>;
        }
      >({
        query: ({ id, data }) => ({
          url: `${inventoryGroupUrl}/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['InventoryList', 'GroupPriceList'],
      }),
      getInventoryGroups: builder.query<
        TPaginationResponse<IInventoryGroup[]>,
        TBackendPaginationRequestObject<Partial<IInventoryParams>>
      >({
        query: (obj) => {
          return {
            url: `${inventoryGroupUrl}`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<IInventoryGroup[]>,
        ) => response.data,
        providesTags: ['GroupPriceList'],
      }),
      assignGroups: builder.mutation<
        IInventoryGroup,
        IAssignInventoryGroupObj
      >({
        query: (data) => ({
          url: `${inventoryGroupUrl}/assign`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['InventoryList', 'GroupPriceList'],
      }),
      getGroupsById: builder.query<IInventoryGroup[], { id: number }>({
        query: ({ id }) => {
          return {
            url: `${inventoryGroupUrl}/${id}`,
            method: 'GET',
          };
        },
        transformResponse: (res: BackendResponse<IInventoryGroup[]>) => {
          return res.data;
        },
      }),

      getInventoryTransaction: builder.query<
        TPaginationResponse<TInventoryTransaction[]>,
        TPaginationRequestObject & {
          id: string;
        }
      >({
        query: ({ id, ...obj }) => {
          return {
            url: `/inventory/${id}/inventory-transactions`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<TInventoryTransaction[]>,
        ) => response?.data,
        providesTags: ['inventoryTransaction'],
      }),

      createInventoryTransaction: builder.mutation<
        any,
        TInventoryTransactionRequestObject
      >({
        query: (data) => ({
          url: `/inventory/${data.inventoryId}/inventory-transactions`,
          method: 'POST',
          body: {
            ...data,
            date: data.date.toISOString(),
            inventoryId: parseInt(data.inventoryId),
          },
        }),
        invalidatesTags: ['inventoryTransaction', 'InventoryList'],
      }),

      deleteInventoryTransaction: builder.mutation<
        any,
        {
          id: number;
          inventoryTransactionId: number;
        }
      >({
        query: ({ id, inventoryTransactionId }) => ({
          url: `/inventory/${id}/inventory-transactions/${inventoryTransactionId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['inventoryTransaction', 'InventoryList'],
      }),


      updateInventoryTransaction: builder.mutation<
        any,
        TInventoryTransactionRequestObject & {
          transactionId: number;
        }
      >({
        query: ({ transactionId, ...data }) => ({
          url: `/inventory/${data?.inventoryId}/inventory-transactions/${transactionId}`,
          method: 'PATCH',
          body: {
            ...data,
            date: data.date.toISOString(),
            inventoryId: parseInt(data.inventoryId),
          },
        }),
        invalidatesTags: ['inventoryTransaction', 'InventoryList'],
      }),
      inventoryPriceGroups: builder.mutation<
        BackendResponse<object>,
        {
          id: number;
          data: IGroupPriceObj;
        }
      >({
        query: ({ id, data }) => ({
          url: `/inventory/${id}/management`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['InventoryList', 'GroupPriceList'],
      }),
      deleteInventoryGroups: builder.mutation<
      IInventoryGroup,
      IAssignInventoryGroupObj
    >({
      query: (data) => ({
        url: `${inventoryGroupUrl}/assign`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['InventoryList', 'GroupPriceList'],
    }),
      inventoryManageGroups: builder.mutation<
        BackendResponse<object>,
        Partial<IInventoryGroupWithPrice>[]
      >({
        query: (obj) => ({
          url: `/inventory-group/management`,
          method: 'POST',
          body: obj,
        }),
        invalidatesTags: ['InventoryList', 'GroupPriceList'],
      }),
    };
  },
});

export const {
  useGetInventoryQuery,
  useGetInventoryByIdQuery,
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
  useUpdateInventoryMutation,
  useAssignGroupsMutation,
  useInventoryPriceGroupsMutation,
  useCreateInventoryGroupsMutation,
  useUpdateInventoryGroupsMutation,
  useGetInventoryGroupsQuery,
  useGetInventoryTypeQuery,
  useGetGroupsByIdQuery,
  useGetInventoryTransactionQuery,
  useCreateInventoryTransactionMutation,
  useDeleteInventoryTransactionMutation,
  useDeleteInventoryGroupsMutation,
  useUpdateInventoryTransactionMutation,
  useInventoryManageGroupsMutation,
  util: { resetApiState: resetInventoryStoreAPI },
} = inventoryStoreAPI;
