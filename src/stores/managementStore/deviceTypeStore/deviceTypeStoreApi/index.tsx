import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UsedAPI } from '@/utils/configs/endpoint';

import { IDeviceTypeShort } from '@/types/api/management/device';
import { BackendResponse } from '@/types/api';

import { loadCookie } from '@/services/cookie';

export const devicetypeStoreAPI = createApi({
  reducerPath: 'devicetypeStoreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/devicetype`,
    prepareHeaders: (headers) => {
      let token = loadCookie('token');
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Devicetypelist'],
  endpoints: (builder) => {
    return {
      getDevicetypes: builder.query<IDeviceTypeShort[], { id?: number }>({
        query: (obj) => {
          return {
            url: '/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (res: BackendResponse<IDeviceTypeShort[]>) => {
          return res.data;
        },
        providesTags: ['Devicetypelist'],
      }),
    };
  },
});

export const {
  useGetDevicetypesQuery,
  util: { resetApiState: resetDevicetypeStoreAPI },
} = devicetypeStoreAPI;
