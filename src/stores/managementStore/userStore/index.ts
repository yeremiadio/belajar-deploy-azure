import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  BackendResponse,
  IBackendDataPageShape,
  TBackendPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import { IUserData, IUserParams, IUserRequestObj } from '@/types/api/user';
import {
  IPermissionData,
  IPermissionReqObj,
  TUserPermission,
} from '@/types/api/permission';

import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';

export const userStoreApi = createApi({
  reducerPath: 'userStoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${UsedAPI}/user`,
    prepareHeaders: (headers) => customPrepareHeaderRtkStore(headers),
  }),
  tagTypes: ['UserList', 'PermissionList', 'UserPermission'],
  endpoints: (builder) => {
    return {
      getUser: builder.query<
        TPaginationResponse<IUserData[]>,
        TBackendPaginationRequestObject<Partial<IUserParams>>
      >({
        query: (obj) => {
          const url = '/find';
          return {
            url,
            method: 'GET',
            params: {
              ...obj,
            },
          };
        },
        transformResponse: (response: IBackendDataPageShape<IUserData[]>) =>
          response.data,
        providesTags: ['UserList'],
      }),
      createUser: builder.mutation<
        BackendResponse<{ id: number }[]>,
        Partial<IUserRequestObj>
      >({
        query: (obj) => {
          return {
            url: '/register',
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['UserList'],
      }),
      updateUser: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<IUserRequestObj>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['UserList'],
      }),
      deleteUser: builder.mutation<BackendResponse<string>, { id: number }>({
        query: ({ id }) => {
          return {
            url: `/delete/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['UserList'],
      }),
      resertpassword: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `/resetpassword/${id}`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['UserList'],
      }),
      resendVerificationEmail: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({id}) => {
          return {
            url: `/${id}/verify/email`,
            method: 'POST',
          };
        },
        invalidatesTags: ['UserList'],
      }),
      savePermissions: builder.mutation<
        BackendResponse<string>,
        { id: number; data: Partial<IPermissionReqObj> }
      >({
        query: ({ id, data }) => {
          return {
            url: `/${id}/permissions`,
            method: 'POST',
            body: data,
          };
        },
        invalidatesTags: ['UserList', 'PermissionList'],
      }),
      getMyPermission: builder.query<IPermissionData, Partial<IUserData>>({
        query: ({ id }) => {
          const url = `/${id}/permissions`;
          return {
            url,
            method: 'GET',
          };
        },
        transformResponse: (response: BackendResponse<IPermissionData>) =>
          response.data,
        providesTags: ['PermissionList'],
      }),
      getPermissionByJwt: builder.query<TUserPermission, void>({
        query: () => {
          return {
            url: `/permissions`,
            method: 'GET',
          };
        },
        transformResponse: (response: BackendResponse<TUserPermission>) =>
          response.data,
        providesTags: ['UserPermission'],
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useResertpasswordMutation,
  useResendVerificationEmailMutation,
  useSavePermissionsMutation,
  useGetMyPermissionQuery,
  useGetPermissionByJwtQuery,
  util: { resetApiState: resetUserStoreApiState },
} = userStoreApi;
