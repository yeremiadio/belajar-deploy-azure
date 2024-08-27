import * as yup from 'yup';

import { TSensorType } from '@/types/api/management/sensortype';
import sensorValidationSchema from '@/utils/validations/sensorValidationSchema';

export interface ISensor {
  id: number;
  name: string;
  status: number;
  code: string;
  sensortypeId: number;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  sensortype: TSensorType;
  hasThreshold: boolean;
  sensorcat: [];
}

export interface ICreateSensorObj {
  name: string;
  status: number;
  code: string;
  sensortypeId: number;
}

export interface IGetSensorObj extends Partial<ICreateSensorObj> {
  id?: number;
  moduleId?: number;
  page?: number;
  take?: number;
  isPaginated?: boolean;
}

export type TSensorRequestFormObject = yup.InferType<
  typeof sensorValidationSchema
>;
