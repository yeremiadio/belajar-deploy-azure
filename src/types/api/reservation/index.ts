import * as yup from 'yup';
import { Nullable } from '@/types/global';
import reservationActivityValidationSchema from '@/utils/validations/reservation/reservationActivityValidationSchema';
import reservationDriverValidationSchema from '@/utils/validations/reservation/reservationDriverValidationSchema';
import reservationVehicleValidationSchema from '@/utils/validations/reservation/reservationVehicleValidationSchema';
import reservationVendorValidationSchema from '@/utils/validations/reservation/reservationVendorValidationSchema';
import { IInventory } from '@/types/api/management/inventory';

export type TReservationActivityStatus = 'ACTIVE' | 'INACTIVE';
export enum ReservationStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum ReservationActivityStatusEnum {
  SCHEDULED = 'SCHEDULED',
  CHECKEDIN = 'CHECKED_IN',
  WAITING = 'WAITING',
  DOCKING = 'DOCKING',
  CHECKEDOUT = 'CHECKED_OUT',
}

export enum ReservationCategoryEnum {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export interface IReservationWorkOrderObject {
  id: string;
  amount: number;
  unit: string;
  item: string;
}

export type TReservationActivityFormObject = yup.InferType<
  typeof reservationActivityValidationSchema
>;

export type TReservationVendorFormObject = yup.InferType<
  typeof reservationVendorValidationSchema
>;
export type TReservationDriverFormObject = yup.InferType<
  typeof reservationDriverValidationSchema
>;
export type TReservationVehicleFormObject = yup.InferType<
  typeof reservationVehicleValidationSchema
>;

export type TLicensePlate = {
  id: number;
  plate: string;
  class: string;
  merk: string;
  series: string;
  annotation: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
};

export type TVendor = {
  id: number;
  name: string;
  address: string;
  email: string;
  annotation: string;
  isEmailVerified: boolean;
  lastVerifyEmailSent: Nullable<string>
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
};

export type TDriver = {
  id: number;
  name: string;
  email: Nullable<string>;
  phoneNumber: Nullable<string>;
  identity: Nullable<string>;
  identityNumber: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
};

export type TReservationItem = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  actualAmount: number;
  unit: string;
  reservationId: number;
  inventoryId: number;
  inventory: IInventory;
};

export type TTag = {
  id: number;
  name: string;
  companyId: number;
};

export type TDock = {
  id: number;
  name: string;
  code: number;
  gatewayId: number;
  status: number;
  description: string;
  devicetypeId: number;
  companyId: number;
  machineId: number;
  alert_status: string;
  location: {
    id: number;
    name: string;
    companyId: number;
    code: Nullable<string>;
    status: number;
    coordinate: any; // belum tau isinya apa
    description: Nullable<string>;
    created_at: string;
    updated_at: string;
  };
  created_at: Date;
  updated_at: Date;
};

export type TReservationObject = {
  id: number;
  status: string;
  documentId: string;
  dockNumber: string;
  expectedCheckInDate: Date;
  actualCheckInDate: Date;
  waitingDate: Date;
  dockingDate: Date;
  checkOutDate: Date;
  createdAt: Date;
  updatedAt: Date;
  vendor: TVendor;
  driver: TDriver;
  licensePlate: TLicensePlate;
  reservationItems: TReservationItem[];
  tag: TTag;
  dock: TDock;
  isPriority?: boolean; // Request to BE
  category?: string; // Request to BE (INBOUND/OUTBOUND)
  orderDelivery: {
    annotation: string;
    createdAt: Date;
    deliveryId: string;
    expectedDeliveryDate: Date;
    id: number;
    orderDeliveryItems: {
      id: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
      orderDeliveryId: number;
      inventoryId: number;
      amount: number;
    }[];
    status: string | null;
    updatedAt: Date;
  };
  fileUrls?: string[];
};

export interface IReservationQueryParameter {
  isPaginated: boolean;
  address: string;
  phoneNumber: string;
  search: string;
  isAvailable?: boolean;
}
