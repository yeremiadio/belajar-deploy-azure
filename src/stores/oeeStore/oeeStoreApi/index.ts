import {
  BackendResponse,
} from '@/types/api';
import { IOeeThresholdResponse } from '@/types/api/oee';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

const oeeUrl = '/oee/oeethreshold';

export const oeeStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      updateOeeThreshold: builder.mutation<
        BackendResponse<IOeeThresholdResponse>,
        { oee: number | number[], quality: number | number[], availability: number | number[], performance: number | number[] }
      >({
        query: (obj) => {
          return {
            url: `${oeeUrl}/set`,
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['oeeThreshold'],
      }),
      getOeeThreshold: builder.query<IOeeThresholdResponse, {}>({
        query: () => {
          return {
            url: `${oeeUrl}/find`,
            method: 'GET',
          };
        },
        transformResponse: (res: BackendResponse<IOeeThresholdResponse>) => {
          return res.data;
        },
        providesTags: ['oeeThreshold'],
      }),
    };
  },
});

export const {
  useUpdateOeeThresholdMutation,
  useGetOeeThresholdQuery,
  util: { resetApiState: resetOeeStoreAPI },
} = oeeStoreAPI;
