import {
  BackendResponse,
  IBackendDataPageShape,
  TPaginationResponse,
  TBackendPaginationRequestObject,
} from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import { ITagObjRequest, ITagObjResponse } from '@/types/api/management/tag';

const tagUrl = '/tag';

export const tagStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTag: builder.query<
        TPaginationResponse<ITagObjResponse[]>,
        TBackendPaginationRequestObject<Partial<ITagObjRequest>> & {
          isPaginated?: boolean;
        }
      >({
        query: (obj) => {
          return {
            url: `${tagUrl}/find`,
            method: 'GET',
            params: { ...obj, isPaginated: obj.isPaginated ?? true },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<ITagObjResponse[]>,
        ) => response.data,
        providesTags: ['tagList'],
      }),

      createTag: builder.mutation<
        BackendResponse<ITagObjResponse>,
        Partial<ITagObjRequest>
      >({
        query: (obj) => {
          return {
            url: `${tagUrl}/create`,
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['tagList'],
      }),
      updateTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
          data: Partial<ITagObjRequest>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `${tagUrl}/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['tagList'],
      }),

      deleteTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${tagUrl}/delete/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['tagList'],
      }),

      resetTag: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${tagUrl}/reset/${id}`,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['tagList'],
      }),

      getTagById: builder.query<ITagObjResponse, { id: number }>({
        query: ({ id }) => {
          return {
            url: `${tagUrl}/${id}`,
            method: 'GET',
          };
        },
        transformResponse: (res: BackendResponse<ITagObjResponse>) => {
          return res.data;
        },
      }),
    };
  },
});

export const {
  useGetTagQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
  useResetTagMutation,
  useUpdateTagMutation,
  useGetTagByIdQuery,
  util: { resetApiState: resetTagStoreAPI },
} = tagStoreAPI;
