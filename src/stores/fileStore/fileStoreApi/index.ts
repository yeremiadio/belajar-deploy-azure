import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import { BackendResponse } from '@/types/api';
import { TFileMetadata } from '@/types/api/file';

const fileStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMetadataFile: builder.query<
      BackendResponse<TFileMetadata>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/files/${id}/metadata`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMetadataFileQuery, useLazyGetMetadataFileQuery } =
  fileStoreApi;
