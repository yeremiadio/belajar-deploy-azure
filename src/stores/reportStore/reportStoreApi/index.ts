import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';
import {
  IBackendDataPageShape,
  TPaginationRequestObject,
  TPaginationResponse,
} from '@/types/api';
import { TReportLogResponse, TReportRequest } from '@/types/api/report';

export const reportStoreApi = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReportLog: builder.query<
      TPaginationResponse<TReportLogResponse[]>,
      TReportRequest & TPaginationRequestObject & { search: string }
    >({
      query: (data) => {
        const params = new URLSearchParams();

        if (data.deviceIds) {
          data.deviceIds.forEach((id) =>
            params.append('deviceIds', id.toString()),
          );
        }
        if (data.sensorTypeIds) {
          data.sensorTypeIds.forEach((id) =>
            params.append('sensorTypeIds', id.toString()),
          );
        }
        if (data.threatLevels) {
          data.threatLevels.forEach((level) =>
            params.append('threatLevels', level.toString()),
          );
        }
        if (data.isAlertConfirmed !== undefined) {
          params.append('isAlertConfirmed', data.isAlertConfirmed.toString());
        }

        params.append('date', data.date);
        params.append('page', data.page ? data.page.toString() : '1');
        params.append('take', data.take ? data.take.toString() : '10');
        params.append('search', data.search);

        return {
          url: `/report/${data.moduleId}/LOG?${params.toString()}`,
          method: 'GET',
        };
      },
      transformResponse: (
        response: IBackendDataPageShape<TReportLogResponse[]>,
      ) => response.data,
      providesTags: ['reportLogList'],
    }),
  }),
});

export const { useGetReportLogQuery } = reportStoreApi;
