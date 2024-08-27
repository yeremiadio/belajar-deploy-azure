import { ILocation } from '../management/location';
import { TSensorLog } from '../socket';
import { Nullable } from '../user';

export type TSmartPoleParams = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};

export type TDeviceSummary = {
  total_active: number;
  total_inactive: number;
  total_alert: number;
};

export type TStatisticChart = {
  value: number[];
  label?: string;
  time?: string[];
};

export type TConcentrationEfficiency = {
  mass_concentration: number;
  chart: TStatisticChart;
};

export type TStatisticSmartPole = {
  device_summary: TDeviceSummary;
  mass_concentration_effeciency: TConcentrationEfficiency;
};

export type TDeviceDetail = {
  id: string;
  name: string;
  device_status: string;
  is_active: boolean;
  alert_start: Nullable<string>;
  alert_times: number;
  pm1: Nullable<number>;
  pm2_5: Nullable<number>;
  resp: Nullable<number>;
  pm10: Nullable<number>;
  lattitude: string;
  longtitude: string;
};

export type TInformationSmartPole = {
  id: string;
  name: string;
  device_status: string;
  is_active: boolean;
  alert_start: Nullable<string>;
  alert_time: number;
  pm1: Nullable<number>;
  pm2_5: Nullable<number>;
  pm10: Nullable<number>;
  resp: Nullable<number>;
  lattitude: string;
  longtitude: string;
  model: string;
  health: string;
  status: boolean;
  spray: boolean;
  lamp: boolean;
  hotspot: boolean;
  location: string;
};

export type TCctvSmartPole = {
  status: boolean;
};

export type TSprayedWaterVolumeSmartPole = {
  time: string[];
  value: number[];
};

export type TGetSprayedWaterVolumeParams = {
  id: string;
  filterData: string;
  gatewayId: number;
};

export type TEnergyConsumptionSmartPole = {
  label: string;
  value: number;
};

export type TWaterSprayHistory = {
  id: string;
  volume: number;
  date: string;
  deviceStatus: 'normal' | 'abnormal';
  isManual: boolean;
  times: number;
};

export type TGetWaterSprayHistoryParams = {
  id: string;
  filterData: string;
  gatewayId: number;
};

export type TAirQuality = {
  time: string;
  air_quality: {
    pm10: number;
    pm2_5: number;
    pm1: number;
    resp: number;
  };
};

export type TSmartPoleDevice = {
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
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  location: Pick<ILocation, 'id' | 'name' | 'coordinate'>;
  sensorlog: {
    id: string;
    deviceId: number;
    receivedon: string;
    data: {
      sensorcode: string;
      value: string;
      alert: {
        alertlog: {
          id: number;
          receivedon: string;
          value: number;
          status: string;
        };
        id: number;
        name: string;
        sensortypeId: number;
        sign: number;
        value: number;
        threatlevel: number;
        status: number;
        status_email: number;
        status_whatsapp: number;
        email: string | null;
        whatsapp: string | null;
        companyId: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
      } | null;
    }[];
  };
};

export type TSensorSmartpole = TSensorLog & { deviceId: number };

export type TChartSensor = {
  sensorcode: string;
  values: number[];
  times: number[];
};
