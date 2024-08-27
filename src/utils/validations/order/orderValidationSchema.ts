import * as yup from 'yup';

const purchaseOrderValidationSchema = yup.object().shape({
  vendorId: yup.number().required('Vendor is required.'),
  address: yup.string().transform((value) => (value === null ? '' : value)),
  groupInventoryId: yup.number().required('Pricelist is required.'),
  deliveryDate: yup.date().required('Delivery Date is required.'),
  termsId: yup.string().required('Payment Terms is required.'),
  status: yup.string().required('Status is required.'),
  inventoryList: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        quantity: yup.number().required(),
        inventory: yup.mixed().required(),
      }),
    )
    .min(1, 'At least one inventory is required.'),
  tax: yup.number().transform((value) => (value === null ? 0 : value)),
  discount: yup.number().transform((value) => (value === null ? 0 : value)),
});

export default purchaseOrderValidationSchema;
