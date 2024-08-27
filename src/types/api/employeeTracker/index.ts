export type TEmployeeTrackerParams = {
  id: string;
  gatewayId: number;
};

export type TEmployeeSummary = {
  attended: number;
  onLeave: number;
  totalEmployee: number;
};

export type TEmployeeLocationDetail = {
  id: number;
  name: string;
  position: string;
  location: string;
  lastUpdateInMin: number;
  status: 'normal' | 'warn' | 'alert';
  coordinates: TFlatCoordinate;
};

export type TCoordinate = {
  lat: number[];
  lng: number[];
};

export type TFlatCoordinate = {
  lat: number;
  lng: number;
};

export type TEmployeeLocation = {
  employee: TEmployeeLocationDetail[];
  restrictedCoordinates: TCoordinate[];
};

export type TEmployeeStatus = {
  status: string;
  duration?: number;
  location?: string;
  date?: string;
};

export type TEmployeeActivity = {
  id: number;
  employeeName: string;
  employeeId: string;
  activeTime: string;
  employeeStatus: TEmployeeStatus[];
  shift: 1 | 2 | 3;
};

export type TEmployeeDetail = {
  id: number;
  employeeName: string;
  employeeId: string;
  activeTime: string;
  email: string;
  phoneNumber: string;
  gender: string;
  tagDevice: string;
  address: string;
  workingArea: string[];
  attendance: number;
  leave: number;
  late: number;
};

export type TEmployeeAvailability = {
  inWorkingStation: string;
  overtime: string;
  late: string;
  locationAnomaly: string;
};

export type TEmployeeAvailabilityTrend = {
  availability: number;
  date: string;
};
