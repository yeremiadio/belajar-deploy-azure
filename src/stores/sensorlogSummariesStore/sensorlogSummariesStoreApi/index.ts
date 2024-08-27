import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { UsedAPI } from '@/utils/configs/endpoint';

import { BackendResponse } from '@/types/api';
import { TSensorLogSummary } from '@/types/api/sensorlogSummaries';

import { loadCookie } from '@/services/cookie';

export const sensorlogSummariesStoreAPI = createApi({
  reducerPath: "sensorlogSummariesStoreAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/sensorlog-summaries`,
    prepareHeaders: (headers) => {
      const token = loadCookie('token');
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['SensorlogSummariesList'],
  endpoints: (builder) => {
    return {
      getSensorlogSummaries: builder.query<TSensorLogSummary[], Partial<TSensorLogSummary>>({
        query: (obj) => {
          return {
            url: '',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (res: BackendResponse<TSensorLogSummary[]>) => {
          return res.data;
        },
        providesTags: ['SensorlogSummariesList'],
      }),
    };
  },
});

export const {
  useGetSensorlogSummariesQuery,
  util: { resetApiState: resetSensorlogSummariesStoreAPI },
} = sensorlogSummariesStoreAPI;
