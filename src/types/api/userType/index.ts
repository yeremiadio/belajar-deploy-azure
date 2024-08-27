import * as yup from "yup";
import { KnownUsertype } from "@/types/api/user";


export interface IUsertypeData {
    id: number;
    name: KnownUsertype;
};

export interface IUsertypeRequestObj {
    name: string;
}

export interface IUsertypeRequestParams {
    userTypename?: string;
    id?: number;
    excludeRoles?: boolean;
}

export const usertypeValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required')
});

export type TUsertypeRequestFormObject = yup.InferType<typeof usertypeValidationSchema>;
