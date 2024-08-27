import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { loadCookie } from '@/services/cookie';

import { BackendResponse } from '@/types/api';
import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';
import {
  TAverageHumadity,
  TRainGauge,
  TValueChart,
  TWaterLevelParams,
} from '@/types/api/waterLevel';

import { UsedAPI } from '@/utils/configs/endpoint';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';

export const waterLevelApi = createApi({
  reducerPath: 'waterLevelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/water-level`,
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
    'average-humidity',
    'rain-gauge',
    'water-level-devices',
    'water-level-trends',
    'water-level-device-options',
  ],
  endpoints: (builder) => ({
    getAverageHumadity: builder.query<
      TAverageHumadity,
      Partial<TWaterLevelParams>
    >({
      query: (obj) => ({
        url: `/average-humidity`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TAverageHumadity>) =>
        response.data,
      providesTags: ['average-humidity'],
    }),
    getRainGauge: builder.query<TRainGauge, Partial<TWaterLevelParams>>({
      query: (obj) => ({
        url: `/rain-gauge`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TRainGauge>) =>
        response.data,
      providesTags: ['rain-gauge'],
    }),
    getWaterlevelDeviceStatistic: builder.query<
      IDeviceLocationWaterLevelObj[],
      Partial<TWaterLevelParams>
    >({
      query: (obj) => ({
        url: `/device-statistic`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (
        response: BackendResponse<IDeviceLocationWaterLevelObj[]>,
      ) => response.data,
      providesTags: ['water-level-devices'],
    }),
    getWaterlevelTrendStatistic: builder.query<
      TValueChart[],
      Partial<TWaterLevelParams>
    >({
      query: (obj) => ({
        url: `/device-trend`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TValueChart[]>) =>
        response.data,
      providesTags: ['water-level-trends'],
    }),
    getWaterlevelOptions: builder.query<string[], Partial<TWaterLevelParams>>({
      query: (obj) => ({
        url: `/device-sensor`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<string[]>) => response.data,
      providesTags: ['water-level-device-options'],
    }),
  }),
});

export const {
  useGetAverageHumadityQuery,
  useGetRainGaugeQuery,
  useGetWaterlevelDeviceStatisticQuery,
  useGetWaterlevelTrendStatisticQuery,
  useGetWaterlevelOptionsQuery,
  util: {
    resetApiState: resetWaterLevelApiState,
    updateQueryData: updateWaterLevelQueryData,
  },
} = waterLevelApi;
