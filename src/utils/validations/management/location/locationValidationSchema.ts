import * as yup from 'yup';

const locationValidationSchema = yup.object().shape({
    name: yup.string().required('Location Name is required'),
    isSuperAdmin: yup.boolean(),
    companyId: yup.number().typeError("You must specify a number")
        .when("isSuperAdmin", {
            is: true,
            then: (schema) => schema.required('Company ID is required'),
            otherwise: (schema) => schema.optional()
        }),
    lat: yup.string(),
    lng: yup.string(),
    shiftIds: yup.array().of(yup.number()).notRequired(),
});

export default locationValidationSchema;
