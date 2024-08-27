import * as yup from 'yup';

const inOutStockValidationSchema = yup.object().shape({
  date: yup.date().required('Date is required'),
  name: yup.string().required('Transaction name is required'),
  type: yup.string().required('Type is required'),
  stock: yup
    .number()
    .typeError('Qty must be a number')
    .required('Stock is required')
    .min(0, 'Qty must be greater than 0'),
  inventoryId: yup.string().required('Inventory is required'),
});

export default inOutStockValidationSchema;
