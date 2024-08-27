import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import {
  ICompany,
  ICompanyObj,
  ICompanyV2QueryParameterObject,
} from '@/types/api/management/company';

import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';

export const companyStoreAPI = createApi({
  reducerPath: 'companyStoreAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/company`,
    prepareHeaders: (headers, { endpoint }) => {
      const customHeader = customPrepareHeaderRtkStore(headers);
      const endpointList = [
        'getCompaniesV2',
        'createCompany',
        'updateCompany',
        'deleteCompany',
      ];
      if (endpointList.includes(endpoint)) {
        customHeader.set('Version-Header', '2');
      }
      return customHeader;
    },
  }),
  tagTypes: ['CompanyList', 'CompanyListV2'],
  endpoints: (builder) => {
    return {
      getCompanies: builder.query<
        TPaginationResponse<ICompany[]>,
        Partial<ICompanyObj>
      >({
        query: (obj) => {
          return {
            url: '/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: IBackendDataPageShape<ICompany[]>) =>
          response.data,
        providesTags: ['CompanyList'],
      }),
      getCompanyById: builder.query<ICompany, Partial<ICompany>>({
        query: ({ id, ...rest }) => {
          return {
            url: `/${id}`,
            method: 'GET',
            params: { ...rest },
          };
        },
        transformResponse: (response: BackendResponse<ICompany>) =>
          response.data,
        providesTags: ['CompanyList'],
      }),
      getCompaniesV2: builder.query<
        TPaginationResponse<ICompany[]>,
        TBackendPaginationRequestObject<Partial<ICompanyV2QueryParameterObject>>
      >({
        query: (obj) => {
          return {
            url: '/find',
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (response: IBackendDataPageShape<ICompany[]>) =>
          response.data,
        providesTags: ['CompanyListV2'],
      }),
      createCompany: builder.mutation<
        BackendResponse<{ id: number }[]>,
        Partial<ICompanyObj>
      >({
        query: (obj) => {
          return {
            url: '/create',
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['CompanyListV2'],
      }),
      updateCompany: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<ICompanyObj>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['CompanyListV2'],
      }),
      deleteCompany: builder.mutation<BackendResponse<string>, { id: number }>({
        query: ({ id }) => {
          return {
            url: `/delete/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['CompanyListV2'],
      }),
    };
  },
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetCompaniesV2Query,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  util: { resetApiState: resetCompanyStoreAPI },
} = companyStoreAPI;
