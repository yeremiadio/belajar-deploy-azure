import * as yup from "yup";

const bindDeviceMachineValidationSchema = yup.object().shape({
    deviceId: yup.number().positive().integer().min(1, 'Device is Required').required('Device is Required').nullable(),
    gatewayId: yup.number().positive().integer().min(1, 'Gateway is Required').required(),
});

export default bindDeviceMachineValidationSchema;