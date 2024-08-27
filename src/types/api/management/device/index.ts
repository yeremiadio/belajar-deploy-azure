import * as yup from 'yup';

import { ILocation } from '@/types/api/management/location';
import { ISensor } from '@/types/api/management/sensor';
import { IUserBindData } from '@/types/api/user/index';
import { BasicSelectOpt } from '@/types/global';
import bindAccountDeviceValidationSchema from '@/utils/validations/management/device/bindAccountDeviceValidationSchema';
import deviceValidationSchema from '@/utils/validations/management/device/deviceValidationSchema';

export interface IDeviceObj {
  name: string;
  gatewayId?: number;
  status?: number;
  devicetypeId?: number;
  description?: string;
  companyId?: number;
  locationId?: number;
}

export interface IDeviceTypeShort {
  id: number;
  name: string;
}

export interface IDeviceCompanyShort {
  id: number;
  name: string;
}

export interface IDeviceBasic {
  id: number;
  name: string;
  code: number;
  gatewayId: number;
  devicetypeId: number;
  machineId: number | null;
  status: number;
  description: string;
  companyId: number;
  devicetype: IDeviceTypeShort;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  imgmap: string | null;
  company: IDeviceCompanyShort;
  location: ILocation;
}
export interface IDeviceSensorRelation {
  id: number;
  deviceId: number;
  sensorId: number;
  companyId: number;
  device: IDeviceBasic;
  sensor: ISensor;
}

export interface IDeviceDetailWithSublocation extends IDeviceBasic {
  gateway: {
    id: number;
    name: string;
    sublocation2Id: number;
    sublocation2: {
      id: number;
      name: string;
      sublocation1Id: number;
      sublocation1: {
        id: number;
        name: string;
        locationId: number;
        location: {
          id: number;
          name: string;
          // Only in version-header 2
          company: {
            name: string;
          };
        };
      };
      company: {
        name: string;
      };
    };
  };
  group: {
    id: number;
    name: string;
    companyId: number;
  }[];
  sensors: ISensor[];
  // machine: IMachineDetailShort;

  // Only in version-header 2
  devicesensorrelation: IDeviceSensorRelation[];
}

export interface IDeviceDetailSublocationWithMachine
  extends IDeviceDetailWithSublocation {
  // machine: IMachineDetailShort;
}
export interface IDeviceDetailSublocationMachineWithMap
  extends IDeviceDetailSublocationWithMachine {
  imgmap: null | string;
  users: IUserBindData[];
}

export interface ADeviceOpt
  extends BasicSelectOpt<number>,
    IDeviceDetailWithSublocation {}

export interface ICreateDeviceObj {
  name: string;
  gatewayId: string;
  status: number;
  description: string;
  devicetypeId: number;
  machineId?: number;
  companyId?: number;
  moduleId?: number;
}

export interface IGetDeviceObj extends Partial<ICreateDeviceObj> {
  id?: number;
}

export interface IBindAccountDeviceRequestFormObject
  extends Partial<ICreateDeviceObj> {
  userIds: (number | undefined)[];
}

/**
 * Device sensor relation
 */
export interface IGetDeviceSensorRelationObj {
  id?: number;
  deviceId?: number;
  sensorId?: number;
  sensortypeId?: number;
}

/**
 * Device group
 */
export interface IGroupDeviceArr {
  /**
   * Array of device ids
   */
  deviceIds: number[];
  /**
   * Array of group ids
   */
  groupIds: number[];
}

export interface IGroupObj {
  id: number;
  name: string;
}

export interface IDeviceGroup extends IGroupObj {
  id: number;
  name: string;
  companyId: number;
  deviceId: number[];
}

export interface IDeviceGroupWithColor extends IDeviceGroup {
  groupColor: string;
}

//Form
export type TDeviceRequestFormObject = yup.InferType<
  typeof deviceValidationSchema
>;

export type TBindAccountDeviceRequestFormObject = yup.InferType<
  typeof bindAccountDeviceValidationSchema
>;

export type TDeviceAlertLogsRequestObject = {
  id: number;
  page?: number;
  take?: number;
  isPaginated?: boolean;
  search?: string;
  startDateAt?: string;
  endDateAt?: string;
  versionHeader?: string;
};
