import * as yup from "yup";
import { IModule } from "@/types/api/module";
import companyValidationSchema from "@/utils/validations/management/company/companyValidationSchema";
import { Nullable } from "@/types/api/user";
import { IMenuPermissions } from "@/types/api/permission";


export interface ICompanyObj {
  name: string;
  description: string;
  moduleIds: Nullable<number>[];
};

export interface ICompanyV2QueryParameterObject extends ICompanyObj {
  isPaginated?: boolean;
}

export type CompanyModuleTypes =
  | "OEE"
  | "Envirobox"
  | "Water Level"
  | "Energy Meter Basic"
  | "Energy Meter Advanced";

export interface ACompanyModule {
  id: number;
  name: string;
}

export interface ICompany extends ICompanyObj {
  id: number;
  created_at: string;
  updated_at: string;
  modules: Pick<IModule, "id" | "name">[];
  permission: IMenuPermissions;
};

export type TCompanyRequestFormObject = yup.InferType<typeof companyValidationSchema>;
