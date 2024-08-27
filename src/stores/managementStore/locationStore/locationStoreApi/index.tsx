import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  ILocation,
  ILocationObj,
  ILocationSubmitFormObject,
} from '@/types/api/management/location';
import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';

import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';

export const locationStoreAPI = createApi({
  reducerPath: 'locationStoreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/location`,
    prepareHeaders: (headers, { endpoint }) => {
      const customHeader = customPrepareHeaderRtkStore(headers);
      const endpointList = [
        'getLocation',
        'createLocation',
        'updateLocation',
        'deleteLocation',
        'addPinpointLocation',
      ];
      if (endpointList.includes(endpoint)) {
        customHeader.set('Version-Header', '2');
      }
      return customHeader;
    },
    // prepareHeaders: (headers) => customPrepareHeaderRtkStore(headers),
  }),
  tagTypes: [
    'LocationList',
    'LocationListV1',
    'Sublocation1List',
    'Sublocation2List',
  ],
  endpoints: (builder) => {
    return {
      getLocation: builder.query<
        TPaginationResponse<ILocation[]>,
        TBackendPaginationRequestObject<Partial<ILocationObj>>
      >({
        query: (obj) => {
          return {
            url: '/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: IBackendDataPageShape<ILocation[]>) =>
          response.data,
        providesTags: ['LocationList'],
      }),
      getLocationV1: builder.query<ILocation[], Partial<ILocationObj>>({
        query: (obj) => {
          return {
            url: '/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: BackendResponse<ILocation[]>) =>
          response.data,
        providesTags: ['LocationListV1'],
      }),
      createLocation: builder.mutation<ILocation, Partial<ILocationSubmitFormObject & object>>({
        query: (data) => ({
          url: `/create`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['LocationList', 'LocationListV1'],
      }),
      addPinpointLocation: builder.mutation<
        object,
        { id: number; lat: number; lng: number }
      >({
        query: ({ id, ...obj }) => ({
          url: `/addpinpoint/${id}`,
          method: 'PATCH',
          body: obj,
        }),
        invalidatesTags: ['LocationList', 'LocationListV1'],
      }),
      updateLocation: builder.mutation<
        ILocation,
        {
          id: number;
          data: Partial<ILocationSubmitFormObject & object>;
        }
      >({
        query: ({ id, data }) => ({
          url: `/update/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['LocationList', 'LocationListV1'],
      }),
      deleteLocation: builder.mutation<ILocation, number>({
        query: (id) => ({
          url: `/delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['LocationList', 'LocationListV1'],
      }),
    };
  },
});

export const {
  useGetLocationQuery,
  useGetLocationV1Query,
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
  useAddPinpointLocationMutation,
  util: { resetApiState: resetLocationStoreAPI },
} = locationStoreAPI;
