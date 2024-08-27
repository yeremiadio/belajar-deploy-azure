import { BackendResponse, TPaginationResponse } from '@/types/api';
import { IBackendDataPageShape } from '@/types/api';
import {
  ReservationActivityStatusEnum,
  TReservationActivityFormObject,
  TReservationObject,
} from '@/types/api/reservation';

import { objectToFormData } from '@/utils/functions/form';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

const subUrl = '/reservations';

export const reservationStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReservation: builder.query<
      TPaginationResponse<TReservationObject[]>,
      {
        page?: number;
        take?: number;
        search?: string;
        status?: ReservationActivityStatusEnum;
        isCompleted?: boolean;
      }
    >({
      query: ({ page = 1, take = 10, search, status, isCompleted }) => {
        return {
          url: subUrl,
          method: 'GET',
          params: { page, take, search, status, isCompleted },
        };
      },
      transformResponse: (res: IBackendDataPageShape<TReservationObject[]>) => {
        return res?.data;
      },
      providesTags: ['reservation'],
    }),

    getReservationById: builder.query<
      TReservationObject,
      { id: number; token?: string }
    >({
      query: ({ id, ...rest }) => {
        return {
          url: `${subUrl}/${id}`,
          method: 'GET',
          params: { ...rest },
        };
      },
      transformResponse: (res: BackendResponse<TReservationObject>) => {
        return res?.data;
      },
      providesTags: ['reservation'],
    }),

    getReservationByTagId: builder.query<
      TReservationObject,
      { id: number; token?: string }
    >({
      query: ({ id, ...rest }) => {
        return {
          url: `${subUrl}/tag/${id}`,
          method: 'GET',
          params: { ...rest },
        };
      },
      transformResponse: (res: BackendResponse<TReservationObject>) => {
        return res?.data;
      },
      providesTags: ['reservation'],
    }),

    getReservationAll: builder.query<TReservationObject[], {
      gatewayId: number;
    }>({
      query: ({
        gatewayId
      }) => {
        return {
          url: `${subUrl}/all`,
          method: 'GET',
          params: { gatewayId },
        };
      },
      transformResponse: (res: BackendResponse<TReservationObject[]>) => {
        return res?.data;
      },
      providesTags: ['reservation'],
    }),

    postReservation: builder.mutation<any, TReservationActivityFormObject>({
      query: (obj) => {
        const formData = objectToFormData(obj);

        return {
          url: subUrl,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        'reservation',
        'purchaseOrder',
        'tagList',
        'licensePlate',
        'driver',
      ],
    }),

    patchReservation: builder.mutation<
      any,
      {
        id: number;
        status: ReservationActivityStatusEnum;
      }
    >({
      query: ({ id, status }) => {
        return {
          url: `${subUrl}/${id}`,
          method: 'PATCH',
          body: status,
        };
      },
      invalidatesTags: [
        'reservation',
        'purchaseOrder',
        'tagList',
        'driver',
        'licensePlate',
      ],
    }),

    deleteReservation: builder.mutation<any, { id: number }>({
      query: ({ id }) => {
        return {
          url: `${subUrl}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [
        'reservation',
        'purchaseOrder',
        'tagList',
        'driver',
        'licensePlate',
      ],
    }),

    updateReservation: builder.mutation<
      BackendResponse<string>,
      {
        id: number;
        data: Partial<TReservationActivityFormObject>;
      }
    >({
      query: ({ id, data }) => {
        const formData = objectToFormData(data);

        return {
          url: `${subUrl}/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: [
        'reservation',
        'purchaseOrder',
        'tagList',
        'driver',
        'licensePlate',
      ],
    }),
  }),
});

export const {
  useGetReservationQuery,
  useGetReservationByIdQuery,
  useGetReservationByTagIdQuery,
  useGetReservationAllQuery,
  usePostReservationMutation,
  usePatchReservationMutation,
  useDeleteReservationMutation,
  useUpdateReservationMutation,
  util: { resetApiState: resetReservationStoreAPI, updateQueryData: updateReservationQueryData, },
} = reservationStoreApi;
