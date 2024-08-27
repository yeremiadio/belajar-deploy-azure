import * as yup from 'yup';

import tagValidationSchema from '@/utils/validations/management/tag/tagValidationSchema';

import { ACompanyModule } from '@/types/api/management/company';
import { Nullable } from '@/types/global';
import { TReservationObject } from '@/types/api/reservation';

export interface ITagObjResponse {
  name: string;
  company: ACompanyModule;
  id: number;
  isReseted: boolean;
  reservations?: Array<TReservationObject>;
  relation: string;
}

export interface ITagObjRequest {
  name: string;
  companyId: Nullable<number>;
  isShowAll?: boolean;
  isAvailable?: boolean;
}

export type TTagRequestFormObject = yup.InferType<typeof tagValidationSchema>;
