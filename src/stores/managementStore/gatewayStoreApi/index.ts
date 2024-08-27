import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { loadCookie } from '@/services/cookie';

import { UsedAPI } from '@/utils/configs/endpoint';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';

import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import {
  IGateway,
  IGatewayRequestObject,
  TGatewayRequestFormObject,
} from '@/types/api/management/gateway';
import { ICompany } from '@/types/api/management/company';

export const gatewayStoreApi = createApi({
  reducerPath: 'gatewayStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}`,
    prepareHeaders: (headers) => {
      headers.set('Version-Header', `2`);

      //Please always include this (saveJwtInfo), this for copilot purpose
      saveJwtInfo();
      const token = loadCookie('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['gateway', 'lov-company', 'lov-location', 'lov-modules'],
  endpoints: (builder) => ({
    getGatewayList: builder.query<
      TPaginationResponse<IGateway[]>,
      TBackendPaginationRequestObject<Partial<IGatewayRequestObject>>
    >({
      query: (obj) => {
        return {
          url: '/gateway/find',
          method: 'GET',
          params: { ...obj },
        };
      },
      transformResponse: (response: IBackendDataPageShape<IGateway[]>) =>
        response.data,
      providesTags: ['gateway'],
    }),

    getGateway: builder.query<IGateway, number>({
      query: (id) => ({
        url: `/gateway/find/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: BackendResponse<IGateway>) => response.data,
      providesTags: ['gateway'],
    }),

    getCompanies: builder.query<ICompany[], Partial<ICompany>>({
      query: () => ({
        url: `/company/find`,
        method: 'GET',
      }),
      transformResponse: (response: BackendResponse<ICompany[]>) =>
        response.data,
      providesTags: ['gateway'],
    }),
    createGateway: builder.mutation<IGateway, TGatewayRequestFormObject>({
      query: (data) => ({
        url: `/gateway/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gateway'],
    }),

    updateGateway: builder.mutation<
      IGateway,
      {
        id: number;
        data: TGatewayRequestFormObject;
      }
    >({
      query: ({ id, data }) => ({
        url: `/gateway/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['gateway'],
    }),

    deleteGateway: builder.mutation<IGateway, number>({
      query: (id) => ({
        url: `/gateway/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['gateway'],
    }),
  }),
});

export const {
  useGetGatewayListQuery,
  useGetCompaniesQuery,
  useGetGatewayQuery,
  useCreateGatewayMutation,
  useUpdateGatewayMutation,
  useDeleteGatewayMutation,
  util: { resetApiState: resetGatewayApiState },
} = gatewayStoreApi;
