export type TSummaryObj = {
  q1: number;
  q3: number;
  avg: string;
  min: string;
  sensorcode: string;
  max: string;
};

export type TSensorLogSummary = {
  id: number;
  summary: TSummaryObj[];
  type: string;
  startDate: string;
  endDate: string;
  deviceId: number;
  gatewayId: number;
};

