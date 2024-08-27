import * as yup from 'yup';
import purchaseOrderValidationSchema from '@/utils/validations/order/orderValidationSchema';

import { IInventory } from '@/types/api/management/inventory';
import { TOrderDelivery } from './orderDelivery';
import { TOrderFile } from './orderDocument';

export enum OrderStatusEnum {
  QUOTATION = 'QUOTATION',
  IN_CONFIRMATION = 'IN_CONFIRMATION',
  CONFIRMED = 'CONFIRM',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DELIVERY_READY = 'DELIVERY_READY',
  COMPLETE = 'COMPLETE',
}

export enum PaymentTermsEnum {
  COD = 'COD',
  TRANSFER = 'TRANSFER',
}

export type TInventoryItem<T = {}> = {
  id: number;
  quantity: number;
  inventory: T;
};

export type TOrder = {
  id: number;
  orderId: string;
  vendorId: number;
  address?: string;
  groupInventoryId: number;
  deliveryDate: Date;
  termsId: PaymentTermsEnum;
  status: OrderStatusEnum;
  inventoryList: TInventoryItem<IInventory>[];
  tax: number;
  discount: number;
  total: number | null;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  orderDeliveries: TOrderDelivery[];
  orderFiles: TOrderFile[];
};

export type TOrderSlice = Omit<TOrder, 'id' | 'orderId' | 'total'>;

export type TPurchaseOrderRequestFormObject = yup.InferType<
  typeof purchaseOrderValidationSchema
>;
