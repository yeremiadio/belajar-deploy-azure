import * as yup from 'yup';

const deliveryOrderReservationValidationSchema = yup.object().shape({
  documentId: yup.string().required('Document ID is required.'),
  expectedCheckInDate: yup
    .date()
    .required('Expected Check-In Date is required.'),
  vendorId: yup.number().required('Vendor ID is required.'),
  driverId: yup.number().required('Driver ID is required.'),
  licensePlateId: yup.number().required('License Plate ID is required.'),
  tagId: yup.number().required('Tag ID is required.'),
  orderDeliveryId: yup.number().required('Order Delivery ID is required.'),
  reservationItems: yup.array().of(
    yup.object().shape({
      inventoryId: yup.number().required('Inventory ID is required.'),
      amount: yup.number().required('Amount is required.'),
      unit: yup.string().required('Unit is required.'),
    }),
  ),
});

export default deliveryOrderReservationValidationSchema;

// {
//   "documentId": "string",
//   "expectedCheckInDate": "2024-05-30T15:38:51.600Z",
//   "vendorId": 0,
//   "driverId": 0,
//   "licensePlateId": 0,
//   "tagId": 0,
//   "orderDeliveryId": 0,
//   "reservationItems": [
//     {
//       "inventoryId": 0,
//       "amount": 0,
//       "unit": "string"
//     }
//   ]
// }
