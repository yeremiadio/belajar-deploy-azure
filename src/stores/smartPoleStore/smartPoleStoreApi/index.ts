import dayjs from 'dayjs';

import { BackendResponse } from '@/types/api';
import {
  TAirQuality,
  TCctvSmartPole,
  TDeviceDetail,
  TEnergyConsumptionSmartPole,
  TGetSprayedWaterVolumeParams,
  TGetWaterSprayHistoryParams,
  TInformationSmartPole,
  TSensorSmartpole,
  TSmartPoleParams,
  TSprayedWaterVolumeSmartPole,
  TStatisticSmartPole,
  TWaterSprayHistory,
} from '@/types/api/smartPole';
import { TGatewayDevice } from '@/types/api/socket';
import { TChartSensor } from '@/types/api/energyMeter';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import { convertToEncodedURL } from '@/utils/functions/convertToEncodedURL';

const BASE_URL = '/smart-pole';
export const smartPoleApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStatisticSmartPole: builder.query<
      TStatisticSmartPole,
      Partial<TSmartPoleParams>
    >({
      query: () => ({
        url: `${BASE_URL}/statistic`,
        method: 'GET',
      }),
      transformResponse: (response: BackendResponse<TStatisticSmartPole>) =>
        response.data,
      providesTags: ['smartpoleStatistic'],
    }),
    getDeviceLocationSmartPole: builder.query<
      TDeviceDetail[],
      Partial<TSmartPoleParams>
    >({
      query: (obj) => ({
        url: `${BASE_URL}/device-location`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TDeviceDetail[]>) =>
        response.data,
      providesTags: ['smartpoleDeviceLocation'],
    }),
    getInformationDeviceSmartPole: builder.query<
      TInformationSmartPole,
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/device-location/${id}`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TInformationSmartPole>) =>
        response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleInformationDevice',
        { type: 'smartpoleInformationDevice', id },
      ],
    }),
    getCctvDeviceSmartPole: builder.query<
      TCctvSmartPole,
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/${id}/cctv`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TCctvSmartPole>) =>
        response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleCctvDevice',
        { type: 'smartpoleCctvDevice', id },
      ],
    }),
    getSprayWaterVolumeDeviceSmartPole: builder.query<
      TSprayedWaterVolumeSmartPole,
      Partial<TGetSprayedWaterVolumeParams>
    >({
      query: ({ id, ...rest }) => {
        return {
          url: `${BASE_URL}/${id}/water-spray-volume`,
          method: 'GET',
          params: { ...rest },
        };
      },
      transformResponse: (
        response: BackendResponse<TSprayedWaterVolumeSmartPole>,
      ) => response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleSprayWaterVolumeDevice',
        { type: 'smartpoleSprayWaterVolumeDevice', id },
      ],
    }),
    getEnergyConsumptionDeviceSmartPole: builder.query<
      TEnergyConsumptionSmartPole[],
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/${id}/energy-consumption`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (
        response: BackendResponse<TEnergyConsumptionSmartPole[]>,
      ) => response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleEnergyConsumptionDevice',
        { type: 'smartpoleEnergyConsumptionDevice', id },
      ],
    }),
    getSprayWaterHistoryDeviceSmartPole: builder.query<
      TWaterSprayHistory[],
      Partial<TGetWaterSprayHistoryParams>
    >({
      query: ({ id, ...rest }) => {
        return {
          url: `${BASE_URL}/${id}/water-spray-history`,
          method: 'GET',
          params: { ...rest },
        };
      },
      transformResponse: (response: BackendResponse<TWaterSprayHistory[]>) =>
        response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleSprayWaterHistory',
        { type: 'smartpoleSprayWaterHistory', id },
      ],
    }),
    getAirQualityDeviceSmartPole: builder.query<
      TAirQuality[],
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `${BASE_URL}/${id}/water-spray-air-quality`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TAirQuality[]>) =>
        response.data,
      providesTags: (_, __, { id }) => [
        'smartpoleAirQualityDevice',
        { type: 'smartpoleAirQualityDevice', id },
      ],
    }),
    getDevicesSmartPole: builder.query<
      TGatewayDevice[],
      Partial<TSmartPoleParams>
    >({
      query: (obj) => ({
        url: `${BASE_URL}/devices`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) =>
        response.data,
      providesTags: ['smartpoleDeviceList'],
    }),
    getDevicesSmartPoleChart: builder.query<
      TGatewayDevice[],
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...obj }) => ({
        url: `${BASE_URL}/devices/${id}`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TGatewayDevice[]>) =>
        response.data,
      providesTags: ['smartpoleDeviceChartList'],
    }),
    getDevicesSmartPoleChartV2: builder.query<
      TChartSensor[],
      Partial<TSmartPoleParams>
    >({
      query: ({ id, ...obj }) => ({
        url: `${BASE_URL}/devices/${id}`,
        method: 'GET',
        params: { ...obj },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorSmartpole[]>) => {
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
      providesTags: (_, __, { gatewayId, id: devId, timeRangeHours }) => [
        {
          type: 'smartpoleDeviceChartList',
          key: `${gatewayId}-${devId}-${timeRangeHours}`,
        },
      ],
    }),

    confirmSmartpoleNotification: builder.mutation<
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
        return {
          url: `/user/notifications/confirmation` + idsparams,
          method: 'POST',
        };
      },
      invalidatesTags: ['smartpoleDeviceList'],
    }),
  }),
});

export const {
  useGetStatisticSmartPoleQuery,
  useGetDeviceLocationSmartPoleQuery,
  useGetInformationDeviceSmartPoleQuery,
  useGetCctvDeviceSmartPoleQuery,
  useGetSprayWaterVolumeDeviceSmartPoleQuery,
  useGetEnergyConsumptionDeviceSmartPoleQuery,
  useGetSprayWaterHistoryDeviceSmartPoleQuery,
  useGetAirQualityDeviceSmartPoleQuery,
  useGetDevicesSmartPoleQuery,
  useGetDevicesSmartPoleChartQuery,
  useGetDevicesSmartPoleChartV2Query,
  useConfirmSmartpoleNotificationMutation,
  util: {
    resetApiState: resetSmartPoleApiState,
    updateQueryData: updateSmartPoleQueryData,
  },
} = smartPoleApi;
