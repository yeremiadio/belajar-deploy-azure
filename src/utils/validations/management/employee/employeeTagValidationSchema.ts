import * as yup from "yup";

const employeeTagValidationSchema = yup.object().shape({
  tagDevice: yup.string().required('Tag Device is required'),
  isSuperAdmin: yup.boolean(),
  companyId: yup.number().typeError("You must specify a number")
    .when("isSuperAdmin", {
      is: true,
      then: (schema) => schema.required('Company ID is required'),
      otherwise: (schema) => schema.optional()
    }),
});

export default employeeTagValidationSchema;