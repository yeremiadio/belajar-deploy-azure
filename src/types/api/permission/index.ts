import { Nullable } from '@/types/global';
import * as yup from 'yup';
import { IUserGateway } from '../user';

export interface IPermissions {
  id: number;
  name: string;
}

export interface IPermissionWithBoolean {
  [key: string]: boolean;
}

export interface IMenuPermissions {
  dashboard: IPermissions[];
  management: IPermissions[];
  other: IPermissions[];
  inventory: IPermissions[];
  reservation: IPermissions[];
}
export interface IDashboardPermission extends IPermissionWithBoolean { }
export interface IManagementPermission extends IPermissionWithBoolean { }
export interface IOtherPermission extends IPermissionWithBoolean { }
export interface IInventoryPermission extends IPermissionWithBoolean { }
export interface IReservationPermission extends IPermissionWithBoolean { }

export interface IPermissionList {
  dashboard: IDashboardPermission;
  management: IManagementPermission;
  other: IOtherPermission;
  inventory: IInventoryPermission;
  reservation: IReservationPermission;
}

export interface IGetPermissionList {
  dashboard: (keyof IDashboardPermission)[];
  other: (keyof IOtherPermission)[];
  management: (keyof IManagementPermission)[];
  inventory: (keyof IInventoryPermission)[];
  reservation: (keyof IReservationPermission)[];
}

export interface IPermissionData {
  id: number;
  userId: Nullable<number>;
  permissions: IMenuPermissions;
}

export interface IPermissionReqObj {
  permissionModuleIds: number[];
  permissionModuleId: number;
}
export interface IUserPermissions extends Omit<IPermissionData, 'permissions'> {
  permissions: IGetPermissionList;
}

export const permissionValidationSchema = yup.object().shape({
  userId: yup.number().required('Name is required').nullable(),
  usertypeId: yup.number().optional().nullable(),
  fullname: yup.string().optional(),
});

export type TPermissionRequestFormObject = yup.InferType<
  typeof permissionValidationSchema
>;

// V2
export type TUserPermission = {
  permissions: {
    [key: string]: TUserPermissionItem[];
  };
};

export type TUserPermissionItem = {
  id: number;
  name: string;
  gateway: IUserGateway[];
};
