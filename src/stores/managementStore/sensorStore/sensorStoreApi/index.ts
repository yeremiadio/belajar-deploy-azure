import { BackendResponse, IBackendDataPageShape, TPaginationResponse } from '@/types/api';
import { IGetSensorObj, ISensor } from '@/types/api/management/sensor';
import { TSensorType } from '@/types/api/management/sensortype';
import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sensorStoreApi = createApi({
  reducerPath: 'sensorStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}`,
    prepareHeaders: (headers) => customPrepareHeaderRtkStore(headers),
  }),
  tagTypes: ['SensorList', 'SensortypeList', 'SensorListV2'],
  endpoints: (builder) => {
    return {
      getSensor: builder.query<ISensor[], IGetSensorObj>({
        query: (obj) => {
          return {
            url: '/sensor/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<ISensor[]>) =>
          response.data,
        providesTags: (result) =>
          result
            ? [
                ...result.map(
                  ({ id }) => ({ type: 'SensorList', id }) as const,
                ),
                { type: 'SensorList', id: 'LIST' },
              ]
            : [{ type: 'SensorList', id: 'LIST' }],
      }),
      getSensorV2: builder.query<TPaginationResponse<ISensor[]>, IGetSensorObj>(
        {
          query: (obj) => {
            return {
              url: '/sensor/find',
              method: 'GET',
              params: { ...obj },
              headers: {
                'Version-Header': '2',
              },
            };
          },
          transformResponse: (response: IBackendDataPageShape<ISensor[]>) =>
            response?.data,
          providesTags: ['SensorListV2'],
        },
      ),
      getSensorType: builder.query<TSensorType[], Partial<TSensorType>>({
        query: (obj) => {
          return {
            url: '/sensortype/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<TSensorType[]>) =>
          response.data,
        providesTags: (result) =>
          result
            ? [
                ...result.map(
                  ({ id }) => ({ type: 'SensortypeList', id }) as const,
                ),
                { type: 'SensortypeList', id: 'SENSORTYPE_LIST' },
              ]
            : [{ type: 'SensortypeList', id: 'SENSORTYPE_LIST' }],
      }),
    };
  },
});

export const {
  useGetSensorQuery,
  useGetSensorTypeQuery,
  useGetSensorV2Query,
  util: { resetApiState: resetSensorApiState },
} = sensorStoreApi;
