import * as yup from "yup";

const deviceValidationSchema = yup.object().shape({
  name: yup.string().required('Device Name is required'),
  devicetypeId: yup.number().required('Device Type is required'),
  companyId: yup.number().required('Company is required'),
  gatewayId: yup.number().required('Gateway is required'),
  locationId: yup.number(),
});

export default deviceValidationSchema;