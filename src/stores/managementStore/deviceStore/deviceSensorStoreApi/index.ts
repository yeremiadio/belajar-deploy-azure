import { deviceStoreAPI } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import {
  IDeviceSensorRelation,
  IGetDeviceSensorRelationObj,
} from '@/types/api/management/device';
import { convertToEncodedURL } from '@/utils/functions/convertToEncodedURL';

const BASE_URL = '/device';

export const deviceSensorRelationAPI = deviceStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDeviceRelation: builder.query<
        TPaginationResponse<IDeviceSensorRelation[]>,
        TBackendPaginationRequestObject<
          IGetDeviceSensorRelationObj & { versionHeader?: number }
        >
      >({
        query: ({ versionHeader, ...obj }) => {
          let params = '';
          if (obj) {
            params = convertToEncodedURL(obj);
            params = params.length ? '?' + params : '';
          }
          const url = `${BASE_URL}/findrelation` + params;
          return {
            url,
            method: 'GET',
            headers: {
              'Version-Header': versionHeader?.toString(),
            },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<IDeviceSensorRelation[]>,
        ) => response.data,
        providesTags: ['DeviceRelationList'],
      }),
      createSensorRelationWithAlert: builder.mutation<
        BackendResponse<string[]>,
        {
          deviceId: number;
          sensorId: number;
          alertIds: number[];
        }
      >({
        query: (obj) => {
          const url = `${BASE_URL}/addsensorwithalert`;
          return {
            url,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['DeviceRelationList'],
      }),
      createSensorRelation: builder.mutation<
        BackendResponse<string[]>,
        {
          deviceId: number;
          sensorsData: Array<{
            sensorId: number;
            maxValue: number;
            minValue: number;
          }>;
        }
      >({
        query: (obj) => {
          const url = `${BASE_URL}/addsensor`;
          return {
            url,
            method: 'POST',
            body: obj,
            headers: {
              'Version-Header': '2',
            },
          };
        },
        invalidatesTags: ['DeviceRelationList', 'DeviceList'],
      }),
      updateSensorRelationWithAlert: builder.mutation<
        BackendResponse<string[]>,
        {
          deviceId: number;
          sensorTypeId: number;
          sensorId: number;
          alertIds: number[];
        }
      >({
        query: ({ sensorTypeId, ...rest }) => {
          const url = `${BASE_URL}/updaterelationwithalert/${sensorTypeId}`;
          return {
            url,
            method: 'PATCH',
            body: { ...rest },
          };
        },
        invalidatesTags: ['DeviceRelationList'],
      }),
      updateSensorRelation: builder.mutation<
        BackendResponse<string[]>,
        {
          sensorRelationTypeId: number;
          data: Partial<IGetDeviceSensorRelationObj>;
        }
      >({
        query: ({ data, sensorRelationTypeId }) => {
          return {
            url: `${BASE_URL}/updaterelation/${sensorRelationTypeId}`,
            method: 'PATCH',
            body: data,
          };
        },
        invalidatesTags: ['DeviceRelationList'],
      }),
      deleteDeviceSensorRelation: builder.mutation<
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
            url: `${BASE_URL}/deleterelation/${id}`,
            method: 'DELETE',
            headers: {
              'Version-Header': '2',
            },
          };
        },
        invalidatesTags: ['DeviceRelationList', 'DeviceList'],
      }),
    };
  },
});

export const {
  useGetDeviceRelationQuery,
  useCreateSensorRelationWithAlertMutation,
  useCreateSensorRelationMutation,
  useUpdateSensorRelationMutation,
  useUpdateSensorRelationWithAlertMutation,
  useDeleteDeviceSensorRelationMutation,
  util: { resetApiState: resetDeviceSensorRelationAPI },
} = deviceSensorRelationAPI;
