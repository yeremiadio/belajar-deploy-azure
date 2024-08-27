import * as yup from 'yup';

const reservationActivityValidationSchema = yup.object().shape({
  documentId: yup.string().optional(),
  category: yup.string().required('Category is required'),
  isPriority: yup.boolean().optional(),
  expectedCheckInDate: yup
    .date()
    .required('Expected check-in date is required'),
  vendorId: yup.number().required('Vendor ID is required'),
  driverId: yup.number().required('Driver ID is required'),
  licensePlateId: yup.number().required('License plate ID is required'),
  tagId: yup.number().required('Tag ID is required'),
  isUseDeliveryOrderId: yup.boolean().optional(),
  orderDeliveryId: yup.number().when('isUseDeliveryOrderId', {
    is: true,
    then(schema) {
      return schema.required('Order delivery ID is required');
    },
    otherwise(schema) {
      return schema.optional();
    },
  }),
  reservationItems: yup
    .array()
    .of(
      yup.object().shape({
        inventoryId: yup.number().required('Inventory ID is required'),
        amount: yup.number().required('Amount is required'),
        actualAmount: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .optional(),
        unit: yup.string().required('Unit is required'),
        stock: yup.number().optional(),
      }),
    )
    .required()
    .min(1, 'At least one reservation item is required'),
  file: yup.mixed().optional(),
  status: yup.string().optional(),
  warehouseId: yup.number().optional(),
  dockId: yup.number().optional(),
  fileUrls: yup.array().optional(),
});

export default reservationActivityValidationSchema;
