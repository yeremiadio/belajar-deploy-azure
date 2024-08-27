import {
  BackendResponse,
  TPaginationResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
} from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import {
  IWorkOrderQueryParameter,
  IWorkOrderRequest,
  IWorkOrderResponse,
  TWorkOrderProductionLog,
} from '@/types/api/inventory/workOrder';
import _ from 'lodash';

const workOrderUrl = '/workorder';

export const workOrderStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getWorkOrder: builder.query<
        TPaginationResponse<IWorkOrderResponse[]>,
        TBackendPaginationRequestObject<Partial<IWorkOrderQueryParameter>>
      >({
        query: (obj) => {
          return {
            url: `${workOrderUrl}`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<IWorkOrderResponse[]>,
        ) => response.data,
        providesTags: ['workOrderList'],
      }),

      createWorkOrder: builder.mutation<
        BackendResponse<IWorkOrderResponse>,
        Partial<IWorkOrderRequest>
      >({
        query: (obj) => {
          return {
            url: `${workOrderUrl}`,
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['workOrderList'],
      }),
      updateWorkOrder: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IWorkOrderRequest>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${workOrderUrl}/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['workOrderList'],
      }),

      deleteWorkOrder: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${workOrderUrl}/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: (_, __, { id }) => [
          { type: 'workOrderList' },
          { type: 'workOrderProductionLog', id },
        ],
      }),

      updateRunWorkOrder: builder.mutation<
        BackendResponse<string>,
        { id: number }
      >({
        query: ({ id }) => {
          return {
            url: `${workOrderUrl}/${id}/run`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['workOrderList'],
      }),

      updatePausedWorkOrder: builder.mutation<
        BackendResponse<string>,
        { id: number }
      >({
        query: ({ id }) => {
          return {
            url: `${workOrderUrl}/${id}/pause`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['workOrderList'],
      }),

      updateStopWorkOrder: builder.mutation<
        BackendResponse<string>,
        { id: number }
      >({
        query: ({ id }) => {
          return {
            url: `${workOrderUrl}/${id}/close`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['workOrderList'],
      }),

      createProductionOutput: builder.mutation<
        BackendResponse<string>,
        Omit<TWorkOrderProductionLog, 'createdAt'> & { id: number }
      >({
        query: ({ id, productionOutput, notGoodProductionOutput }) => {
          return {
            url: `${workOrderUrl}/${id}/production-output`,
            method: 'POST',
            body: {
              productionOutput,
              notGoodProductionOutput,
            },
          };
        },
        invalidatesTags: (_, __, { id }) => [
          { type: 'workOrderProductionLog', id },
          { type: 'workOrderList' },
        ],
      }),

      getProductionLog: builder.query<
        TWorkOrderProductionLog[],
        { id: number }
      >({
        query: ({ id }) => {
          return {
            url: `${workOrderUrl}/${id}/production-log`,
            method: 'GET',
          };
        },
        transformResponse: (
          response: BackendResponse<TWorkOrderProductionLog[]>,
        ) => response.data,
        providesTags: (_, __, { id }) => [
          { type: 'workOrderProductionLog', id },
        ],
      }),
    };
  },
});

export const {
  useGetWorkOrderQuery,
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
  useDeleteWorkOrderMutation,
  useUpdatePausedWorkOrderMutation,
  useUpdateRunWorkOrderMutation,
  useUpdateStopWorkOrderMutation,
  useCreateProductionOutputMutation,
  useGetProductionLogQuery,
  util: { resetApiState: resetWorkOrderStoreAPI },
} = workOrderStoreAPI;
