import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import { BackendResponse } from '@/types/api';
import { TOrderDocumentRequestFormObject } from '@/types/api/order/orderDocument';
import { objectToFormData } from '@/utils/functions/form';

const orderFileApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    postOrderFiles: builder.mutation<
      BackendResponse<{ id: string }>,
      TOrderDocumentRequestFormObject & {
        orderId: number;
      }
    >({
      query: (obj) => {
        const formData = objectToFormData(obj);
        return {
          url: '/order-files',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['purchaseOrder'],
    }),

    deleteOrderFile: builder.mutation<BackendResponse<string>, number>({
      query: (id) => ({
        url: `/order-files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['purchaseOrder'],
    }),
  }),
});

export const { usePostOrderFilesMutation, useDeleteOrderFileMutation } =
  orderFileApi;
