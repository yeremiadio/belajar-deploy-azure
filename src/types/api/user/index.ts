import * as yup from 'yup';

import { IPermissionData } from '@/types/api/permission';
import userValidationSchema from '@/utils/validations/management/user/userValidationSchema';
import userProfileValidationSchema from '@/utils/validations/user/userProfileValidationSchema';
import { userPasswordValidationSchema } from '@/utils/validations/user/userPasswordValidationSchema';
import { userResetPasswordValidationSchema } from '@/utils/validations/user/userResetPasswordValidationSchema';

export type Nullable<D> = D | null | undefined;

export type KnownRoleUserEnum = string;

export type ResetPasswordResponse = {
  temp_password: string;
};

export type ResetPasswordRequest = {
  usernameoremail: string;
  oldpassword: string;
  newpassword: string;
};

/**
 *   "" means no usertype
 * ```bash
 *   "systemadmin"   : datacakra's admin
 *   "superadmin"    : superadmin for a company
 *   "admin"         : admin of a company
 *   "officer"       : officer of a company
 *   "operator"      : operator of a company
 * ```
 */
export type KnownUsertype =
  | 'systemadmin'
  | 'superadmin'
  | 'admin'
  | 'officer'
  | 'operator';

export interface IUserGateway {
  id: number;
  name: string;
}
export interface IUserPermission {
  name: string;
  permission: boolean;
  gateway: Array<IUserGateway>;
}

export interface IUserCredentialData {
  id: number;
  username: Nullable<string>;
  email: Nullable<string>;
  usertypeId: Nullable<number>;
  usertypeName: Nullable<KnownUsertype>;
  companyId: Nullable<number>;
  companyName: Nullable<string>;
  phonenumber: Nullable<string>;
  permissions: Array<IUserPermission>;
  iat: number;
  exp: number;
  jwt: string;
}

export interface IUserData {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  usertypeId: number;
  companyId: number;
  phonenumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  sentVerificationEmailTime: Nullable<string>;
  sentVerificationPhoneTime: Nullable<string>;
  phoneOtpExpired: Nullable<string>;
  created_at: string;
  updated_at: string;
  lastseennotification: string;
  usertype: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  permissions: Nullable<IPermissionData>;
}

export interface IUserRequestObj {
  email: string;
  username: string;
  usertypeId: Nullable<number>;
  firstname: string;
  lastname: string;
  companyId?: Nullable<number>;
  password?: string;
  phonenumber: string;
}

export interface IUserParams {
  id: number;
  search: string;
  username: string;
  email: string;
  companyId: number;
  isPaginated?: boolean;
}

export interface IUserBindData
  extends Pick<IUserData, 'id' | 'firstname' | 'lastname'> {
  name: string;
}

export type TUserRequestFormObject = yup.InferType<typeof userValidationSchema>;

export type TUserProfileResponse = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  usertypeId: number;
  companyId: number;
  phonenumber: string;
  socketId: string | null;
  profilepic: {
    type: string;
    data: number[];
  };
  emailVerified: boolean;
  phoneVerified: boolean;
  sentVerificationEmailTime: string;
  sentVerificationPhoneTime: string | null;
  phoneOtpExpired: string | null;
  created_at: string;
  updated_at: string;
  lastseennotification: string;
};

export type TUserProfileUpdateRequest = {
  email: string;
  username: string;
  usertypeId: number;
  firstname: string;
  lastname: string;
  companyId: number;
  password: string;
  phonenumber: string;
};

export type TUserPasswordUpdateRequest = {
  oldPassword: string;
  newPassword: string;
};

export type TUserProfileForm = yup.InferType<
  typeof userProfileValidationSchema
>;

export type TUserPasswordForm = yup.InferType<
  typeof userPasswordValidationSchema
>;

export type TUserResetPasswordConfirmForm = yup.InferType<
  typeof userResetPasswordValidationSchema
>;
