import * as yup from 'yup';

const gatewayValidationSchema = yup.object().shape({
  name: yup.string().required('Gateway Name is required'),
  moduleId: yup.number().required('Theme is required'),
  companyId: yup.number().required('Company is required'),
  locationId: yup.number().required('Location is required'),
});

export default gatewayValidationSchema;
