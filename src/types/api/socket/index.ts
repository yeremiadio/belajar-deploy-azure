import { Nullable } from '@/types/global';

import { TAlertSignType } from '../management/alert';

export enum EStatusAlertEnum {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  NORMAL = 'NORMAL',
}

/**
 * @description partial used TGatewayDevice
 */
export type TLocation = {
  id: number;
  name: string;
  coordinate: {
    lat: number;
    lng: number;
  };
};

export type TAlert = {
  alertlog: {
    id: number;
    receivedon: string;
    value: number;
    status: string; // on || off
  };
  id: number;
  name: string;
  sign: TAlertSignType;
  value: number;
  threatlevel: number;
  status: number;
  status_email: number; // 0 || 1
  status_whatsapp: number; // 0 || 1
  email: Nullable<string>;
  whatsapp: Nullable<string>;
  created_at: string;
  updated_at: string;
  deleted_at: Nullable<string>;
};

export type TSensorData = {
  sensorcode: string; // 'freq' || 'pfac' || 'appo' || 'edel' || 'vavg' || 'vavg' || 'iavg' || 'acpo' || 'cnba' || 'cnbb' || 'cnbc' || 'cnbw' || 'vnba' || 'vnbb' || 'vnbc' || 'vnbw' || 'thdv' || 'stdd' || 'thdc' || 'rpow'
  value: number;
  unit: string;
  alert: Nullable<TAlert>;
};

export type TSensorLog = {
  id: number;
  receivedon: string;
  data: Array<TSensorData>;
};

export type TChartSensor = {
  sensorcode: string;
  values: number[];
  times: number[];
};


export type TSensorMonitoring = TSensorLog & { deviceId: number };

export type TUserConfirmed = {
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  username: string;
};

/**
 * @description used All Gateway Device
 */
export type TGatewayDevice = {
  id: number;
  name: string;
  code: number;
  status: number; // 1 || 0
  description: Nullable<string>;
  gatewayId: Nullable<number>;
  devicetypeId: Nullable<number>;
  companyId: Nullable<number>;
  machineId: Nullable<number>;
  alert_status: string; // NORMAL || WARNING || CRITICAL
  created_by: number;
  created_at: string;
  updated_by: Nullable<number>;
  updated_at: string;
  location: TLocation;
  sensorlog: TSensorLog;
  sensorcodeConfirmed: Array<string>;
  userConfirmed: Array<TUserConfirmed>;
};

export type TGWDeviceSensorLog = Omit<TGatewayDevice, 'sensorlog'> & {
  sensorlog: TSensorLog[];
};

/**
 * @description used for socket gateway
 */
export type TSocketGateway = TGatewayDevice;

/**
 * @description used for socket notif
 */
export type TSocketNotif = {
  id: number;
  status: string; // CRITICAL || NORMAL
  message: string;
  time: string;
  value: number;
  resolvedon: string;
  alertId: number;
  is_read: boolean;
  device: {
    id: number;
    name: string;
    code: number;
    gatewayId: number;
    status: number; // 1 || 0
    description: Nullable<string>;
    devicetypeId: number;
    companyId: number;
    alert_status: string; // CRITICAL || NORMAL
    created_at: string;
    updated_at: string;
    gateway: {
      id: number;
      name: string;
      code: Nullable<string>;
      status: Nullable<string>;
      created_at: string;
      updated_at: string;
      modules: {
        id: number;
        name: string;
        permission: string;
      };
    };
  };
  location: {
    id: number;
    name: string;
    coordinate: {
      lat: number;
      lng: number;
    };
  };
  sensor: {
    id: number;
    name: string;
    code: string;
    status: number; // 1 || 0
    created_at: string;
    updated_at: string;
  };
};

export const example_notif = {
  id: 738387,
  status: 'WARNING',
  message:
    'Humidity 11.91 % on Device Dev-Env-Box-10 Less than or equal to 70 %',
  time: '2024-07-01T07:40:02.134Z',
  resolvedon: '2024-07-01T08:05:50.162Z',
  alertId: 255,
  is_read: false,
  device: {
    id: 593,
    name: 'Dev-Env-Box-10',
    code: 10,
    gatewayId: 318,
    status: 1,
    description: null,
    devicetypeId: 4,
    companyId: 168,
    alert_status: 'WARNING',
    created_at: '2024-05-22T03:18:04.083Z',
    updated_at: '2024-07-01T07:40:02.596Z',
    gateway: {
      id: 318,
      name: 'Gtw-ENV-Tangsel',
      code: null,
      status: null,
      created_at: '2024-05-19T17:00:00.000Z',
      updated_at: '2024-05-19T17:00:00.000Z',
      modules: {
        id: 4,
        name: 'Envirobox',
        permission: 'envirobox',
      },
    },
  },
  location: {
    id: 308,
    name: 'Env-Pondok Benda',
    coordinate: {
      lat: -6.3511345,
      lng: 106.7205154,
    },
  },
  sensor: {
    id: 61,
    name: 'Humidity',
    code: 'hmdt',
    status: 1,
    created_at: '2022-05-30T17:00:00.000Z',
    updated_at: '2022-05-30T17:00:00.000Z',
  },
};
