import * as yup from 'yup';
import deliveryOrderValidationSchema from '@/utils/validations/order/deliveryOrderValidationSchema';
import { TReservationObject, TVendor } from '../../reservation';

export enum DeliveryStatusEnum {
  ON_PROCESS = 'ON_PROCESS',
  DELIVERED = 'DELIVERED',
  CONFIRMED = 'CONFIRMED',
  NOT_RECEIVED = 'NOT_RECEIVED',
}

export type TOrderDelivery = {
  id: number;
  deliveryId: string;
  expectedDeliveryDate: string;
  annotation: string;
  inventoryId: number;
  orderId: number;
  amount: number;
  reservationId: null | number;
  status: string;
  reservation: null | TReservationObject;
  createdAt: string;
  updatedAt: string;
  orderDeliveries?: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    orderDeliveryId: number;
    inventoryId: number;
    amount: number;
  }[];
  orderDeliveryItems?: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    orderDeliveryId: number;
    inventoryId: number;
    amount: number;
  }[];
  vendor: TVendor;
};

export type TOrderDeliveryRequestFormObject = yup.InferType<
  typeof deliveryOrderValidationSchema
>;
