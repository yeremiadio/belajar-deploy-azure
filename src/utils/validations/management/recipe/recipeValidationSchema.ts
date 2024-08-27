import * as yup from 'yup';

const recipeValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  inventoryId: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.number().required(),
    })
    .required('Inventory is Required'),
  output: yup.number().min(1, "Output cannot be 0").transform((value) => (isNaN(value) ? undefined : value)).required('Output is Required'),
  recipeIngredients: yup.array().of(
    yup.object().shape({
      inventoryId: yup
        .object()
        .shape({
          label: yup.string(),
          value: yup.number().nullable(),
        })
        .required('Inventory is Required'),
      amount: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Amount is Required'),
    }),
  ),
});

export default recipeValidationSchema;
