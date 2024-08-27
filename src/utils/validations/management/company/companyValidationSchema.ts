import * as yup from "yup";

const companyValidationSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    description: yup.string().optional(),
    module: yup.array().of(yup.number()).required('Module is required').min(1),
});

export default companyValidationSchema;

