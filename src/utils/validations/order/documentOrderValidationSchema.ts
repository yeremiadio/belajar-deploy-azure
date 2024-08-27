import * as yup from 'yup';

const documentOrderValidationSchema = yup.object().shape({
  label: yup.string().required('Document Label is required.'),
  annotation: yup.string().required('Annotation is required.'),
  file: yup.mixed().required('File is required.'),
});

export default documentOrderValidationSchema;
