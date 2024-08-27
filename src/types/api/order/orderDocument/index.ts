import * as yup from 'yup';
import documentOrderValidationSchema from '@/utils/validations/order/documentOrderValidationSchema';

export type TOrderDocument = {
  id: number;
  documentLabel: string;
  annotation: string;
  file: File;
  createdAt: Date;
  updatedAt: Date;
};

export type TOrderFile = {
  annotation: string;
  company_id: number;
  createdAt: Date;
  deletedAt: Date | null;
  fileUrl: string;
  id: number;
  label: string;
  orderId: number;
  updatedAt: Date;
};

export type TOrderDocumentRequestFormObject = yup.InferType<
  typeof documentOrderValidationSchema
>;
