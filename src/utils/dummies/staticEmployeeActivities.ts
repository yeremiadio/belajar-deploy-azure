import { TEmployeeActivity } from "@/types/api/employeeTracker";

export const activityIndicators = [
  { name: "In Working Station", color: "#20C997" },
  { name: "Overtime", color: "#3699FF" },
  { name: "Late", color: "#FDAA09" },
  { name: "Location Anomaly", color: "#58657A" },
];

export const activityTableData: TEmployeeActivity[] = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeId: "123456",
    activeTime: "5 hours",
    shift: 1,
    employeeStatus: [
      { status: "In Working Station", duration: 5 },
      { status: "Overtime", duration: 3 },
      { status: "Late", duration: 0 },
      { status: "Location Anomaly", duration: 1 },
    ],
  },
  {
    id: 2,
    employeeName: "Jane Doe",
    employeeId: "123457",
    activeTime: "5 hours",
    shift: 1,
    employeeStatus: [
      { status: "In Working Station", duration: 10 },
      { status: "Overtime", duration: 3 },
      { status: "Late", duration: 0 },
      { status: "Location Anomaly", duration: 1 },
    ],
  },
  {
    id: 3,
    employeeName: "Jane Doe",
    employeeId: "123123",
    activeTime: "5 hours",
    shift: 1,
    employeeStatus: [
      { status: "In Working Station", duration: 3 },
      { status: "Overtime", duration: 5 },
      { status: "Late", duration: 2 },
      { status: "Location Anomaly", duration: 1 },
    ],
  },
];
