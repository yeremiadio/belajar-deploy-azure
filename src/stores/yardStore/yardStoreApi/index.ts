import { BackendResponse } from '@/types/api';

import { TYard } from '@/types/api/yard';
import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

export const yardStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getYardDashboard: builder.query<
      BackendResponse<TYard>,
      {
        gatewayId: number;
      }
    >({
      query: ({ gatewayId }) => `/yard-management/dashboard/${gatewayId}`,
      providesTags: ['yard'],
    }),
  }),
});
export const { useGetYardDashboardQuery } = yardStoreApi;
