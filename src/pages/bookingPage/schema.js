import * as Yup from 'yup';
import { addPatient } from '../../supaBase/booking';

export const Schema = Yup.object({
  fullName: Yup.string().required('الاسم مطلوب').min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  address: Yup.string().required('العنوان مطلوب').min(3, 'برجاء دخال اسم المحافظة على الأقل'),
  age: Yup.number().required('العمر مطلوب').min(1, 'برجاء دخال عمر صحيح').max(120, 'العمر لا يزيد عن 120'),
  phoneNumber: Yup.string()
    .required('رقم الهاتف مطلوب')
    .matches(/^01[0125][0-9]{8}$/, 'برجاء دخال رقم هاتف صحيح'),
  bookingDate: Yup.string().required('تاريخ الحجز مطلوب'),
  visitType: Yup.string().required('نوع الزيارة مطلوب'),
  notes: Yup.string().max(700, 'الملاحظات لا يجب أن تتجاوز 700 حرف'),
});

export const formData = {
  fullName: '',
  address: '',
  age: '',
  phoneNumber: '',
  bookingDate: '',
  visitType: '',
  notes: '',
};

export const handleSubmit = (values, { resetForm }) => {
  console.log('Booking submitted:', values);
  addPatient(values, resetForm);
};
