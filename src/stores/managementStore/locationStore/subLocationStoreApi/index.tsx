import { BackendResponse } from '@/types/api';

import {
  ILocationWithSublocation2,
  ISubLocation1Obj,
  ILocationObj,
} from '@/types/api/management/location';

import { locationStoreAPI } from '@/stores/managementStore/locationStore/locationStoreApi';

export const sublocationStoreAPI = locationStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getSublocation2List: builder.query<
        ILocationWithSublocation2[],
        Partial<ILocationObj>
      >({
        query: (obj) => {
          return {
            url: '/sub2/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: BackendResponse<ILocationWithSublocation2[]>,
        ) => response.data,
        providesTags: ['Sublocation2List'],
      }),
      getSublocation1List: builder.query<
        ISubLocation1Obj[],
        Partial<ILocationObj>
      >({
        query: (obj) => {
          return {
            url: '/sub1/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<ISubLocation1Obj[]>) =>
          response.data,
        providesTags: ['Sublocation1List'],
      }),
    };
  },
});

export const {
  useGetSublocation2ListQuery,
  useGetSublocation1ListQuery,
  util: { resetApiState: resetSublocationStoreAPI },
} = sublocationStoreAPI;
