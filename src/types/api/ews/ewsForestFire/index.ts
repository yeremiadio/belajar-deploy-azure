import { TSensorLog } from '../../socket';

export type TForestFireParams = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};

/**
 * @description enum sensor at forest-fire
 */
export enum ESensorForestFireEnum {
  'Temperature' = 'temp',
  'Humidity' = 'hmdt',
  'Smoke' = 'smke',
  'LPG' = 'lpg',
  'Methane' = 'mthn',
  'Carbon Monoxide' = 'co',
  'Propane' = 'prpn',
}

export type TChart<L = string> = {
  label?: string;
  value: Array<number>;
  time?: Array<L>;
};

/**
 * @description partial used /api/ews/statistic
 */
export type TDeviceSummary = {
  total_active: number;
  total_inactive: number;
  total_alert: number;
};

/**
 * @description used /api/ews/statistic
 */
export type TStatisticResponse = {
  device_summary: TDeviceSummary;
  co2_average: {
    average_ppm: number;
    chart: TChart;
  };
};

/**
 * @description sanitized sensorlog at api /devices/{id} => Version-Header:"2'
 */
export type TChartSensor = {
  sensorcode: string;
  values: number[];
  times: number[];
};

export type TSensorForestFire = TSensorLog & { deviceId: number };
