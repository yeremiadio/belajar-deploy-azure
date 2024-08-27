import { IUserCredentialData } from '@/types/api/user';

export type TPermission = {
  name: string;
  permission: boolean;
  gateway: [
    {
      id: number;
      name: string;
    },
  ];
};

export type TPermissionUser = {
  dashboard :TPermission[],
  management : Omit<TPermission, "gateway">[] 
 }

export type StoredCookieValue = {
  userId: number;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  token: string;
  reset_pass: boolean;
  companyName: string;
  usertypeName: string;
  unit_name: string;
  companyId: number;
  permissions: TPermissionUser;
};

export type StoredCookieName =
  | keyof Pick<IUserCredentialData, 'id' | 'username' | 'email' | 'iat' | 'exp' | 'companyId'>
  | keyof Omit<StoredCookieValue, 'id' | 'username' | 'email' | 'iat' | 'exp'>;
