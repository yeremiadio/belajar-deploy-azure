import * as yup from 'yup';

export const userResetPasswordValidationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New Password Required')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.,#?!@$%^&*-]).{8,}$/,
      'Passwords Must be At Least 8 Characters Long and Include Uppercase Letters, Lowercase Letters, Numbers, and Special Characters',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords Must Match')
    .required('Confirm Password Required'),
});
