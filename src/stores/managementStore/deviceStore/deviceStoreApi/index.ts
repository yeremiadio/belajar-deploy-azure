import {
  BackendResponse,
  IBackendDataPageShape,
  TPaginationResponse,
} from '@/types/api';
import {
  IBindAccountDeviceRequestFormObject,
  IDeviceBasic,
  IDeviceDetailSublocationMachineWithMap,
  IDeviceObj,
  IGetDeviceObj,
  TDeviceAlertLogsRequestObject,
} from '@/types/api/management/device';
import { TSocketNotif } from '@/types/api/socket';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

const url = '/device';

export const deviceStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDevices: builder.query<
        TPaginationResponse<IDeviceDetailSublocationMachineWithMap[]>,
        IGetDeviceObj
      >({
        query: (obj) => {
          return {
            url: `${url}/find`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<
            IDeviceDetailSublocationMachineWithMap[]
          >,
        ) => response.data,
        providesTags: ['DeviceList'],
      }),

      createDevice: builder.mutation<BackendResponse<IDeviceBasic>, IDeviceObj>(
        {
          query: (obj) => {
            return {
              url: `${url}/create`,
              body: obj,
              method: 'POST',
            };
          },
          invalidatesTags: ['DeviceList'],
        },
      ),

      updateDevice: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * device Id
           */
          id: number;
          data: Partial<IDeviceObj>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${url}/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['DeviceList'],
      }),

      deleteDevice: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * device Id
           */
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${url}/delete/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['DeviceList'],
      }),
      addDeviceMap: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * device Id
           */
          id: number;
          file: File | null | FormData;
        }
      >({
        query: ({ id, file }) => {
          return {
            body: file,
            url: `${url}/addmap/${id}`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['DeviceList'],
      }),
      deleteDeviceMap: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * device Id
           */
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${url}/deletemap/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['DeviceList'],
      }),
      updateStatusDevice: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * device Id
           */
          id: number;
          data: URLSearchParams | string;
        }
      >({
        query: ({ id, data }) => {
          return {
            url: `${url}/update/${id}`,
            body: data,
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          };
        },
        invalidatesTags: ['DeviceList'],
      }),
      bindAccountDevice: builder.mutation<
        BackendResponse<object>,
        IBindAccountDeviceRequestFormObject & { id?: number }
      >({
        query: ({ id, ...rest }) => {
          return {
            url: `${url}/${id}/bind-user`,
            body: rest,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['DeviceList'],
      }),

      getDeviceAlertLogs: builder.query<
        TSocketNotif[],
        TDeviceAlertLogsRequestObject
      >({
        query: ({ id, versionHeader = 2, ...params }) => {
          return {
            url: `${url}/${id}/alert-logs`,
            method: 'GET',
            params: { ...params },
          };
        },
        transformResponse: (
          response: BackendResponse<TPaginationResponse<TSocketNotif[]>>,
        ) => response?.data.entities,
        providesTags: (_, __, { id }) => [{ type: 'deviceAlertLogs', id }],
      }),
    };
  },
});

export const {
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useUpdateDeviceMutation,
  useAddDeviceMapMutation,
  useUpdateStatusDeviceMutation,
  useDeleteDeviceMapMutation,
  useBindAccountDeviceMutation,
  useGetDeviceAlertLogsQuery,
  util: {
    resetApiState: resetDeviceStoreAPI,
    updateQueryData: updateDeviceQueryData,
  },
} = deviceStoreAPI;
