export type BackendResponse<T> = {
  status: string;
  data: T;
};

export type BackendErrorResponse = {
  status: string;
  data: {
    statusCode: number;
    message: string;
    requestUrl: string;
  };
};

export type TPaginationResponse<T> = {
  entities: T;
  meta: Meta;
};

export interface IBackendDataPageShape<D> {
  status: string;
  data: TPaginationResponse<D>;
}

export type TPaginationRequestObject = {
  page?: number;
  take?: number;
};

export type TBackendPaginationRequestObject<D extends object> = D &
  TPaginationRequestObject;

export type Meta = {
  page: number;
  offset: number;
  itemCount: number;
  pageCount: number;
};

export interface ErrorMessageBackendDataShape {
  status: number;
  data: {
    status: string;
    message: any;
  };
}

export enum DateFilterChartEnum {
  Today = 'today',
  Month = 'month',
  Year = 'year',
}

export enum LOVTypeEnum {
  ORDER_STATUS = 'ORDER_STATUS',
  ORDER_TERMS = 'ORDER_TERMS',
  LICENSE_PLATE_TYPE = 'LICENSE_PLATE_TYPE',
  DRIVER_IDENTITY_TYPE = 'DRIVER_IDENTITY_TYPE',
}

export type TChartRanges = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
