import { IUserCredentialData } from "../user";

export interface LoginFormData {
  username: string;
  password: string;
  remember?: 1 | 0;
}

export type LoginResponse = IUserCredentialData;

export type RolesResponse = string[];

export type LoginErrorResponse = {
  data: {
    message: string;
    requestUrl: string;
    statusCode: number;
  };
};
