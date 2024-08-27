import { ILocation } from '../management/gateway';
import { Nullable } from '../user';

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

export type TStatisticResponse = {
  device_summary: TDeviceSummary;
  co2_average: {
    average_ppm: number;
    chart: TStatisticChart;
  };
};

export type TForestFireParams = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};

export type TConcentrationEfficiency = {
  mass_concentration: number;
  chart: TStatisticChart;
};

export type TFloodParams = {
  id: string;
  gatewayId: number;
};

export type TWaterLevelParams = {
  id: string;
  gatewayId: number;
};

export type TStatisticResponseEwsFlood = {
  device_summary: TDeviceSummary;
  mass_concentration_effeciency: TConcentrationEfficiency;
};

export type TDeviceStatus = 'normal' | 'alert';

export type TWaterLevelEwsFloodResponse = {
  max_water_level: Nullable<number>;
  current_water_level: Nullable<number>;
  average_current_water_level: Nullable<number>;
  different_average_current_water_level_persentage: Nullable<string>;
  highest_current_water_level: Nullable<number>;
  different_highest_current_water_level_persentage: Nullable<string>;
  lowest_current_water_level: Nullable<number>;
  different_lowest_current_water_level_persentage: Nullable<string>;
  water_level: Nullable<number>;
  alert?: TWaterLevelAlert;
};

export type TEwsForestFireResponse = {
  alert_time: number;
  co2_concentration: number;
};

export type TDeviceLocation = {
  id: string;
  name: string;
  device_status: TDeviceStatus;
  is_active: boolean;
  alert_times: number;
  alert_start: Date | null;
  lattitude: string;
  longtitude: string;
  receivedon: string;
  location: ILocation;
};

export type TDeviceLocationResponse = TDeviceLocation[];

export type TDeviceObject<T extends object> = TDeviceLocation & T;
export interface IDeviceLocationObj<T extends object> {
  chart: TStatisticChart;
  device_summary: TDeviceObject<T>;
}
export interface IDeviceLocationEwsFloodObj
  extends IDeviceLocationObj<TWaterLevelEwsFloodResponse> {}
export interface IDeviceLocationWaterLevelObj
  extends IDeviceLocationObj<TWaterLevelEwsFloodResponse> {}
export interface IDeviceLocationEwsForestFireObj
  extends IDeviceLocationObj<TEwsForestFireResponse> {}

export type TForestFireDevice = {
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

type TWaterLevelAlert = {
  id: number;
  receivedon: string;
  resolvedon: string | null;
  alertId: number;
  devicesensorrelationId: number;
  value: number;
  status: string;
  alert: {
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
  };
  devicesensorrelation: {
    id: number;
    deviceId: number;
    sensorId: number;
    companyId: number | null;
  };
  device: {
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
    deleted_at: string | null;
    gateway: {
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
      deleted_at: string | null;
      updated_by: number;
      updated_at: string;
    };
  };
  sensor: {
    id: number;
    name: string;
    code: string;
    status: number;
    sensortypeId: number;
    created_by: number | null;
    created_at: string;
    updated_by: number | null;
    updated_at: string;
    sensortype: {
      id: number;
      name: string;
      unit: string;
      description: string | null;
      created_by: number | null;
      created_at: string;
      updated_by: number | null;
      updated_at: string;
    };
  };
};
