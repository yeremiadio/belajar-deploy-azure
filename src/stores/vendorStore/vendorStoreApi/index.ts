import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loadCookie } from '@/services/cookie';
import { BackendResponse, IBackendDataPageShape, TBackendPaginationRequestObject, TPaginationResponse } from '@/types/api';
import { IReservationQueryParameter, TReservationVendorFormObject, TVendor } from '@/types/api/reservation';
import { UsedAPI } from '@/utils/configs/endpoint';


export const vendorStoreApi = createApi({
  reducerPath: 'vendorStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/vendors`,
    prepareHeaders: (headers) => {
      const token = loadCookie('token');
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Vendor'],
  endpoints: (builder) => ({
    getVendors: builder.query<
    TPaginationResponse<TVendor[]>,
    TBackendPaginationRequestObject<Partial<IReservationQueryParameter>>
  >({
    query: (obj) => {
      return {
        url: '',
        method: 'GET',
        params: { ...obj },
      };
    },
    transformResponse: (
      response: IBackendDataPageShape<TVendor[]>,
    ) => response.data,
    providesTags: ['Vendor'],
  }),

    getVendorById: builder.query<TVendor, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (res: BackendResponse<TVendor>) => {
        return res.data;
      },
    }),

    postVendor: builder.mutation< BackendResponse<TVendor>, TReservationVendorFormObject>({
      query: (obj) => {
        return {
          url: '',
          method: 'POST',
          body: obj,
        };
      },
      invalidatesTags: ['Vendor'],
    }),

    patchVendor: builder.mutation<
    BackendResponse<string>,
      {
        id: number;
      } & TReservationVendorFormObject
    >({
      query: ({ id, ...obj }) => {
        return {
          url: `/${id}`,
          method: 'PATCH',
          body: obj,
        };
      },
      invalidatesTags: ['Vendor'],
    }),

    deleteVendor: builder.mutation< BackendResponse<string>, { id: number }>({
      query: ({ id }) => {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Vendor'],
    }),
    resendVerificationEmail: builder.mutation<
    BackendResponse<string>,
    {
      id: number;
    }
  >({
    query: ({id}) => {
      return {
        url: `/${id}/send-email-verification`,
        method: 'POST',
      };
    },
    invalidatesTags: ['Vendor'],
  }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  usePostVendorMutation,
  usePatchVendorMutation,
  useDeleteVendorMutation,
  useResendVerificationEmailMutation,
  util: { resetApiState: resetVendorStoreAPI },
} = vendorStoreApi;
