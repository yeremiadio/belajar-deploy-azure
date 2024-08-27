import * as yup from "yup";

const reservationVendorValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    address:  yup.string().required('Address is required'),
    annotation:  yup.string().optional(),
});

export default reservationVendorValidationSchema;