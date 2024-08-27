import * as yup from 'yup';

import { ICompany } from '@/types/api/management/company';
import { IShift } from '@/types/api/management/shift';
import { Nullable } from '@/types/global';

import addPinpointValidationSchema from '@/utils/validations/management/location/addPinpointValidationSchema';
import locationValidationSchema from '@/utils/validations/management/location/locationValidationSchema';

import { ICoordinate } from '../gateway';

export interface ILocationObj {
  id?: number;
  name: string;
  companyId: number;
  status: number;
  search?: string;
  isPaginated?: boolean;
}

export interface ILocationWithShift {
  name: string;
  shiftIds: number[];
}

export interface ILocation extends ILocationObj {
  id: number;
  code: string | null;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  company: ICompany;
  coordinate: ICoordinate;
  description: string | null;
  shifts: IShift[];
  sublocation1: ISubLocationObj[];
}

/**
 * Location in Gateway
 */
export interface ILocationShort {
  id: number;
  code: Nullable<string>;
  created_by: Nullable<number>;
  created_at: string;
  updated_by: Nullable<number>;
  updated_at: string;
  name: string;
  companyId: number;
  status: number;
  description: string;
}

export interface ISubLocationObjs {
  name: string;
  sub2?: string[];
  locationId?: number;
}

export interface ISubLocation2Obj {
  id: number;
  name: string;
  companyId: number;
  sublocation1Id: number;
}
export interface ISubLocationObj {
  id: number;
  name: string;
  companyId: number;
  locationId: number;
  sublocation2: ISubLocation2Obj[];
}

export interface ISubLocation1Obj {
  id: number;
  name: string;
  companyId: number;
  locationId: number;
  location: ILocationShort;
}

export interface ILocationWithSublocation2 {
  id: number;
  name: string;
  companyId: number;
  sublocation1Id: number;
  sublocation1: {
    id: number;
    name: string;
    companyId: number;
    locationId: number;
    location: ILocationShort;
  };
}

export type TLocationRequestFormObject = yup.InferType<
  typeof locationValidationSchema
>;

export interface ILocationSubmitFormObject {
  lat?: number;
  lng?: number;
  shiftIds?: (number | undefined)[];
  name: string;
  companyId?: number;
}

export type TAddPinpointLocationRequestFormObject = yup.InferType<
  typeof addPinpointValidationSchema
>;

export interface ALocationWOCompany extends Omit<ILocation, "company"> { }

