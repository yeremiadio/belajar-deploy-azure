
export type TWaterLevelRanges = "DAY" | "MONTH" | "YEAR";
export type TWaterLevelParams = {
  id: string;
  gatewayId: number;
  range: TWaterLevelRanges;
  sensorcode: string
};

export type TAverageHumadity = number;

export type TRainGauge = {
  current_rain_bulk: number;
  last_week_rain_bulk: number;
  this_week_rain_bulk: number;
};

export type TValueChart = {
  id: string;
  deviceId: number;
  receivedon: string;
  value: number;
  sensorcode: string;
};

export enum WaterLevelDeviceSensorEnum {
    wlvl = 'Water Level',
    wusg = 'Water Usage',
    wfwl = 'Waterflow',
    flwrt = 'Flowrate',
}
