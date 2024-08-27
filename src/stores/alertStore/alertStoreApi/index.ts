import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BackendResponse, IBackendDataPageShape, TBackendPaginationRequestObject, TPaginationResponse } from "@/types/api";
import { IAlert, IAlertRelation, IAlertRequestObject } from "@/types/api/management/alert";

import { UsedAPI } from "@/utils/configs/endpoint";
import customPrepareHeaderRtkStore from "@/utils/functions/customPrepareHeaderRtkStore";
import { IDeviceSensorRelation } from "@/types/api/management/device";

export const alertStoreAPI = createApi({
    reducerPath: "alertStoreAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${UsedAPI}/sensor/alert`,
        prepareHeaders: (headers, { endpoint }) => {
            const customHeader = customPrepareHeaderRtkStore(headers);
            const endpointList = ['getAlerts', 'updateAlert', 'removeRelationAlert']
            if (endpointList.includes(endpoint)) {
                customHeader.set("Version-Header", "2");
            }
            return customHeader;
        },
    }),
    tagTypes: ["alert", "alert-relation"],
    endpoints: (builder) => {
        return {
            getAlerts: builder.query<TPaginationResponse<IAlert[]>, TBackendPaginationRequestObject<Partial<Omit<IAlert, 'companyId'> & { search: string; companyId?: number }>>>({
                query: (obj) => {
                    const url = "/find";
                    return {
                        url,
                        method: "GET",
                        params: { ...obj }
                    };
                },
                transformResponse: (response: IBackendDataPageShape<IAlert[]>) =>
                    response.data,
                providesTags: ["alert"],
            }),
            getAlertsRelationDetails: builder.query<
                BackendResponse<IDeviceSensorRelation[]>,
                { alertId: number }
            >({
                query: (obj) => {
                    return {
                        url: '/findrelationdetails',
                        method: "GET",
                        params: {
                            ...obj
                        }
                    };
                },
                providesTags: (_, __, { alertId }) => [
                    { type: "alert-relation", id: alertId },
                ],
            }),
            createAlert: builder.mutation<
                BackendResponse<{ id: number }[]>,
                IAlertRequestObject
            >({
                query: (obj) => {
                    return {
                        url: "/create",
                        body: obj,
                        method: "POST",
                    };
                },
                invalidatesTags: ["alert"],
            }),
            updateAlert: builder.mutation<
                BackendResponse<string>,
                {
                    /**
                     * gateway Id
                     */
                    id: number;
                    data: Partial<IAlertRequestObject>;
                }
            >({
                query: ({ data, id }) => {
                    return {
                        url: `/update/${id}`,
                        body: data,
                        method: "PATCH",
                    };
                },
                invalidatesTags: ["alert"],
            }),
            createRelationsAlert: builder.mutation<
                BackendResponse<{ relationid: number }[]>,
                IAlertRelation
            >({
                query: (obj) => {
                    return {
                        url: "/addrelationarray",
                        body: obj,
                        method: "POST",
                    };
                },
                invalidatesTags: ["alert-relation", "alert"],
            }),
            removeRelationAlert: builder.mutation<
                BackendResponse<{ relationid: number }[]>,
                IAlertRelation
            >({
                query: (obj) => {
                    return {
                        url: `/removerelationarray`,
                        body: obj,
                        method: "POST",
                    };
                },
                invalidatesTags: ["alert-relation", "alert"],
            }),
            removeRelationAlertById: builder.mutation<
                BackendResponse<object>,
                { relationId: number; alertId: number; }
            >({
                query: (obj) => {
                    return {
                        url: `/removerelation`,
                        body: obj,
                        method: "POST",
                    };
                },
                invalidatesTags: ["alert-relation", "alert"],
            }),
            toggleEmailAlertStatus: builder.mutation<
                BackendResponse<string>,
                { alertId: number }
            >({
                query: ({ alertId }) => {
                    return {
                        url: "/emailstatus",
                        method: "POST",
                        body: { alertId },
                    };
                },
                invalidatesTags: ["alert"],
                // invalidatesTags: (_, __, { alertId }) => [
                //     { type: "alert", id: alertId },
                // ],
            }),
            toggleAlertStatus: builder.mutation<
                BackendResponse<string>,
                { alertId: number }
            >({
                query: ({ alertId }) => {
                    return {
                        url: "/status",
                        method: "POST",
                        body: { alertId },
                    };
                },
                invalidatesTags: ["alert"],
            }),

            toggleWhatsappAlertStatus: builder.mutation<
                BackendResponse<string>,
                { alertId: number }
            >({
                query: ({ alertId }) => {
                    return {
                        url: "/whatsappstatus",
                        method: "POST",
                        body: { alertId },
                    };
                },
                invalidatesTags: ["alert"],
            }),
            deleteAlert: builder.mutation<
                BackendResponse<string>,
                {
                    /**
                     * gateway Id
                     */
                    id: number;
                }
            >({
                query: ({ id }) => {
                    return {
                        url: `/delete/${id}`,
                        method: "DELETE",
                    };
                },
                invalidatesTags: ["alert"],
            }),
        };
    },
});

export const {
    useGetAlertsQuery,
    useGetAlertsRelationDetailsQuery,
    useCreateRelationsAlertMutation,
    useCreateAlertMutation,
    useUpdateAlertMutation,
    useRemoveRelationAlertMutation,
    useRemoveRelationAlertByIdMutation,
    useDeleteAlertMutation,
    useToggleEmailAlertStatusMutation,
    useToggleWhatsappAlertStatusMutation,
    useToggleAlertStatusMutation,
    util: { resetApiState: resetAlertApiState },
} = alertStoreAPI;
