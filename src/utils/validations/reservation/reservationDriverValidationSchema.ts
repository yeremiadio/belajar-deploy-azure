import * as yup from "yup";

const reservationDriverValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().optional(),
    phoneNumber: yup.string().optional(),
    identity: yup.string().required('Identity is required'),
    identityNumber: yup.string().required('Identity Number is required'),
});

export default reservationDriverValidationSchema;