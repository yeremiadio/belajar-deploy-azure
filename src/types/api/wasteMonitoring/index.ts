import { Nullable } from 'vitest';
import { TChartRanges } from '..';
import { TLocation, TSensorLog } from '../socket';

export enum EWasteTypeEnum {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  AIR = 'AIR',
};

export enum ESensorAirWasteEnum {
  'Temperature' = 'temp',
  'Humidity' = 'hmdt',
  'Smoke' = 'smke',
  'LPG' = 'lpg',
  'Methane' = 'mthn',
  'Carbon Monoxide' = 'co',
  'Propane' = 'prpn',
  'Air Quality' = 'airq'
}

export enum ESensorSolidWasteEnum {
  'Weight Trend' = 'weight',
};

export enum ESensorLiquidWasteEnum {
 'Liquid Level Trend' = 'wlvl'
}

export type TWasteMonitoringParams = {
  id: number;
  gatewayId: number;
  deviceIds: number[];
  range: TChartRanges;
  type: EWasteTypeEnum;
};

export type TValueChart = {
  id: string;
  deviceId: number;
  receivedon: string;
  value: number;
  sensorcode: string;
};


export type TWasteDevice = {
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
  location: Nullable<TLocation>;
  sensorlog: TSensorLog;
};
