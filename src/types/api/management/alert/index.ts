import * as yup from "yup";

import { TSensorType } from '@/types/api/management/sensortype';
import bindDeviceValidationSchema from '@/utils/validations/bindDeviceValidationSchema';
import alertValidationSchema from "@/utils/validations/management/alert/alertValidationSchema";
import { Nullable } from "../../user";

export type TAlertSignType = -2 | -1 | 1 | 2;

export interface IAlert {
    /**
     * @deprecated Delete this field soon
     */
    email: boolean;
    /**
    * @deprecated Delete this field soon
    */
    whatsapp: boolean;
    relationid: number[];
    companyId: number;
    alertId: number;
    sensorId: number;
    code: string;
    id: number;
    name: string;
    sensortypeId: number;
    sign: TAlertSignType;
    devsenalertrelation: Array<{
        id: number;
        alertId: number;
        devicesensorrelationId: number;
        alertStatus: boolean;
        alertStart: string;
    }>;
    /**
     * @description Threat Threshold value
     */
    value: number;
    /**
     * @description Threat level === 1 (Warning)
     * Threat Level === 2 (Danger)
     */
    threatlevel: number;
    threshold: string;
    threat: number;
    status: number;
    status_email: number;
    status_whatsapp: number;
    sensortype: TSensorType;
}

export interface IAlertRequestObject {
    name: string;
    sensortypeId: Nullable<number>;
    sign: Nullable<number>;
    value: Nullable<number>;
    threatlevel: Nullable<number>;
    status: number;
    status_email: number;
    status_whatsapp: number;
}

export type IBindDeviceAlertRequestFormObject = yup.InferType<
    typeof bindDeviceValidationSchema
>;

export type TAlertRequestFormObject = yup.InferType<typeof alertValidationSchema>;

export interface IAlertRelation {
    alertIds: number[];
    relationIds: number[];
}
