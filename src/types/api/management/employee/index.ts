import * as yup from 'yup';

import employeeTagValidationSchema from "@/utils/validations/management/employee/employeeTagValidationSchema";

export interface IEmployeeObj {
  id?: number;
  name: string;
  empid: string;
  employeetypeId: number;
  shiftIds: number[];
  coordinate?: {
    x: number;
    y: number;
  };
  locationAreaIds: number[];
}

export interface IEmployee extends IEmployeeObj {
  id: number;
}

export interface IEmployeeData
  extends Omit<IEmployee, "shiftIds" | "locationAreaIds" | "shift"> {
  employeetypeName: string;
  shifts: {
    name: string;
    id: number;
  }[];
}

export interface IEmployeeTagObj {
  tagdevice: string;
  empid: string | null;
}

export interface IEmployeeTag extends IEmployeeTagObj {
  id: number;
  companyId: number;
  employee: IEmployeeData;
}

export interface IEmployeeTagData extends IEmployeeTag {
  employeetypeName: string;
  employeeName: string;
}

export interface IEmployeeType {
  id: number;
  name: string;
  companyId: string;
}

export interface IEmployeeTypeObj extends Pick<IEmployeeType, "name"> { }
export interface IEmployeeTypeList extends Omit<IEmployeeType, "companyId"> { }

export type TEmployeeTafRequestFormObject = yup.InferType<
  typeof employeeTagValidationSchema
>;

export interface IEmployeeIdOpt {
  employeename: string;
  label: string;
  value: number;
}
