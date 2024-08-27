import dayjs from 'dayjs';

import { loadCookie } from '@/services/cookie';
import { BackendResponse } from '@/types/api';
import {
  TChartSensor,
  TEnergyMeterParams,
  TSensorEnergyMeter,
  TTodaySummary,
} from '@/types/api/energyMeter';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';
import { UsedAPI } from '@/utils/configs/endpoint';
import { convertAlertStatusToRank } from '@/utils/functions/convertAlertStatusToRank';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const BASE_URL = '/energy-meter';

export const energyMeterApi = createApi({
  reducerPath: 'energyMeterApi',
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
    'energy-meter-today-summary',
    'energy-meter-device',
    'energy-meter-device-log',
  ],
  endpoints: (builder) => ({
    getEnergyMeterTodaySummary: builder.query<
      TTodaySummary,
      Partial<TEnergyMeterParams>
    >({
      query: ({ ...rest }) => ({
        url: `${BASE_URL}/summary`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TTodaySummary>) =>
        response.data,
      providesTags: ['energy-meter-today-summary'],
    }),
    getEnergyMeterDevices: builder.query<
      TGatewayDevice[],
      Partial<TEnergyMeterParams>
    >({
      query: ({ gatewayId }) => ({
        url: `${BASE_URL}/devices`,
        method: 'GET',
        params: { gatewayId },
      }),
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) => {
        if (!response.data || response.data.length === 0) return [];
        const { data } = response;

        // sort by alert_status
        data.sort((a, b) => {
          const statusA = convertAlertStatusToRank(
            a.alert_status as EStatusAlertEnum,
          );
          const statusB = convertAlertStatusToRank(
            b.alert_status as EStatusAlertEnum,
          );
          return statusA - statusB;
        });
        return data;
      },
      providesTags: ['energy-meter-device'],
    }),
    getEnergyMeterDeviceDetailSensorLog: builder.query<
      Array<TChartSensor>,
      Partial<TEnergyMeterParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/devices/${id}`,
        method: 'GET',
        params: { ...rest },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorEnergyMeter[]>) => {
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
        { type: 'energy-meter-device-log', key: `${gatewayId}-${devId}` },
      ],
    }),
  }),
});

export const {
  useGetEnergyMeterTodaySummaryQuery,
  useGetEnergyMeterDevicesQuery,
  useGetEnergyMeterDeviceDetailSensorLogQuery,
  util: {
    resetApiState: resetEnergyMeterApiState,
    updateQueryData: updateEnergyMeterQueryData,
  },
} = energyMeterApi;
