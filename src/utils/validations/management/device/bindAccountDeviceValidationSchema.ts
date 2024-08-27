import * as yup from "yup";

const bindAccountDeviceValidationSchema = yup.object().shape({
    userIds: yup.array().of(yup.number()).required('User is required').min(1),
});

export default bindAccountDeviceValidationSchema;