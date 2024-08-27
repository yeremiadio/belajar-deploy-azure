import { Nullable } from '@/types/global';
import { IRecipeDetail, IWorkOrderResponse } from '@/types/api/inventory/workOrder';
import { IMachine } from '@/types/api/management/machine';
import { TSensorData } from '@/types/api/socket';

export type TMachineDevice = {
  id: number;
  name: string;
  code: number;
  status: number;
  description: string | null;
  machineId: number;
  machineName: string;
  alert_status: string;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  location: {
    id: number;
    name: string;
    coordinate: {
      lat: number;
      lng: number;
    };
  };
  sensorlog: TSensorLog;
  userConfirmed: string[];
  machine: Pick<IMachine, 'id' | 'name' | 'code'>;
  oee: {
    oee: number;
    availability: number;
    performance: number;
    quality: number;
  };
};

export type TMachineDevicesList = TMachineDevice[];

export type TMachineState = {
  id: string;
  reason: string;
  workorderId: number;
  status: string;
  time: string;
};

export type TMachineStateTime = {
  startTime: string;
  endTime: string;
  status: string;
  color: string;
}

export type TValueChart = {
  id: string;
  deviceId: number;
  receivedon: string;
  value: number;
  sensorcode: string;
};

export type TValueAvailability = {
  availability: number;
  plannedProdTime: string;
  actualRunTime: string;
  plannedDownTime: string;
  actualDownTime: string;
};

export type TValuePerformance = {
  performance: number;
  prodTarget: string;
  actualRunTime: string;
  plannedDownTime: string;
  actualDownTime: string;
};

export type TValueQuality = {
  quality: number;
  notGoodCount: string;
  goodCount: string;
  totalCount: string;
};

export type TValueOEE = {
  availability: TValueAvailability;
  performance: TValuePerformance;
  quality: TValueQuality;
  oee: Nullable<number>;
  workorder: IWorkOrderResponse;
  recipe: IRecipeDetail;
};

export type TMachineMonitoringParams = {
  id: number;
  machineId: number;
  timeRangeHours: number;
  gatewayId: number;
  startDateAt: string;
  endDateAt: string;
};

export type TSensorLog = {
  id: string;
  receivedon: string;
  data: Array<TSensorData>;
};

export enum ESensorMachineMonitoringEnum {
  'Temperature' = 'temp',
  'Humidity' = 'hmdt',
  'Smoke' = 'smke',
  'LPG' = 'lpg',
  'Methane' = 'mthn',
  'Carbon Monoxide' = 'co',
  'Propane' = 'prpn',
  'Water Level' = 'wlvl',
  'Flow Rate' = 'flwrt',
  'Energy Delivered' = 'edel',
  'Frequency' = 'freq',
  'Power Factor' = 'pfac',
  'Active Power' = 'acpo',
  'VRMS' = 'vavg',
  'IRMS' = 'iavg',
  'Apparent Power' = 'appo',
  'Voltage' = 'vavg',
  'Current' = 'iavg'
}
