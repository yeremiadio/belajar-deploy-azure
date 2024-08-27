import { BasicSelectOpt } from '@/types/global';
import {
  IDashboardPermission,
  IInventoryPermission,
  IManagementPermission,
  IMenuPermissions,
  IOtherPermission,
  IReservationPermission,
} from '@/types/api/permission';

export const DashboardPermissionName: {
  [key in keyof IDashboardPermission]: string;
} = {
  oee: 'OEE',
  energymeteradvanced: 'Energy Meter Advanced',
  energymeter: 'Energy Meter',
  envirobox: 'Envirobox',
  waterlevel: 'Waterlevel',
  employeetracker: 'Employee Tracker',
  forestfire: 'Forest Fire',
  flood: 'Flood',
  smartpole: 'Smart Pole',
  reservation: 'Reservation',
  unitrace: 'Unitrace',
  purchaseorder: 'Purchase Order',
  inventory: 'Inventory',
  yard: "Yard",
  inventrace: "Inventrace",
  aquasense: "Aquasense"
};

export const ManagementPermissionName: {
  [key in keyof IManagementPermission]: string;
} = {
  account: 'Account',
  location: 'Location',
  device: 'Device',
  machine: 'Machine',
  product: 'Product',
  alert: 'Alert',
  shift: 'Shift',
  area: 'Area',
  tag: 'Tag',
  employee: "Employee",
  employeetag: "Employee Tag",
  employeetype: "Employee Type",
  inventory: "Inventory",
  reservation: "Reservation",
  recipe: 'Recipe'
};

export const OtherPermissionName: {
  [key in keyof IOtherPermission]: string;
} = {
  report: 'Report',
};

export const InventoryPermissionName: {
  [key in keyof IInventoryPermission]: string;
} = {
  stock: 'In Out Stock',
  productionplaning: 'Production Planning',
  workorder: 'Work Order'
};
export const ReservationPermissionName: {
  [key in keyof IReservationPermission]: string;
} = {
  list: 'List',
  vendor: 'Vendor',
};
export interface IModule {
  id: number;
  name: string;
  permissions: IMenuPermissions;
}

/**
 * if `true`, the screen could be shown to usertype: officer
 */
export const OfficerAllowedScreen: {
  dashboard: IDashboardPermission;
  management: IManagementPermission;
  other: IOtherPermission;
} = {
  dashboard: {
    energymeter: false,
    envirobox: false,
    oee: false,
    oeelive: false,
    waterlevel: false,
    employeetracker: false,
  },
  management: {
    account: false,
    alert: true,
    device: true,
    location: true,
    machine: true,
    product: true,
    shift: true,
    workorder: true,
    employee: true,
    area: true,
    employeetag: true,
    employeetype: true,
  },
  other: {
    report: true,
  },
};

/**
 * if `true`, the screen could be shown to usertype: operator
 */
export const OperatorAllowedScreen: {
  dashboard: IDashboardPermission;
  management: IManagementPermission;
  other: IOtherPermission;
} = {
  dashboard: {
    energymeter: false,
    envirobox: false,
    oee: false,
    oeelive: true,
    waterlevel: false,
    employeetracker: false,
  },
  management: {
    account: false,
    alert: false,
    device: false,
    location: false,
    machine: false,
    product: false,
    shift: false,
    workorder: false,
    employee: false,
    area: false,
    employeetag: false,
    employeetype: false,
  },
  other: {
    report: false,
  },
};

export interface ModuleOpt extends BasicSelectOpt<number>, IModule { }
