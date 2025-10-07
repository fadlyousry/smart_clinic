import * as yup from "yup";
export const logInAndRegisterSchema = yup.object({
  name: yup
    .string()
    .required("الاسم مطلوب")
    .min(3, "الاسم يجب أن يكون على الأقل 3 أحرف"),
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
  address: yup.string().required("العنوان مطلوب"),
  phone: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(/^\d{11}$/, "رقم الهاتف يجب أن يكون 11 أرقام"),
  // city: yup.string().required("المدينة مطلوبة"),
  // state: yup.string().required("المحافظة مطلوبة"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});
export const ForgetPassword = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
});
export const ResetPassword = yup.object({
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
});
