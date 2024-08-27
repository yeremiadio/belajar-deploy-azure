import { BackendResponse, IBackendDataPageShape, TBackendPaginationRequestObject, TPaginationResponse } from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import { TMachineDevice, TMachineMonitoringParams, TMachineState, TMachineStateTime, TValueOEE } from '@/types/api/machineMonitoring';
import dayjs from 'dayjs';
import { TChartSensor, TSensorMonitoring, TSocketNotif } from '@/types/api/socket';

const ENDPOINT_URL_MACHINE_MONITORING = '/machine-monitoring';

export const machineMonitoringStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getmachineMonitoringList: builder.query<
      TMachineDevice[],
      Partial<TMachineMonitoringParams>
      >({
        query: (obj) => {
          return {
            url: `${ENDPOINT_URL_MACHINE_MONITORING}`,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<TMachineDevice[]>) =>
          response.data,
        providesTags: (_, __, {gatewayId} ) => [
          { type: 'machine-monitoring-list', gatewayId},
        ],
      }),
      getmachineMonitoringById: builder.query<TMachineDevice, Partial<TMachineDevice>>({
        query: ({ machineId, ...rest }) => {
          return {
            url: `${ENDPOINT_URL_MACHINE_MONITORING}/${machineId}`,
            method: 'GET',
            params: { ...rest },
          };
        },
        transformResponse: (response: BackendResponse<TMachineDevice>) =>
          response.data,
        providesTags: ['machine-monitoring-list'],
      }),
      getmachineMonitoringOEEById: builder.query<
      TValueOEE,
      {machineId: number;}
      >({
        query: ({ machineId, ...rest }) => {
          return {
            url: `${ENDPOINT_URL_MACHINE_MONITORING}/${machineId}/oee`,
            method: 'GET',
            params: {
              ...rest,
            },
          };
        },
        transformResponse: (response: BackendResponse<TValueOEE>) =>
          response.data,
        providesTags: ['machine-monitoring-OEEList'],
      }),
      getMachineMonitoringSensorlog: builder.query<
      Array<TChartSensor>,
      Partial<TMachineMonitoringParams>
    >({
      query: ({ machineId, ...rest }) => ({
        url: `${ENDPOINT_URL_MACHINE_MONITORING}/${machineId}/sensor-logs`,
        method: 'GET',
        params: { ...rest },
        headers: {
          'Version-Header': '2',
        },
      }),
      transformResponse: (response: BackendResponse<TSensorMonitoring[]>) => {
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
      providesTags: (_, __, { machineId }) => [
        { type: 'machine-monitoring-sensorlog', key:  machineId },
      ],
    }),
    getAlertLogActivity: builder.query<
    TPaginationResponse<TSocketNotif[]>,
    TBackendPaginationRequestObject<Partial<TMachineMonitoringParams>>
    >({
      query: ({ machineId, ...obj }) => {
        return {
          url: `${ENDPOINT_URL_MACHINE_MONITORING}/${machineId}/alert-logs`,
          method: 'GET',
          params: { ...obj },
        };
      },
      transformResponse: (response: IBackendDataPageShape<TSocketNotif[]>) =>
        response.data,
      providesTags: ['machine-monitoring-alertList']
    }),
    getmachineMonitoringStateList: builder.query<
    TMachineStateTime[],
    Partial<TMachineMonitoringParams>
    >({
      query: ({ machineId, ...rest }) => {
        return {
          url: `${ENDPOINT_URL_MACHINE_MONITORING}/${machineId}/state`,
          method: 'GET',
          params: { ...rest },
        };
      },
      transformResponse: (response: BackendResponse<TMachineState[]>) => {
        const timeState: TMachineStateTime[] = [];

        // Define color mappings
        const statusColors = {
          running: "#20C997",
          paused: "#C4CDE0",
          pending: "#FC5A5A",
          complete: "#687484"
        };
        if (!response.data || response.data.length === 0) return [];
    
        const { data } = response;
  
        const sortedData = data.sort((a, b) => dayjs(a.time).isAfter(dayjs(b.time)) ? 1 : -1);
    
        sortedData.forEach((item, index) => {
          const nextItem = sortedData[index + 1];
          const color = statusColors[item.status as keyof typeof statusColors];
      
          timeState.push({
            startTime: dayjs(item.time).format('HH:mm:ss'),   
            status: item.status,                            
            endTime: nextItem ? dayjs(nextItem.time).format('HH:mm:ss') : dayjs().format('HH:mm:ss'), 
            color: color || '#000000'                       
          });
        });
    
        return timeState;  // Return flat array
      },
      providesTags: (_, __, {machineId} ) => [
        { type: 'machine-monitoring-state', machineId},
      ],
    }),
    };
  },
});

export const {
    useGetmachineMonitoringByIdQuery,
    useGetmachineMonitoringListQuery,
    useGetmachineMonitoringOEEByIdQuery,
    useGetMachineMonitoringSensorlogQuery,
    useGetAlertLogActivityQuery,
    useGetmachineMonitoringStateListQuery,
  util: { 
    resetApiState: resetMachineMonitoringStoreAPI,
    updateQueryData: updateMachineMonitoringQueryData,
   },
} = machineMonitoringStoreAPI;
