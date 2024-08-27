import * as yup from "yup";

const oeeThresholdValidationSchema = yup.object().shape({
  oee: yup.array().of(yup.number().required('OEE must be a number')).required('OEE is required'),
  availability: yup.array().of(yup.number().required('Availability must be a number')).required('Availability is required'),
  performance: yup.array().of(yup.number().required('Performance must be a number')).required('Performance is required'),
  quality: yup.array().of(yup.number().required('Quality must be a number')).required('Quality is required'),
});


export default oeeThresholdValidationSchema;