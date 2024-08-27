import { Nullable } from '@/types/global';
import inventoryValidationSchema from '@/utils/validations/management/inventory/inventoryValidationSchema';
import * as yup from 'yup';
import { ICompany } from '../company';
import manageInventoryGroupValidationSchema from '@/utils/validations/management/inventory/manageInventoryGroupValidationSchema';
import newGroupInventoryValidationSchema from '@/utils/validations/management/inventory/newGroupInventoryValidationSchema';
import inventoryGroupPriceSchema from '@/utils/validations/management/inventory/inventoryGroupPriceSchema';

export interface IInventory {
  id: number;
  uniqueId: string;
  name: string;
  type: string;
  unit: string;
  price: number;
  group: IInventoryGroupWithPrice[];
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  companyId: number;
  stock: number;
  company: ICompany;
  isReady?: boolean;
}
export interface IInventoryGroupWithPrice {
  id: number;
  name: string;
  price: number;
  isShow: boolean;
}
export interface IInventoryGroup {
  id: number;
  name: string;
  price?: number;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  deletedAt: Nullable<string>;
}

export interface IAssignInventoryGroupObj {
  inventoryIds: number[];
  groupIds: number[];
}

export interface IInventoryType {
  id: number;
  name: string;
}

export interface IGroupPriceReqObj extends IInventoryGroupWithPrice {
  groupId: number;
}
export interface IGroupPriceObj {
  editedGroup: Partial<IGroupPriceReqObj>[];
}

export interface IInventoryParams {
  search: string;
  groupIds: number[];
  isShow: boolean;
  isPaginated: boolean;
}

export type TInventoryWithAmount = {
  inventory: IInventory;
  quantity: number;
};

export type TInventoryRequestFormObject = yup.InferType<
  typeof inventoryValidationSchema
>;

export type TManageGroupInventoryRequestFormObject = yup.InferType<
  typeof manageInventoryGroupValidationSchema
>;
export type TNewGroupInventoryRequestFormObject = yup.InferType<
  typeof newGroupInventoryValidationSchema
>;
export type TGroupInventoryPriceFormObject = yup.InferType<
  typeof inventoryGroupPriceSchema
>;
