import * as yup from 'yup';
import gatewayValidationSchema from '@/utils/validations/management/gateway/gatewayValidationSchema';
import { Nullable } from '../../user';

export interface ICoordinate {
  lat: number;
  lng: number;
}
/**
 * @todo REFACTOR THIS SOON
 */
export interface ILocation {
  id: number;
  name: string;
  companyId: number;
  code: string | null;
  status: number;
  coordinate: ICoordinate;
  description: string | null;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
}

export interface ISubLocation1 {
  id: number;
  name: string;
  companyId: number;
  locationId: number;
  location: ILocation;
}

export interface ISubLocation2 {
  id: number;
  name: string;
  companyId: number;
  sublocation1Id: number;
  sublocation1: ISubLocation1;
}

export interface IGatewayLocation {
  id: number;
  name: string;
  companyId: number;
  code: Nullable<string>;
  status: number;
  coordinate: Nullable<ICoordinate>;
  description: Nullable<string>;
  created_by: Nullable<number>;
  created_at: string;
  updated_by: Nullable<number>;
  updated_at: string;
}

export interface IGatewayModule {
  id: number;
  name: string;
  permissions: {
    other: string[];
    dashboard: string[];
    management: string[];
  };
}

export interface IGatewayCompany {
  id: number;
  name: string;
  description: Nullable<string>;
  created_at: string;
  updated_at: string;
}

export interface IGateway {
  id: number;
  apikey: string;
  name: string;
  code: Nullable<string>;
  sublocation2Id: Nullable<number>;
  status: number;
  companyId: number;
  moduleId: number;
  locationId: number;
  created_by: Nullable<number>;
  created_at: string;
  updated_by: Nullable<number>;
  updated_at: string;
  sublocation2: Nullable<ISubLocation2>;
  location: IGatewayLocation;
  module: IGatewayModule;
  company: IGatewayCompany;
}

export interface IGatewayRequestObject {
  id?: number;
  name?: string;
  code?: string;
  companyId?: number;
  status?: number;
  moduleId?: number;
  locationId: number;
  sublocation1Id?: number;
  sublocation2Id?: number;
  isPaginated?: boolean;
}

export type TGatewayRequestFormObject = yup.InferType<
  typeof gatewayValidationSchema
>;
