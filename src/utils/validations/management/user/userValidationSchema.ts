import * as yup from "yup";

const userValidationSchema = yup.object().shape({
    firstname: yup.string().required('Firstname is required'),
    lastname: yup.string().optional(),
    usertypeId: yup.number().required('Role is required'),
    companyId: yup.number().required('Company is required').nullable(),
    email: yup.string().required('Email is required'),
    username:  yup.string().required('Username is required'),
    phonenumber:  yup.string().required('Phone number is required'),
});

export default userValidationSchema;

