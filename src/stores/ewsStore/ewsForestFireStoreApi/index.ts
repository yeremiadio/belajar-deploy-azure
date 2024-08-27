import dayjs from 'dayjs';

import { loadCookie } from '@/services/cookie';
import { BackendResponse } from '@/types/api';
import { TForestFireParams, TStatisticResponse } from '@/types/api/ews';
import { TChartSensor, TSensorForestFire } from '@/types/api/ews/ewsForestFire';
import { TGatewayDevice } from '@/types/api/socket';
import { UsedAPI } from '@/utils/configs/endpoint';
import { convertToEncodedURL } from '@/utils/functions/convertToEncodedURL';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const BASE_URL = '/ews';

export const ewsForestFireApi = createApi({
  reducerPath: 'ewsForesFireApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}`,
    prepareHeaders: (headers) => {
      //Please always include this (saveJwtInfo), this for copilot purpose
      saveJwtInfo();
      const token = loadCookie('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'forest-fire-statistic',
    'forest-fire-device',
    'forest-fire-device-log',
  ],
  endpoints: (builder) => ({
    getForestFireStatistic: builder.query<
      TStatisticResponse,
      Partial<TForestFireParams>
    >({
      query: ({ ...rest }) => ({
        url: `${BASE_URL}/statistic`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TStatisticResponse>) =>
        response.data,
      providesTags: ['forest-fire-statistic'],
    }),
    getForestFireDevices: builder.query<
      TGatewayDevice[],
      Partial<TForestFireParams>
    >({
      query: ({ gatewayId }) => {
        return {
          url: `${BASE_URL}/devices`,
          method: 'GET',
          params: { gatewayId },
        };
      },
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) =>
        response.data,
      providesTags: ['forest-fire-device'],
    }),
    getForestFireDeviceDetailSensorlog: builder.query<
      Array<TChartSensor>,
      Partial<TForestFireParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/devices/${id}`,
        method: 'GET',
        params: { ...rest },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorForestFire[]>) => {
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
        { type: 'forest-fire-device-log', key: `${gatewayId}-${devId}` },
      ],
    }),
    // note: confirmNotification bind at each store api for embeded invalidatesTags, if using useEffect for refetch data the api will overlaps [fact]
    confirmNotification: builder.mutation<
      { message: string },
      { ids: Array<number> }
    >({
      query: ({ ids }) => {
        let idsparams = '';
        if (ids) {
          let idsObj = ids.map((item) => {
            return {
              ids: item,
            };
          });

          idsparams = idsObj.map((item) => convertToEncodedURL(item)).join('&');
          idsparams = idsparams.length ? '?' + idsparams : '';
        }

        let url = `/user/notifications/confirmation` + idsparams;
        return {
          url, // note: params by rtk query can't accept duplicate key
          method: 'POST',
        };
      },
      invalidatesTags: ['forest-fire-statistic', 'forest-fire-device'],
    }),
  }),
});

export const {
  useGetForestFireStatisticQuery,
  useGetForestFireDevicesQuery,
  useGetForestFireDeviceDetailSensorlogQuery,
  useConfirmNotificationMutation,
  util: {
    resetApiState: resetEwsForestFireApiState,
    updateQueryData: updateEwsForestFireQueryData,
  },
} = ewsForestFireApi;
