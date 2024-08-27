import * as yup from 'yup';

export const userForgotPasswordValidationSchema = yup.object().shape({
  username: yup.string().required('Username Required'),
});
