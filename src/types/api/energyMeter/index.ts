import { TSensorLog } from '../socket';

export type TEnergyMeterParams = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};

/**
 * @description enum sensor at energy-meter
 */
export enum ESensorEnergyMeterEnum {
  'Energy Delivered' = 'edel',
  'Frequency' = 'freq',
  'Power Factor' = 'pfac',
  'Active Power' = 'acpo',
  'VRMS' = 'vavg',
  'IRMS' = 'iavg',
  'Apparent Power' = 'appo',
}

export type TChart<L = string> = {
  label?: string;
  value: Array<number>;
  time?: Array<L>;
};

/**
 * @description used /api/energy-meter/summary
 */
export type TTodaySummary = {
  spend_amount: number;
  amount_percentage: number;
  total_usage: number;
};

/**
 * @description sanitized sensorlog at api /devices/{id} => Version-Header:"2'
 */
export type TChartSensor = {
  sensorcode: string;
  values: number[];
  times: number[];
};

export type TSensorEnergyMeter = TSensorLog & { deviceId: number };
