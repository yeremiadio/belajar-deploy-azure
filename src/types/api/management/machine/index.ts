import * as yup from 'yup';

import { ILocation } from '@/types/api/management/location';
import { IDeviceBasic } from '@/types/api/management/device';
import { IGateway } from '@/types/api/management/gateway';
import { Nullable } from '@/types/global';

import bindDeviceMachineValidationSchema from '@/utils/validations/management/machine/bindMachineValidationSchema';
import bindRecipesValidationSchema from '@/utils/validations/management/machine/bindRecipesValidationSchema';
import machineValidationSchema from '@/utils/validations/management/machine/machineValidationSchema';
import manageMachineGroupValidationSchema from '@/utils/validations/management/machine/manageMachineGroupValidationSchema';
import newGroupMachineValidationSchema from '@/utils/validations/management/machine/newGroupMachineValidationSchema';



export type TMachineRequestFormObject = yup.InferType<
  typeof machineValidationSchema
>;
export type TManageGroupMachineRequestFormObject = yup.InferType<
  typeof manageMachineGroupValidationSchema
>;
export type TNewGroupMachineRequestFormObject = yup.InferType<
  typeof newGroupMachineValidationSchema
>;
export type TBindRecipeMachineRequestFormObject = yup.InferType<
  typeof bindRecipesValidationSchema
>;
export type TBindDeviceMachineRequestFormObject = yup.InferType<
  typeof bindDeviceMachineValidationSchema
>;

export interface IMachineGroup {
  id: number;
  name: string;
  isShow?: boolean;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMachineFormObject {
  code?: string;
  id?: number;
  name: string;
  locationId: number;
}
export interface IBindMachineRecipeObject {
  id: number;
  data: Array<{
    recipeId: Nullable<number>;
    cycleRate: number;
  }>
}
export interface IEditBindMachineRecipeObject {
  id: number;
  data: {
    recipeId: Nullable<number>;
    cycleRate: number;
  }
}

export interface IBindMachineRecipeEditObject extends IEditBindMachineRecipeObject {
  bindRecipeId: number;
}

export interface IUpdateMachineObject {
  machineIds: Nullable<number[]>;
  machineGroupIds: Nullable<number[]>;
}

export interface IMachineRecipe {
  id: number;
  createdAt: string;
  updatedAt: string;
  cycleRate: number;
  machineId: number;
  recipeId: number;
  recipe: Nullable<{
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    output: number;
    inventoryId: number;
    companyId: number;
  }>;
  machine: IMachine;
}

export interface IMachine {
  id: number;
  code: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  location: ILocation;
  device: IDeviceBasic;
  gateway: IGateway;
  machineGroups: IMachineGroup[];
  machineRecipes: IMachineRecipe[];
}

export interface IMachineParameterObject extends IMachine {
  isPaginated?: boolean;
}

export interface IMachineParameterObject extends IMachine {
  isPaginated?: boolean;
}

export interface IBindDeviceMachineFormObject {
  deviceId: number | null;
  gatewayId: number;
}

/**
 * {
  "id": 2,
  "code": "test-123",
  "name": "test",
  "createdAt": "2024-05-03T02:19:55.932Z",
  "updatedAt": "2024-05-03T02:24:08.290Z",
  "location": {
    "id": 240,
    "name": "location test",
    "companyId": 128,
    "code": null,
    "status": 1,
    "coordinate": {},
    "description": null,
    "created_at": "2024-04-25T17:00:00.000Z",
    "updated_at": "2024-04-25T17:00:00.000Z"
  },
  "machineGroups": [
    {
      "id": 4,
      "name": "Group B",
      "companyId": -1,
      "isShow": true,
      "createdAt": "2024-05-02T08:28:31.955Z",
      "updatedAt": "2024-05-02T08:28:31.955Z",
      "deletedAt": null
    },
    {
      "id": 5,
      "name": "Group Dio",
      "companyId": -1,
      "isShow": true,
      "createdAt": "2024-05-02T08:45:26.851Z",
      "updatedAt": "2024-05-02T08:45:26.851Z",
      "deletedAt": null
    },
    {
      "id": 6,
      "name": "test 1",
      "companyId": -1,
      "isShow": true,
      "createdAt": "2024-05-03T02:39:51.660Z",
      "updatedAt": "2024-05-03T02:39:51.660Z",
      "deletedAt": null
    }
  ],
  "machineRecipes": [
    {
      "id": 2,
      "createdAt": "2024-05-06T02:03:28.206Z",
      "updatedAt": "2024-05-06T02:03:28.206Z",
      "cycleRate": 123,
      "machineId": 2,
      "recipeId": 5,
      "recipe": {
        "id": 5,
        "createdAt": "2024-05-03T07:06:54.886Z",
        "updatedAt": "2024-05-03T07:06:54.886Z",
        "name": "Amoniac",
        "output": 1,
        "inventoryId": 6,
        "companyId": -1
      }
    }
  ]
}
 */