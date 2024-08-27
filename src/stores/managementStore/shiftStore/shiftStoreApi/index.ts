import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BackendResponse } from '@/types/api';

import { UsedAPI } from '@/utils/configs/endpoint';
import customPrepareHeaderRtkStore from '@/utils/functions/customPrepareHeaderRtkStore';
import { IShift } from '@/types/api/management/shift';

export const shiftStoreApi = createApi({
    reducerPath: 'shiftStoreApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${UsedAPI}/shift`,
        prepareHeaders: (headers) => customPrepareHeaderRtkStore(headers),
    }),
    tagTypes: ['ShiftList'],
    endpoints: (builder) => {
        return {
            getShift: builder.query<IShift[], Partial<IShift>>({
                query: (obj) => {
                    return {
                        url: 'find',
                        method: 'GET',
                        params: { ...obj },
                    };
                },
                transformResponse: (response: BackendResponse<IShift[]>) =>
                    response.data,
                providesTags: ['ShiftList'],
            }),
        };
    },
});

export const {
    useGetShiftQuery,
    util: { resetApiState: resetShiftApiState },
} = shiftStoreApi;
