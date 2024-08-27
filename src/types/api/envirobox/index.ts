import { TSensorLog, TUserConfirmed } from '../socket';

export type TEnviroboxParams = {
  id: string;
  gatewayId: number;
};

export type TEnviroboxDeviceSummary = {
  active: number;
  inactive: number;
  totalDevice: number;
  warning: number;
  critical: number;
};

export type TEnviroboxDevice = {
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
  location: {
    id: number;
    name: string;
    coordinate: {
      lat: number;
      lng: number;
    };
  };
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
  userConfirmed: Array<TUserConfirmed>;
};

export type TEnviroboxDevicesList = TEnviroboxDevice[];
export type TSensorEnvirobox = TSensorLog & { deviceId: number };
export type TSensorEnviroboxRequestObj = {
  id: number;
  gatewayId: number;
  timeRangeHours: number;
};
