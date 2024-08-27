import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BackendResponse } from '@/types/api';

import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';
import { IModule } from '@/types/api/module';

export const moduleStoreAPI = createApi({
  reducerPath: 'moduleStoreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/modules`,
    prepareHeaders: (headers, { endpoint }) => {
      const customHeader = customPrepareHeaderRtkStore(headers);
      const endpointList = ['getModuleV2']
      if (endpointList.includes(endpoint)) {
          customHeader.set("Version-Header", "2");
      }
      return customHeader;
  },
  }),
  tagTypes: ['ModuleList', 'ModuleListV2'],
  endpoints: (builder) => {
    return {
      getModuleList: builder.query<IModule[], Partial<IModule>>({
        query: () => {
          return {
            url: '/find',
            method: 'GET',
          };
        },
        transformResponse: (response: BackendResponse<IModule[]>) =>
          response.data,
        providesTags: ['ModuleList'],
      }),
      getModuleV2: builder.query<IModule[], void>({
        query: () => {
          return {
            url: '/find',
            method: 'GET',
          };
        },
        transformResponse: (response: IModule[])  =>{
          return response
        },
        providesTags: ['ModuleListV2'],
      }),
    };
  },
});

export const {
  useGetModuleListQuery,
  useGetModuleV2Query,
  util: { resetApiState: resetModuleStoreAPI },
} = moduleStoreAPI;
