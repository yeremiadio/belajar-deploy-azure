import { UsedAPI } from '@/utils/configs/endpoint';

import { BackendResponse } from '@/types/api';
import { LoginFormData, LoginResponse } from '@/types/api/auth';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${UsedAPI}/user` }),
  tagTypes: [],
  endpoints: (builder) => ({
    getLogin: builder.mutation<BackendResponse<LoginResponse>, LoginFormData>({
      query: (obj) => ({
        url: `/login`,
        method: 'POST',
        body: obj,
      }),
    }),
  }),
});

export const {
  useGetLoginMutation,
  util: { resetApiState: resetAuthApiState },
} = authApi;
