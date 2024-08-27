import * as yup from 'yup';

const addPinpointValidationSchema = yup.object().shape({
    address: yup.string(),
    // lng: yup.number().required('Longitude is required'),
});

export default addPinpointValidationSchema;
