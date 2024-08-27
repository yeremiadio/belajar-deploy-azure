import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import {
  IReservationQueryParameter,
  TLicensePlate,
} from '@/types/api/reservation';

const url = '/license-plates';

export const licensePlateStore = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLicensePlates: builder.query<
      TPaginationResponse<TLicensePlate[]>,
      TBackendPaginationRequestObject<Partial<IReservationQueryParameter>>
    >({
      query: (obj) => {
        return {
          url: url,
          method: 'GET',
          params: { ...obj },
        };
      },
      transformResponse: (response: IBackendDataPageShape<TLicensePlate[]>) =>
        response.data,
      providesTags: ['licensePlate'],
    }),

    getLicensePlateById: builder.query<TLicensePlate, { id: number }>({
      query: ({ id }) => {
        return {
          url: `${url}/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (res: BackendResponse<TLicensePlate>) => {
        return res.data;
      },
    }),

    postLicensePlate: builder.mutation<any, Partial<TLicensePlate>>({
      query: (obj) => {
        return {
          url: url,
          method: 'POST',
          body: obj,
        };
      },
      invalidatesTags: ['licensePlate'],
    }),

    patchLicensePlate: builder.mutation<
      BackendResponse<string>,
      {
        id: number;
      } & Partial<TLicensePlate>
    >({
      query: ({ id, ...obj }) => {
        return {
          url: `${url}/${id}`,
          method: 'PATCH',
          body: obj,
        };
      },
      invalidatesTags: ['licensePlate'],
    }),

    deleteLicensePlate: builder.mutation<
      BackendResponse<string>,
      { id: number }
    >({
      query: ({ id }) => {
        return {
          url: `${url}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['licensePlate'],
    }),
  }),
});

export const {
  useGetLicensePlatesQuery,
  useGetLicensePlateByIdQuery,
  usePostLicensePlateMutation,
  usePatchLicensePlateMutation,
  useDeleteLicensePlateMutation,
  util: { resetApiState: resetVendorStoreAPI },
} = licensePlateStore;
