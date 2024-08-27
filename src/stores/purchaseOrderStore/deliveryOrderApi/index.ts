import {
  BackendResponse,
  IBackendDataPageShape,
  TPaginationResponse,
  TBackendPaginationRequestObject,
} from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import {
  TOrderDelivery,
  TOrderDeliveryRequestFormObject,
} from '@/types/api/order/orderDelivery';
import { objectToFormData } from '@/utils/functions/form';

const subUrl = '/order-deliveries';

export const deliveryOrderStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDeliveryOrder: builder.query<
        TPaginationResponse<TOrderDelivery[]>,
        TBackendPaginationRequestObject<Partial<TOrderDelivery>> & {
          search?: string;
          isPaginated?: boolean;
        }
      >({
        query: (obj) => {
          return {
            url: subUrl,
            method: 'GET',
            params: { ...obj, isPaginated: obj.isPaginated ?? true },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<TOrderDelivery[]>,
        ) => response.data,
        providesTags: ['deliveryOrder'],
      }),

      getDeliveryOrderById: builder.query<TOrderDelivery, { id: number }>({
        query: ({ id }) => {
          return {
            url: `${subUrl}/${id}`,
            method: 'GET',
          };
        },
        transformResponse: (response: BackendResponse<TOrderDelivery>) =>
          response.data,
        providesTags: ['deliveryOrder'],
      }),

      createDeliveryOrder: builder.mutation<
        any,
        Partial<TOrderDeliveryRequestFormObject> & { orderId: number }
      >({
        query: (obj) => {
          return {
            url: subUrl,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['deliveryOrder', 'purchaseOrder'],
      }),

      updateDeliveryOrder: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          token?: string;
          data: Partial<TOrderDeliveryRequestFormObject> & { orderId: number };
        }
      >({
        query: ({ data, id, token }) => {
          const formData = objectToFormData(data);

          return {
            url: `${subUrl}/${id}`,
            method: 'PATCH',
            body: formData,
            params: { token },
          };
        },
        invalidatesTags: ['deliveryOrder', 'purchaseOrder'],
      }),

      deleteDeliveryOrder: builder.mutation<any, { id: number }>({
        query: ({ id }) => {
          return {
            url: `${subUrl}/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['deliveryOrder', 'purchaseOrder'],
      }),
    };
  },
});

export const {
  useGetDeliveryOrderQuery,
  useGetDeliveryOrderByIdQuery,
  useCreateDeliveryOrderMutation,
  useDeleteDeliveryOrderMutation,
  useUpdateDeliveryOrderMutation,
  util: { resetApiState: resetDeliveryOrderStoreAPI },
} = deliveryOrderStoreAPI;
