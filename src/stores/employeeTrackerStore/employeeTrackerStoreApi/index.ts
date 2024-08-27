import { loadCookie } from '@/services/cookie';
import { BackendResponse } from '@/types/api';
import {
    TEmployeeActivity, TEmployeeAvailability, TEmployeeAvailabilityTrend, TEmployeeDetail,
    TEmployeeLocation, TEmployeeStatus, TEmployeeSummary, TEmployeeTrackerParams, TFlatCoordinate
} from '@/types/api/employeeTracker';
import { UsedAPI } from '@/utils/configs/endpoint';
import { saveJwtInfo } from '@/utils/functions/saveJwtInfo';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const employeeTrackerApi = createApi({
  reducerPath: 'employeeTrackerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/employee-tracker`,
    prepareHeaders: (headers) => {
      saveJwtInfo();
      const token = loadCookie('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['employee'],
  endpoints: (builder) => ({
    getEmployeeSummary: builder.query<
      TEmployeeSummary,
      Partial<TEmployeeTrackerParams>
    >({
      query: (obj) => ({
        url: `/summary`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TEmployeeSummary>) =>
        response.data,
      providesTags: ['employee'],
    }),

    getEmployeeActivities: builder.query<
      TEmployeeActivity[],
      {
        shift: number;
        gatewayId?: number;
      }
    >({
      query: ({ shift, gatewayId }) => ({
        url: `/employees-activities`,
        method: 'GET',
        params: {
          shift,
          gatewayId,
        },
      }),
      transformResponse: (response: BackendResponse<TEmployeeActivity[]>) =>
        response.data,
      providesTags: ['employee'],
    }),

    getEmployeeLocations: builder.query<
      TEmployeeLocation,
      Partial<TEmployeeTrackerParams>
    >({
      query: (obj) => ({
        url: `/employees-location`,
        method: 'GET',
        params: { ...obj },
      }),
      transformResponse: (response: BackendResponse<TEmployeeLocation>) =>
        response.data,
      providesTags: ['employee'],
    }),

    getEmpActivity: builder.query<
      TEmployeeDetail,
      Partial<TEmployeeTrackerParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `/employees-activities/${id}`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TEmployeeDetail>) =>
        response.data,
      providesTags: (_, __, { id }) => [{ type: 'employee', id }],
    }),

    getEmpAvailability: builder.query<
      TEmployeeAvailability,
      Partial<TEmployeeTrackerParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `/employees-activities/${id}/availability`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TEmployeeAvailability>) =>
        response.data,
      providesTags: (_, __, { id }) => [{ type: 'employee', id }],
    }),

    getEmpAvailabilityTrend: builder.query<
      TEmployeeAvailabilityTrend[],
      Partial<TEmployeeTrackerParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `/employees-activities/${id}/availability-trend`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (
        response: BackendResponse<TEmployeeAvailabilityTrend[]>,
      ) => response.data,
      providesTags: (_, __, { id }) => [{ type: 'employee', id }],
    }),

    getEmpActivityLog: builder.query<
      TEmployeeStatus[],
      Partial<TEmployeeTrackerParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `/employees-activities/${id}/activity-log`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TEmployeeStatus[]>) =>
        response.data,
      providesTags: (_, __, { id }) => [{ type: 'employee', id }],
    }),

    getEmpCurrentLocation: builder.query<
      TFlatCoordinate,
      Partial<TEmployeeTrackerParams>
    >({
      query: ({ id, ...rest }) => ({
        url: `/employees-activities/${id}/current-location`,
        method: 'GET',
        params: { ...rest },
      }),
      transformResponse: (response: BackendResponse<TFlatCoordinate>) =>
        response.data,
      providesTags: (_, __, { id }) => [{ type: 'employee', id }],
    }),
  }),
});

export const {
  useGetEmployeeSummaryQuery,
  useGetEmployeeActivitiesQuery,
  useGetEmployeeLocationsQuery,
  useGetEmpActivityQuery,
  useGetEmpAvailabilityQuery,
  useGetEmpAvailabilityTrendQuery,
  useGetEmpActivityLogQuery,
  useGetEmpCurrentLocationQuery,
  util: { resetApiState: resetEmployeeTrackerApiState },
} = employeeTrackerApi;
