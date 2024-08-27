import * as yup from "yup";

export const resetPwdSchema = yup.object().shape({
  oldPassword: yup.string().required("Password Lama Wajib Diisi"),
  newPassword: yup
    .string()
    .required("Password Baru Wajib Diisi")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.,#?!@$%^&*-]).{8,}$/,
      "Password Memiliki Minimal 8 Karakter dan Harus Mengandung Huruf Kapital, Huruf Kecil, Angka, dan Karakter Spesial"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Password Harus Sama")
    .required("Konfirmasi Password Wajib Diisi"),
});
