import type { PreloadedState } from '@reduxjs/toolkit';
import {
  Middleware,
  combineReducers,
  configureStore,
  isRejected,
} from '@reduxjs/toolkit';
import { UnknownAsyncThunkRejectedWithValueAction } from '@reduxjs/toolkit/dist/matchers';

import { alertStoreAPI } from '@/stores/alertStore/alertStoreApi';
import { authApi } from '@/stores/authStore/authStoreApi';
import { copilotApi } from '@/stores/copilotStore/copilotStoreApi';
import toggleCopilotSlice from '@/stores/copilotStore/toggleCopilotSlice';
import inventorySlice from '@/stores/inventoryStore/inventorySlice';
import { employeeTrackerApi } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { energyMeterApi } from '@/stores/energyMeterStore/energyMeterStoreApi';
import { enviroboxApi } from '@/stores/enviroboxStore/enviroboxStoreApi';
import { ewsFloodApi } from '@/stores/ewsStore/ewsFloodStoreApi';
import { ewsForestFireApi } from '@/stores/ewsStore/ewsForestFireStoreApi';
import rapidsenseHtmlReducer from '@/stores/htmlRefStore/htmlRefSlice';
import { itemStoreApi } from '@/stores/itemStore/itemStoreApi';
import languageReducer from '@/stores/languageStore/languageSlice';
import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import { companyStoreAPI } from '@/stores/managementStore/companyStore/companyStoreApi';
import { deviceStoreAPI } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { devicetypeStoreAPI } from '@/stores/managementStore/deviceTypeStore/deviceTypeStoreApi';
import { employeeStoreAPI } from '@/stores/managementStore/employeeStore/employeeStoreApi';
import { gatewayStoreApi } from '@/stores/managementStore/gatewayStoreApi';
import { locationStoreAPI } from '@/stores/managementStore/locationStore/locationStoreApi';
import { sensorStoreApi } from '@/stores/managementStore/sensorStore/sensorStoreApi';
import purchaseOrderSlice from '@/stores/purchaseOrderStore/purchaseOrderSlice';
import { sensorlogSummariesStoreAPI } from '@/stores/sensorlogSummariesStore/sensorlogSummariesStoreApi';
import { vendorStoreApi } from '@/stores/vendorStore/vendorStoreApi';
import { waterLevelApi } from '@/stores/waterLevelStore/waterLevelStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';

import { ROUTES } from '@/utils/configs/route';

import { inventoryStoreAPI } from '@/stores/managementStore/inventoryStore';
import { moduleStoreAPI } from '@/stores/managementStore/moduleStore/modulesStoreApi';
import { shiftStoreApi } from '@/stores/managementStore/shiftStore/shiftStoreApi';
import { userStoreApi } from '@/stores/managementStore/userStore';
import { userTypeStoreApi } from '@/stores/userTypeStoreApi';

const rootReducer = combineReducers({
  toggleCopilotSlice: toggleCopilotSlice,
  inventorySlice: inventorySlice,
  rapidsenseHtml: rapidsenseHtmlReducer,
  language: languageReducer,
  order: purchaseOrderSlice,
  [authApi.reducerPath]: authApi.reducer,
  [alertStoreAPI.reducerPath]: alertStoreAPI.reducer,
  [copilotApi.reducerPath]: copilotApi.reducer,
  [energyMeterApi.reducerPath]: energyMeterApi.reducer,
  [waterLevelApi.reducerPath]: waterLevelApi.reducer,
  [ewsForestFireApi.reducerPath]: ewsForestFireApi.reducer,
  [ewsFloodApi.reducerPath]: ewsFloodApi.reducer,
  [sensorStoreApi.reducerPath]: sensorStoreApi.reducer,
  [employeeTrackerApi.reducerPath]: employeeTrackerApi.reducer,
  [gatewayStoreApi.reducerPath]: gatewayStoreApi.reducer,
  [locationStoreAPI.reducerPath]: locationStoreAPI.reducer,
  [shiftStoreApi.reducerPath]: shiftStoreApi.reducer,
  [companyStoreAPI.reducerPath]: companyStoreAPI.reducer,
  [devicetypeStoreAPI.reducerPath]: devicetypeStoreAPI.reducer,
  [enviroboxApi.reducerPath]: enviroboxApi.reducer,
  [userStoreApi.reducerPath]: userStoreApi.reducer,
  [userTypeStoreApi.reducerPath]: userTypeStoreApi.reducer,
  [moduleStoreAPI.reducerPath]: moduleStoreAPI.reducer,
  [employeeStoreAPI.reducerPath]: employeeStoreAPI.reducer,
  [sensorlogSummariesStoreAPI.reducerPath]: sensorlogSummariesStoreAPI.reducer,
  [vendorStoreApi.reducerPath]: vendorStoreApi.reducer,
  [itemStoreApi.reducerPath]: itemStoreApi.reducer,
  [mainStoreAPI.reducerPath]: mainStoreAPI.reducer,
});

// this function is for handling globally if rtk query response error
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const act = action as UnknownAsyncThunkRejectedWithValueAction;
    const payload = act.payload;

    const isBEErrorPayload = (
      payload: any,
    ): payload is ErrorMessageBackendDataShape => {
      return payload?.data?.status && payload.data.status === 'error';
    };
    if (isBEErrorPayload(payload)) {
      if (payload.status === 500) {
        window.location.replace(ROUTES.internalError);
      }
    }
  }
  return next(action);
};

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware({
        // copilotApi.middleware is not serializable
        serializableCheck: false,
      }).concat([
        authApi.middleware,
        alertStoreAPI.middleware,
        copilotApi.middleware,
        energyMeterApi.middleware,
        waterLevelApi.middleware,
        ewsForestFireApi.middleware,
        ewsFloodApi.middleware,
        sensorStoreApi.middleware,
        employeeTrackerApi.middleware,
        deviceStoreAPI.middleware,
        gatewayStoreApi.middleware,
        locationStoreAPI.middleware,
        companyStoreAPI.middleware,
        devicetypeStoreAPI.middleware,
        enviroboxApi.middleware,
        userStoreApi.middleware,
        userTypeStoreApi.middleware,
        shiftStoreApi.middleware,
        moduleStoreAPI.middleware,
        employeeStoreAPI.middleware,
        sensorlogSummariesStoreAPI.middleware,
        mainStoreAPI.middleware,
        vendorStoreApi.middleware,
        itemStoreApi.middleware,
        inventoryStoreAPI.middleware,
        // rtkQueryErrorLogger,
      ]),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
