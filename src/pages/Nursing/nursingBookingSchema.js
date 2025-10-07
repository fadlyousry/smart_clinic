import * as Yup from 'yup';
import { addPatient } from '../../supaBase/NursingBooking';

export const Schema = Yup.object({
  fullName: Yup.string().required('الاسم مطلوب').min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  address: Yup.string().required('العنوان مطلوب').min(3, 'برجاء إدخال اسم المحافظة على الأقل'),
  age: Yup.number().required('العمر مطلوب').min(1, 'برجاء إدخال عمر صحيح').max(120, 'العمر لا يزيد عن 120'),
  phoneNumber: Yup.string()
    .required('رقم الهاتف مطلوب')
    .matches(/^01[0125][0-9]{8}$/, 'برجاء إدخال رقم هاتف صحيح'),
  appointmentDateTime: Yup.date().required('تاريخ الموعد مطلوب').typeError('تاريخ الموعد غير صالح'),
  visitType: Yup.string().required('نوع الزيارة مطلوب'),
  notes: Yup.string().max(700, 'الملاحظات لا يجب أن تتجاوز 700 حرف').nullable(),
  amount: Yup.number()
    .nullable()
    .min(1, 'المبلغ يجب أن يكون أكبر من 0')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  chronic_diseases: Yup.array()
    .of(Yup.string().max(100, 'كل مرض مزمن يجب ألا يتجاوز 100 حرف'))
    .nullable()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return originalValue
          ? originalValue
              .split(',')
              .map(item => item.trim())
              .filter(item => item)
          : null;
      }
      return value;
    }),
  gender: Yup.string().oneOf(['ذكر', 'أنثى', ''], 'الجنس يجب أن يكون ذكر أو أنثى').nullable(),
  email: Yup.string().email('برجاء إدخال بريد إلكتروني صحيح').nullable(),
  blood: Yup.string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''], 'برجاء اختيار فصيلة دم صحيحة')
    .nullable(),
});

export const formData = {
  fullName: '',
  address: '',
  age: '',
  phoneNumber: '',
  appointmentDateTime: '',
  visitType: '',
  notes: '',
  amount: null,
  chronic_diseases: [],
  gender: '',
  email: '',
  blood: '',
};

export const handleSubmit = (values, { resetForm }) => {
  console.log('Booking submitted:', values);
  const date = values.appointmentDateTime;
  const patientData = {
    ...values,
    bookingDate: date,
  };
  addPatient(patientData, resetForm);
};
