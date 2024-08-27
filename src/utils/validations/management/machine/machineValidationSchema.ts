import * as yup from "yup";

const machineValidationSchema = yup.object().shape({
    name: yup.string().required('Alert Name is required'),
    code: yup.string().required('Machine ID is required'),
    locationId: yup.number().positive().integer().min(1, 'Location is Required').required(),

});

export default machineValidationSchema;