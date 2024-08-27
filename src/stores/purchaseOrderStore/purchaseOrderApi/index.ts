import {
  BackendResponse,
  IBackendDataPageShape,
  TPaginationResponse,
  TBackendPaginationRequestObject,
} from '@/types/api';
import { TOrder, TPurchaseOrderRequestFormObject } from '@/types/api/order';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import { TInventoryWithAmount } from '@/types/api/management/inventory';

const purchaseOrderUrl = '/purchase-order';

export const purchaseOrderStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getPurchaseOrder: builder.query<
        TPaginationResponse<TOrder[]>,
        TBackendPaginationRequestObject<Partial<TOrder>> & {
          search?: string;
          isPaginated?: boolean;
        }
      >({
        query: (obj) => {
          return {
            url: purchaseOrderUrl,
            method: 'GET',
            params: { ...obj, isPaginated: obj.isPaginated ?? true },
          };
        },
        transformResponse: (response: IBackendDataPageShape<TOrder[]>) =>
          response.data,
        providesTags: ['purchaseOrder'],
      }),

      getPurchaseOrderById: builder.query<TOrder, { id: number }>({
        query: ({ id }) => {
          return {
            url: `${purchaseOrderUrl}/${id}`,
            method: 'GET',
          };
        },
        transformResponse: (response: BackendResponse<TOrder>) => response.data,
        providesTags: ['purchaseOrder'],
      }),

      createPurchaseOrder: builder.mutation<
        BackendResponse<TOrder>,
        Partial<TPurchaseOrderRequestFormObject>
      >({
        query: (obj) => {
          return {
            url: purchaseOrderUrl,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['purchaseOrder'],
      }),

      updatePurchaseOrder: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<TPurchaseOrderRequestFormObject>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${purchaseOrderUrl}/${id}`,
            method: 'PATCH',
            body: data,
          };
        },
        invalidatesTags: ['purchaseOrder'],
      }),

      deletePurchaseOrder: builder.mutation<any, { id: number }>({
        query: ({ id }) => ({
          url: `${purchaseOrderUrl}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['purchaseOrder'],
      }),

      getPurchaseOrderInventoryList: builder.query<
        TInventoryWithAmount[],
        { id: number }
      >({
        query: ({ id }) => ({
          url: `${purchaseOrderUrl}/${id}/inventory-list`,
          method: 'GET',
        }),
        transformResponse: (
          response: BackendResponse<TInventoryWithAmount[]>,
        ) => response.data,
        providesTags: ['deliveryInventoryList'],
      }),
    };
  },
});

export const {
  useGetPurchaseOrderQuery,
  useGetPurchaseOrderByIdQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderInventoryListQuery,
  util: { resetApiState: resetPurchaseOrderStoreAPI },
} = purchaseOrderStoreAPI;
