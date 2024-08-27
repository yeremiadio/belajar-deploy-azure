import * as yup from 'yup';

const userProfileValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid Email').required('Email is Required'),
  username: yup.string().required('Username is Required'),
  firstname: yup.string().required('First Name is Required'),
  lastname: yup.string().optional(),
  phonenumber: yup
    .string()
    .required('Phone Number is Required')
    .min(10, 'Invalid Phone Number')
    .test('isNumber', 'Invalid Phone Number', (value) => {
      if (!value) return true;
      return /^\d+$/.test(value);
    }),
});

export default userProfileValidationSchema;
