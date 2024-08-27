import * as yup from 'yup';

import { IInventory } from '@/types/api/management/inventory';
import { IMachine } from '@/types/api/management/machine';
import {
  IRecipeIngredientsObj,
  IRecipeObjResponse,
} from '@/types/api/management/recipe';
import { Nullable } from '@/types/global';

import oeeThresholdValidationSchema from '@/utils/validations/management/workOrder/oeeValidationSchema';
import workOrderValidationSchema from '@/utils/validations/management/workOrder/workOrderValidationSchema';

export interface IOeeObjResponse {}

export interface IReasonDownTimeObj {
  reason: string;
  hours: number;
}

export interface IWorkOrderRequest {
  name: string;
  machineId: number;
  recipeId: number;
  targetoutput: number;
  targetrunning: number;
  downtime: number;
  startPlan: Date;
  endPlan: Date;
  //query param for get
  isActive?: boolean;
}

export interface IWorkOrderQueryParameter extends IWorkOrderRequest {
  isPaginated?: boolean;
  startDateAt: Date | string;
  endDateAt: Date | string;
  search: string;
  /**
   * @description if actual true then use startActual, else use startPlan if its plan
   */
  isActual?: boolean;
}

export enum WorkOrderStatusEnum {
  RUNNING = 'running',
  PAUSED = 'paused',
  PENDING = 'pending',
  COMPLETE = 'complete',
}

export interface IWorkOrderResponse extends IWorkOrderRequest {
  id: number;
  shiftId: number | null;
  // shift?: AShift | null;
  name: string;
  companyId: number;
  // product: AProductShort;
  actualoutput: number;
  actualrunning: number;
  quantityng: number;
  status: WorkOrderStatusEnum;
  starttime: string;
  closedtime: string;
  createdAt: string;
  pauseReason: string[];
  stopTime: number;
  loadingTime: number;
  idealCycleTime: number | null;
  cycleTime: number | null;
  reasonTime: IReasonDownTimeObj[];
  availability: number;
  performance: number;
  quality: number | null;
  oee: number;
  machine: IMachine;
  recipe: IRecipeObjResponse;
  inventory: Nullable<IInventory>;
  startActual: Date;
  endActual: Date;
  recipeDetails?: Nullable<IRecipeDetail>;
}

export interface IRecipeDetail {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  output: number;
  inventoryId: number;
  companyId: number;
  recipeIngredients: Array<IRecipeIngredientsObj>;
}

export type TOeeRequestFormObject = yup.InferType<
  typeof oeeThresholdValidationSchema
>;

export type TWorkOrderRequestFormObject = yup.InferType<
  typeof workOrderValidationSchema
>;

export type TWorkOrderProductionLog = {
  createdAt: string;
  productionOutput: number;
  notGoodProductionOutput: number;
};
