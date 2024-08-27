import { showProfileImage } from '@/api/userApi';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import { BackendResponse } from '@/types/api';
import {
  TUserPasswordUpdateRequest,
  TUserProfileResponse,
  TUserProfileUpdateRequest,
} from '@/types/api/user';

import { convertAxiosResponseImageToString } from '@/utils/functions/convertAxiosImageResponseToString';

const url = '/user';

const userStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserProfile: builder.query<TUserProfileResponse, void>({
        query: () => {
          return {
            url: `${url}/profile`,
            method: 'GET',
          };
        },
        providesTags: ['userProfile'],
        transformResponse: (
          response: BackendResponse<TUserProfileResponse>,
        ) => {
          return response.data;
        },
      }),

      updateUserProfile: builder.mutation<
        BackendResponse<string>,
        Partial<TUserProfileUpdateRequest>
      >({
        query: (data) => {
          return {
            url: `${url}/update/profile`,
            method: 'PATCH',
            body: data,
          };
        },
        invalidatesTags: ['userProfile'],
      }),

      postUserProfileImage: builder.mutation<BackendResponse<string>, File>({
        query: (data) => {
          const formData = new FormData();
          formData.append('file', data);
          return {
            url: `${url}/picture/upload`,
            method: 'POST',
            body: formData,
          };
        },
        invalidatesTags: ['userProfileImage'],
      }),

      getUserProfileImage: builder.query<string | null, void>({
        queryFn: async () => {
          const res = await showProfileImage();
          const base64Res = convertAxiosResponseImageToString(res);
          return {
            data: base64Res || null,
          };
        },
        providesTags: ['userProfileImage'],
      }),

      updateUserPassword: builder.mutation<
        BackendResponse<string>,
        TUserPasswordUpdateRequest
      >({
        query: (data) => {
          return {
            url: `${url}/change-password`,
            method: 'PATCH',
            body: data,
          };
        },
      }),

      postResetPassword: builder.mutation<
        BackendResponse<string>,
        { password: string; jwt: string }
      >({
        query: (data) => {
          return {
            url: `${url}/reset-password`,
            method: 'POST',
            body: {
              password: data.password,
            },
            headers: {
              Authorization: `Bearer ${data.jwt}`,
            },
          };
        },
      }),

      postForgotPassword: builder.mutation<
        BackendResponse<string>,
        { username: string }
      >({
        query: (data) => {
          return {
            url: `${url}/forgot-password`,
            method: 'POST',
            body: data,
          };
        },
      }),

      postVerifyEmail: builder.mutation<
        BackendResponse<string>,
        { jwt: string }
      >({
        query: (data) => {
          return {
            url: `${url}/verify-email`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${data.jwt}`,
            },
          };
        },
      }),
    };
  },
});

export const {
  useGetUserProfileQuery,
  usePostUserProfileImageMutation,
  useUpdateUserPasswordMutation,
  usePostForgotPasswordMutation,
  useUpdateUserProfileMutation,
  usePostVerifyEmailMutation,
  useGetUserProfileImageQuery,
  usePostResetPasswordMutation,
} = userStoreApi;
