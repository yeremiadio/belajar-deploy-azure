import { BackendResponse } from '@/types/api';
import {
  IDeviceGroup,
  IDeviceGroupWithColor,
  IGroupDeviceArr,
  IGroupObj,
} from '@/types/api/management/device';

import { convertToEncodedURL } from '@/utils/functions/convertToEncodedURL';

import { deviceStoreAPI } from '@/stores/managementStore/deviceStore/deviceStoreApi';

export const groupStoreAPI = deviceStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDeviceGroups: builder.query<
        IDeviceGroupWithColor[],
        Partial<IGroupObj>
      >({
        query: (obj) => {
          let params = '';
          if (obj) {
            params = convertToEncodedURL(obj);
            params = params.length ? '?' + params : '';
          }
          let url = '/group/find' + params;
          return {
            url,
            method: 'GET',
          };
        },

        transformResponse: (response: BackendResponse<IDeviceGroup[]>) =>
          response.data.map((val, idx) => {
            const groupColors = ['#7B61FF', '#3699FF', '#20C997', '#8997A9'];

            return {
              ...val,
              groupColor: groupColors[idx % 4],
            };
          }),
        providesTags: ['GroupList'],
      }),

      createGroupDevice: builder.mutation<
        BackendResponse<{ id: number }>,
        { name: string }
      >({
        query: (obj) => {
          return {
            url: '/group/create',
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['GroupList'],
      }),

      updateGroup: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * Group Id
           */
          id: number;
          data: Pick<IDeviceGroup, 'name' | 'companyId'>;
        }
      >({
        query: ({ data, id }) => {
          return {
            url: `/group/update/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['GroupList', 'DeviceList'],
      }),

      deleteGroup: builder.mutation<
        BackendResponse<string>,
        {
          /**
           * Group Id
           */
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `/group/delete/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['GroupList', 'DeviceList'],
      }),

      manageDevicesToGroups: builder.mutation<
        BackendResponse<string[]>,
        IGroupDeviceArr
      >({
        query: (obj) => {
          let url = '/group/manage';
          return {
            url,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['GroupList', 'DeviceList'],
      }),
      addDevicesToGroupsArray: builder.mutation<
        BackendResponse<string[]>,
        IGroupDeviceArr
      >({
        query: (obj) => {
          let url = '/group/adddevicearray';
          return {
            url,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['GroupList', 'DeviceList'],
      }),

      removeDevicesToGroups: builder.mutation<
        BackendResponse<string[]>,
        IGroupDeviceArr
      >({
        query: (obj) => {
          let url = '/group/removedevicearray';
          return {
            url,
            method: 'POST',
            body: obj,
          };
        },
        invalidatesTags: ['GroupList', 'DeviceList'],
      }),
    };
  },
});

export const {
  useGetDeviceGroupsQuery,
  useManageDevicesToGroupsMutation,
  useAddDevicesToGroupsArrayMutation,
  useRemoveDevicesToGroupsMutation,
  useCreateGroupDeviceMutation,
  util: { resetApiState: resetDeviceGroupStoreAPI },
} = groupStoreAPI;
