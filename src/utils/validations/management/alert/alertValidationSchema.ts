import * as yup from "yup";

const alertValidationSchema = yup.object().shape({
    name: yup.string().required('Alert Name is required'),
    sensortypeId: yup.number().positive().integer().min(1, 'Sensortype ID is Required').required(),
    sign: yup.number().integer().min(-2, 'Sign is Required').required(),
    value: yup.number().required('Alert Value is required'),
    threatlevel: yup.number().min(1, 'Threat Level is Required').required(),
    status_email: yup.boolean().optional(),
    status_whatsapp: yup.boolean().optional(),
});

export default alertValidationSchema;