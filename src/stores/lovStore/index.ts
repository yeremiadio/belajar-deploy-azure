import { LOVTypeEnum } from '@/types/api';
import { mainStoreAPI } from '../mainStore/mainStoreApi';


export const lovStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
    getLOV: builder.query<
    string[],
    {type: LOVTypeEnum}
  >({
    query: ({ type }) => {
      return {
        url: '/lov',
        method: 'GET',
        params: { type },
      };
    },
    transformResponse: (
      response: string[],
    ) => response,
    providesTags: ['LOVList'],
  }),
};
},
});
export const {
  useGetLOVQuery,
  util: { resetApiState: resetLOVStoreAPI },
} = lovStoreApi;
