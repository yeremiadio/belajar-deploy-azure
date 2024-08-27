import dayjs from 'dayjs';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { loadCookie } from '@/services/cookie';

import { BackendResponse } from '@/types/api';
import {
  TEnviroboxDeviceSummary,
  TEnviroboxParams,
  TSensorEnvirobox,
  TSensorEnviroboxRequestObj,
} from '@/types/api/envirobox';
import { TChartSensor, TGatewayDevice } from '@/types/api/socket';

import { UsedAPI } from '@/utils/configs/endpoint';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';

export const enviroboxApi = createApi({
  reducerPath: 'enviroboxApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/envirobox`,
    prepareHeaders: (headers) => {
      saveJwtInfo();
      const token = loadCookie('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'envirobox-device-summary',
    'envirobox-devices-list',
    'envirobox-device-chart',
  ],
  endpoints: (builder) => ({
    getEnviroboxDeviceSummary: builder.query<
      TEnviroboxDeviceSummary,
      Partial<TEnviroboxParams>
    >({
      query: (obj) => ({
        url: '/summary',
        method: 'GET',
        params: { ...obj },
      }),
      providesTags: ['envirobox-device-summary'],
      transformResponse: (
        response: BackendResponse<TEnviroboxDeviceSummary>,
      ) => {
        return response?.data;
      },
    }),

    getEnviroboxDevicesList: builder.query<
      TGatewayDevice[],
      Partial<TEnviroboxParams>
    >({
      query: (obj) => ({
        url: '/devices',
        method: 'GET',
        params: { ...obj },
      }),
      providesTags: ['envirobox-devices-list'],
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) => {
        return response?.data;
      },
    }),

    getEnviroboxDeviceChart: builder.query<
      Array<TChartSensor>,
      Partial<TSensorEnviroboxRequestObj>
    >({
      query: ({ id, ...rest }) => ({
        url: `/devices/${id}`,
        method: 'GET',
        params: { ...rest },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorEnvirobox[]>) => {
        const chartbySensor: TChartSensor[] = [];

        if (!response.data || response.data.length === 0) return [];
        const { data } = response;

        // somehow need to be sorted this way, oldest to newest
        data.sort((a, b) => {
          const timeA = dayjs(a.receivedon).valueOf();
          const timeB = dayjs(b.receivedon).valueOf();
          return timeA - timeB;
        });

        data.forEach((entry) => {
          const time = dayjs(entry.receivedon).valueOf();
          entry.data.forEach((sensor) => {
            const existingSensor = chartbySensor.find(
              (item) => item.sensorcode === sensor.sensorcode,
            );
            if (existingSensor) {
              const value = sensor.value;

              existingSensor.values.push(value);
              existingSensor.times.push(time);
            } else {
              chartbySensor.push({
                sensorcode: sensor.sensorcode,
                values: [sensor.value],
                times: [time],
              });
            }
          });
        });
        return chartbySensor;
      },
      providesTags: (_, __, { gatewayId, id: devId }) => [
        { type: 'envirobox-device-chart', key: `${gatewayId}-${devId}` },
      ],
    }),
  }),
});

export const {
  useGetEnviroboxDeviceSummaryQuery,
  useGetEnviroboxDevicesListQuery,
  useGetEnviroboxDeviceChartQuery,
  util: {
    resetApiState: resetEnviroboxApiState,
    updateQueryData: updateEnviroboxQueryData,
  },
} = enviroboxApi;
