import { TSensorLog } from '../../socket';

export type TFloodParams = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};

/**
 * @description enum sensor at flood
 */
export enum ESensorFloodEnum {
  'Water Level' = 'wlvl',
  'Flow Rate' = 'flwrt',
}

export type TChart<L = string> = {
  label?: string;
  value: Array<number>;
  time?: Array<L>;
};

/**
 * @description partial used /api/ews-flood/statistic
 */
export type TDeviceSummary = {
  total_active: number;
  total_inactive: number;
  total_alert: number;
};

export type TConcentrationEfficiency = {
  mass_concentration: number;
  chart: TChart;
};

/**
 * @description used /api/ews-flood/statistic
 */
export type TStatisticResponse = {
  device_summary: TDeviceSummary;
  mass_concentration_effeciency: TConcentrationEfficiency;
};

/**
 * @description sanitized sensorlog at api /devices/{id} => Version-Header:"2'
 */
export type TChartSensor = {
  sensorcode: string;
  values: number[];
  times: number[];
};

export type TSensorFlood = TSensorLog & { deviceId: number };
