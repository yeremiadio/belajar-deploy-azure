import * as yup from "yup";

const bindDeviceValidationSchema = yup.object().shape({
    relationIds: yup.array().of(yup.number().required('Relation IDs are required')).min(1).required('This field is required'),
});

export default bindDeviceValidationSchema;