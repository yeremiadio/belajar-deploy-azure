import {
    BackendResponse,
    IBackendDataPageShape,
    TBackendPaginationRequestObject,
    TPaginationResponse,
} from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import { IBindDeviceMachineFormObject, IBindMachineRecipeEditObject, IBindMachineRecipeObject, IMachine, IMachineFormObject, IMachineGroup, IUpdateMachineObject } from '@/types/api/management/machine';

const ENDPOINT_URL = '/machines';
const ENDPOINT_URL_MACHINE_GROUPS = '/machine-groups';

export const machineStoreAPI = mainStoreAPI.injectEndpoints({
    endpoints: (builder) => {
        return {
            getMachine: builder.query<
                TPaginationResponse<IMachine[]>,
                TBackendPaginationRequestObject<Partial<IMachine> & {
                    isPaginated?: boolean;
                }>
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL}`,
                        method: 'GET',
                        params: { ...obj },
                    };
                },
                transformResponse: (
                    response: IBackendDataPageShape<IMachine[]>,
                ) => response.data,
                providesTags: ['machineList'],
            }),
            getmachineGroupList: builder.query<
                IMachineGroup[],
                Partial<IMachineGroup & {
                    isPaginated?: boolean;
                }>
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL_MACHINE_GROUPS}`,
                        method: 'GET',
                        params: { ...obj },
                    };
                },
                transformResponse: (
                    response: BackendResponse<IMachineGroup[]>,
                ) => response.data,
                providesTags: ['machineGroupList'],
            }),
            getmachineById: builder.query<
                IMachine,
                Partial<IMachine> & { recipeId?: number }
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL}/${obj.id}`,
                        method: 'GET',
                        params: {
                            ...obj
                        }
                    };
                },
                transformResponse: (
                    response: BackendResponse<IMachine>,
                ) => response.data,
                providesTags: ['machine'],
            }),
            createMachine: builder.mutation<
                BackendResponse<object>,
                Partial<IMachineFormObject>
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL}`,
                        body: obj,
                        method: 'POST',
                    };
                },
                invalidatesTags: ['machineList'],
            }),
            createMachineGroup: builder.mutation<
                BackendResponse<object>,
                Pick<IMachineGroup, 'name' | 'isShow'> & { id?: number; }
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL_MACHINE_GROUPS}`,
                        body: obj,
                        method: 'POST',
                    };
                },
                invalidatesTags: ['machineGroupList'],
            }),
            createMachineGroupBulk: builder.mutation<
                BackendResponse<object>,
                Array<Pick<IMachineGroup, 'name' | 'isShow'> & { id?: number; }>
            >({
                query: (obj) => {
                    return {
                        url: `${ENDPOINT_URL_MACHINE_GROUPS}/bulk`,
                        body: obj,
                        method: 'POST',
                    };
                },
                invalidatesTags: ['machineGroupList', 'machineList'],
            }),
            updateMachine: builder.mutation<
                BackendResponse<object>,
                Partial<IMachineFormObject>
            >({
                query: ({ id, ...rest }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}`,
                        body: rest,
                        method: 'PATCH',
                    };
                },
                invalidatesTags: ['machineList'],
            }),
            bindMachineRecipes: builder.mutation<
                BackendResponse<object>,
                Partial<IBindMachineRecipeObject>
            >({
                query: ({ id, data }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}/bind-recipes`,
                        body: data,
                        method: 'POST',
                    };
                },
                invalidatesTags: ['machineList', 'machineGroupList'],
            }),
            bindDeviceMachine: builder.mutation<
            BackendResponse<object>,
            IBindDeviceMachineFormObject & { id?: number; }
            >({
            query: ({ id, ...rest }) => {
                return {
                    url: `${ENDPOINT_URL}/${id}/bind-device`,
                    body: rest,
                    method: 'POST',
                };
            },
            invalidatesTags: ['machineList'],
            }),
            editBindMachineRecipe: builder.mutation<
                BackendResponse<object>,
                Partial<IBindMachineRecipeEditObject>
            >({
                query: ({ id, bindRecipeId, data }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}/bind-recipes/${bindRecipeId}`,
                        body: data,
                        method: 'PATCH',
                    };
                },
                invalidatesTags: ['machineList', 'machineGroupList'],
            }),
            updateMachineGroup: builder.mutation<
                BackendResponse<object>,
                Partial<Pick<IMachineFormObject, 'name' | 'id'>>
            >({
                query: ({ id, ...rest }) => {
                    return {
                        url: `${ENDPOINT_URL_MACHINE_GROUPS}/${id}`,
                        body: rest,
                        method: 'PATCH',
                    };
                },
                invalidatesTags: ['machineGroupList'],
            }),
            updatemachineGroupList: builder.mutation<
                BackendResponse<object>,
                Partial<IUpdateMachineObject>
            >({
                query: ({ ...rest }) => {
                    return {
                        url: `${ENDPOINT_URL}/groups`,
                        body: rest,
                        method: 'PATCH',
                    };
                },
                invalidatesTags: ['machineList', 'machineGroupList'],
            }),
            deletemachineGroupList: builder.mutation<
                BackendResponse<object>,
                Partial<IUpdateMachineObject>
            >({
                query: ({ ...rest }) => {
                    return {
                        url: `${ENDPOINT_URL}/groups`,
                        body: rest,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['machineList', 'machineGroupList'],
            }),
            deleteMachine: builder.mutation<
                BackendResponse<string>,
                {
                    id: number;
                }
            >({
                query: ({ id }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['machineList'],
            }),
            deleteMachineGroup: builder.mutation<
                BackendResponse<string>,
                {
                    id: number;
                }
            >({
                query: ({ id }) => {
                    return {
                        url: `${ENDPOINT_URL_MACHINE_GROUPS}/${id}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['machineGroupList', 'machineList'],
            }),
            deleteBindRecipeMachine: builder.mutation<
                BackendResponse<string>,
                {
                    id: number;
                    machineRecipeId: number;
                }
            >({
                query: ({ id, machineRecipeId }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}/bind-recipes/${machineRecipeId}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['machineList'],
            }),
            deleteBindDeviceMachine: builder.mutation<
                BackendResponse<string>,
                {
                    id: number;
                }
            >({
                query: ({ id }) => {
                    return {
                        url: `${ENDPOINT_URL}/${id}/bind-device`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['machineList'],
            }),
        };
    },
});

export const {
    useGetMachineQuery,
    useGetmachineByIdQuery,
    useGetmachineGroupListQuery,
    useCreateMachineGroupMutation,
    useCreateMachineGroupBulkMutation,
    useCreateMachineMutation,
    useBindMachineRecipesMutation,
    useBindDeviceMachineMutation,
    useEditBindMachineRecipeMutation,
    useUpdateMachineGroupMutation,
    useUpdatemachineGroupListMutation,
    useDeletemachineGroupListMutation,
    useUpdateMachineMutation,
    useDeleteMachineGroupMutation,
    useDeleteMachineMutation,
    useDeleteBindRecipeMachineMutation,
    useDeleteBindDeviceMachineMutation,
    util: { resetApiState: resetMachineStoreAPI },
} = machineStoreAPI;
