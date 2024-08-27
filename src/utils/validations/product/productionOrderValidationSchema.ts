import * as yup from 'yup';

const productionOrderValidationSchema = yup.object().shape({
  productId: yup.string().nullable(),
  startDate: yup.date(),
  productName: yup.string(),
  endDate: yup.date(),
  qty: yup.number(),
  duration: yup.number(),
  status: yup.string(),
  factory: yup.string(),
  machine: yup.string(),
  unit: yup.string(),
});

export default productionOrderValidationSchema;
