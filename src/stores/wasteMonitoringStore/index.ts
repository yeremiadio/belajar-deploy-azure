import { BackendResponse } from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import dayjs from 'dayjs';
import { TValueChart, TWasteDevice, TWasteMonitoringParams } from '@/types/api/wasteMonitoring';
import { TSensorMonitoring,  } from '@/types/api/socket';


const ENDPOINT_URL_WASTE_MONITORING = '/waste-monitoring';

export const wasteMonitoringStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getWasteMonitoringList: builder.query<
      TWasteDevice[],
      Partial<TWasteMonitoringParams>
      >({
        query: (obj) => {
          return {
            url: `${ENDPOINT_URL_WASTE_MONITORING}/devices`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<TWasteDevice[]>) =>
          response.data,
        providesTags: (_, __, {gatewayId} ) => [
          { type: 'waste-monitoring-list', gatewayId},
        ],
      }),
      getWasteMonitoringSensorlog: builder.query<
      TValueChart[],
      Partial<TWasteMonitoringParams>
    >({
      query: (obj) => {
        const { gatewayId, deviceIds, range, type } = obj;
    
        // Build the query string manually, appending each `deviceIds` separately
        const params = new URLSearchParams();
        if (gatewayId) params.append('gatewayId', gatewayId.toString());
        if (range) params.append('range', range.toString());
        if (type) params.append('type', type.toString());
    
        // Append each deviceId as a separate parameter
        deviceIds?.forEach((id) => {
          params.append('deviceIds', id.toString());
        });
    
        return {
          url: `${ENDPOINT_URL_WASTE_MONITORING}/devices/sensorlogs`,
          method: 'GET',
          params, // Use the generated params
        };
      },
      transformResponse: (response: BackendResponse<TSensorMonitoring[]>) => {
        const chartbySensor: TValueChart[] = [];

        if (!response.data || response.data.length === 0) return [];
    
        const { data } = response;
    
        // Sort by receivedon time (oldest to newest)
        data.sort((a, b) => {
          const timeA = dayjs(a.receivedon).valueOf();
          const timeB = dayjs(b.receivedon).valueOf();
          return timeA - timeB;
        });
    
        data.forEach((entry) => {   
          entry.data.forEach((sensor) => {
              chartbySensor.push({
                id: entry.id.toString(),
                deviceId: entry.deviceId,
                sensorcode: sensor.sensorcode,
                value: sensor.value,      
                receivedon: entry.receivedon,            
              });
        });
      })
    
        return chartbySensor;  // Return flat array
      },
      providesTags: (_, __, { gatewayId }) => [
        { type: 'waste-monitoring-sensorlog', key: gatewayId },
      ],
    }),
    };
  },
});

export const {
    useGetWasteMonitoringListQuery,
    useGetWasteMonitoringSensorlogQuery,
  util: { 
    resetApiState: resetWasteMonitoringStoreAPI,
    updateQueryData: updateWasteMonitoringQueryData,
   },
} = wasteMonitoringStoreAPI;
