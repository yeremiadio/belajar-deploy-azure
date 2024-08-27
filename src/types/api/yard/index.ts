import { Nullable } from '@/types/global';

export type TYardActivityStatus = 'ACTIVE' | 'INACTIVE';
export enum EYardStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EYardActivityStatusEnum {
  SCHEDULED = 'SCHEDULED',
  CHECKIN = 'CHECKED_IN',
  WAITING = 'WAITING',
  DOCKING = 'DOCKING',
  CHECKOUT = 'CHECKED_OUT',
}

export type TWarehouse = {
  code: Nullable<any>; // belum tahu tipe datanya
  companyId: number;
  coordinate: {};
  created_at: string;
  created_by: number;
  deleted_at: Nullable<string>;
  description: Nullable<string>;
  id: number;
  name: string;
  status: number;
  updated_at: string;
  updated_by: Nullable<number>;
};
export type TDock = {
  id: number;
  name: string;
  code: number;
  gatewayId: number;
  status: number;
  description: string | null;
  devicetypeId: number;
  companyId: number;
  machineId: number | null;
  alert_status: string;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  deleted_at: string | null;
  location: {
    id: number;
    name: string;
    companyId: number;
    code: string | null;
    status: string | null;
    coordinate: string | null;
    description: string | null;
    created_by: number | null;
    created_at: string;
    updated_by: number | null;
    updated_at: string;
    deleted_at: string | null;
  };
};

export type TGateway = {
  id: number;
  apikey: string;
  name: string;
  code: string | null;
  sublocation2Id: number | null;
  status: number | null;
  companyId: number;
  moduleId: number;
  locationId: number;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
};

export type TYard = {
  gateway: TGateway;
  docks: TDock[];
  warehouses: TWarehouse[];
  restrictedDocks: TDock[];
};
