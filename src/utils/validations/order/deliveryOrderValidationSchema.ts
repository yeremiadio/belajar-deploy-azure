import * as yup from 'yup';

const deliveryOrderValidationSchema = yup.object().shape({
  deliveryId: yup.string().required('Delivery ID is required.'),
  expectedDeliveryDate: yup
    .date()
    .required('Expected Delivery Date is required.'),
  annotation: yup.string().optional(),
  orderDeliveryItems: yup.array().of(
    yup.object().shape({
      inventoryId: yup.number().optional(),
      amount: yup.number().optional(),
      inventory: yup.mixed().optional(),
    }),
  ),
  isPriority: yup.boolean().default(false),
  tagId: yup.number(),
  driverId: yup.number(),
  vehicleId: yup.number(), // Possible name change to plateNumber
  file: yup.mixed().optional(),
  status: yup.string().optional(),
});

// TODO: use this schema in the component (According to current endpoint)
// const deliveryOrderValidationSchema = yup.object().shape({
//   expectedDeliveryDate: yup
//     .date()
//     .required('Expected Delivery Date is required.'),
//   orderId: yup.number().required('Order ID is required.'),
//   annotation: yup.string().optional(),
//   inventoryId: yup.number().required('Inventory ID is required.'),
//   amount: yup.number().required('Amount is required.'),
//   status: yup.string().required('Status is required.'),
// });

export default deliveryOrderValidationSchema;

// {
//   "expectedDeliveryDate": "2024-05-30T15:37:10.340Z",
//   "orderId": 0,
//   "annotation": "string",
//   "inventoryId": 0,
//   "amount": 0,
//   "status": "ON_PROCESS"
// }
