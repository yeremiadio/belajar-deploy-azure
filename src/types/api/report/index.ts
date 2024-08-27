import { Nullable } from 'vitest';

export enum EAvailableAdditionalFilterReport {
  deviceIds = 'Device',
  sensorTypeIds = 'Sensor Type',
  threatLevels = 'Alert Status',
  alertConfirmed = 'Alert Confirmed',
}

export enum EAlertStatus {
  NORMAL = 'Normal',
  CRITICAL = 'Critical',
  WARNING = 'Warning',
}

export enum EAlertConfirmed {
  true = 'Show',
  false = 'Do Not Show',
}

export enum EReportData {
  LOG = 'Log',
}

export type TReportRequest = {
  moduleId: number;
  dataType: string;
  date: string;
  deviceIds?: string[];
  sensorTypeIds?: string[];
  threatLevels?: string[];
  isAlertConfirmed?: string;
};

export type TReportLogResponse = {
  device_id: number;
  timestamp: string;
  location_name: string;
  unit: string;
  sensor_type: string;
  value: string;
  threatlevel: number;
  latest_alert_id: number;
  is_confirmed: Nullable<string>;
};
