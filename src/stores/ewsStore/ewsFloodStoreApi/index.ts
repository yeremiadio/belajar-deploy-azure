import dayjs from 'dayjs';

import { loadCookie } from '@/services/cookie';
import { BackendResponse } from '@/types/api';
import {
    TChartSensor, TFloodParams, TSensorFlood, TStatisticResponse
} from '@/types/api/ews/ewsFlood';
import { TGatewayDevice } from '@/types/api/socket';
import { UsedAPI } from '@/utils/configs/endpoint';
import { convertToEncodedURL } from '@/utils/functions/convertToEncodedURL';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const BASE_URL = '/ews-flood';

export const ewsFloodApi = createApi({
  reducerPath: 'ewsFloodApi',
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
  tagTypes: ['flood-statistic', 'flood-device', 'flood-device-log'],
  endpoints: (builder) => ({
    getFloodStatistic: builder.query<TStatisticResponse, Partial<TFloodParams>>(
      {
        query: ({ ...rest }) => ({
          url: `${BASE_URL}/statistic`,
          method: 'GET',
          params: { ...rest },
        }),
        transformResponse: (response: BackendResponse<TStatisticResponse>) =>
          response.data,
        providesTags: ['flood-statistic'],
      },
    ),
    getFloodDevices: builder.query<TGatewayDevice[], Partial<TFloodParams>>({
      query: ({ gatewayId }) => ({
        url: `${BASE_URL}/devices`,
        method: 'GET',
        params: { gatewayId },
      }),
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) =>
        response.data,
      providesTags: ['flood-device'],
    }),
    getFloodDeviceDetailSensorlog: builder.query<
      Array<TChartSensor>,
      Partial<TFloodParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/devices/${id}`,
        method: 'GET',
        params: { ...rest },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorFlood[]>) => {
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
        { type: 'flood-device-log', key: `${gatewayId}-${devId}` },
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
      invalidatesTags: ['flood-statistic', 'flood-device'],
    }),
  }),
});

export const {
  useGetFloodStatisticQuery,
  useGetFloodDevicesQuery,
  useGetFloodDeviceDetailSensorlogQuery,
  useConfirmNotificationMutation,
  util: {
    resetApiState: resetEwsFloodApiState,
    updateQueryData: updateEwsFloodQueryData,
  },
} = ewsFloodApi;
