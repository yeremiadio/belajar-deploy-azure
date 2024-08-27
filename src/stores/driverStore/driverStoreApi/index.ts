import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import { IReservationQueryParameter, TDriver } from '@/types/api/reservation';
import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

const url = '/drivers';

export const driverStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query<
      TPaginationResponse<TDriver[]>,
      TBackendPaginationRequestObject<Partial<IReservationQueryParameter>>
    >({
      query: (obj) => {
        return {
          url: url,
          method: 'GET',
          params: { ...obj },
        };
      },
      transformResponse: (response: IBackendDataPageShape<TDriver[]>) =>
        response.data,
      providesTags: ['driver'],
    }),

    getDriverById: builder.query<TDriver, { id: number }>({
      query: ({ id }) => {
        return {
          url: `${url}/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (res: BackendResponse<TDriver>) => {
        return res.data;
      },
    }),

    postDriver: builder.mutation<BackendResponse<string>, Partial<TDriver>>({
      query: (obj) => {
        return {
          url: url,
          method: 'POST',
          body: obj,
        };
      },
      invalidatesTags: ['driver'],
    }),

    patchDriver: builder.mutation<
      BackendResponse<string>,
      {
        id: number;
      } & Partial<TDriver>
    >({
      query: ({ id, ...obj }) => {
        return {
          url: `${url}/${id}`,
          method: 'PATCH',
          body: obj,
        };
      },
      invalidatesTags: ['driver'],
    }),

    deleteDriver: builder.mutation<
      BackendResponse<string>,
      {
        id: number;
      }
    >({
      query: ({ id }) => {
        return {
          url: `${url}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['driver'],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverByIdQuery,
  usePostDriverMutation,
  usePatchDriverMutation,
  useDeleteDriverMutation,
  util: { resetApiState: resetDriverStoreAPI },
} = driverStoreApi;
