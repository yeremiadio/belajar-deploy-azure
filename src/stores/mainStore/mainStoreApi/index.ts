import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { UsedAPI } from '@/utils/configs/endpoint';
import { loadCookie } from '@/services/cookie';

export const mainStoreAPI = createApi({
  reducerPath: 'mainStoreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}`,
    prepareHeaders: (headers, { endpoint }) => {
      const excludedEndpoints = ['postResetPassword', 'postVerifyEmail'];

      if (!excludedEndpoints.includes(endpoint)) {
        const token = loadCookie('token');
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
      }
    },
  }),
  tagTypes: [
    'main',
    'tagList',
    'yard',
    'workOrderList',
    'oeeThreshold',
    'machine',
    'machineList',
    'machineGroupList',
    'machine-monitoring-list',
    'machine-monitoring-sensorlog',
    'machine-monitoring-OEEList',
    'machine-monitoring-alertList',
    'machine-monitoring-state',
    'recipeList',
    'waste-monitoring-list',
    'waste-monitoring-sensorlog',
    'purchaseOrder',
    'InventoryList',
    'GroupPriceList',
    'InventoryTypeList',
    'inventoryTransaction',
    'deliveryOrder',
    'deliveryInventoryList',
    'reservation',
    'LOVList',
    'licensePlate',
    'driver',
    'smartpoleStatistic',
    'smartpoleDeviceLocation',
    'smartpoleInformationDevice',
    'smartpoleCctvDevice',
    'smartpoleSprayWaterVolumeDevice',
    'smartpoleEnergyConsumptionDevice',
    'smartpoleSprayWaterHistory',
    'smartpoleAirQualityDevice',
    'smartpoleDeviceList',
    'smartpoleDeviceChartList',
    'workOrderProductionLog',
    'DeviceList',
    'GroupList',
    'DeviceRelationList',
    'reportLogList',
    'userProfileImage',
    'userProfile',
    'deviceAlertLogs',
  ],
  endpoints: () => ({}),
});

export const {
  util: { resetApiState: resetMainStoreAPI },
} = mainStoreAPI;
