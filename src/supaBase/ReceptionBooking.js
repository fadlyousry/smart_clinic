import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const showAlert = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#0097A7',
    background: '#f8f9fa',
    confirmButtonText: 'حسناً',
  });
};

export const addPatient = async (patientData, resetForm) => {
  try {
    if (!supabase) {
      throw new Error('لا يوجد اتصال بقاعدة البيانات');
    }

    const { data, error } = await supabase.from('patients').insert([patientData]).select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'فشل في إضافة المريض');
    }

    showAlert('success', 'تم الحجز بنجاح', `سنقوم بالتواصل معك لتأكيد الموعد. رقم الطلب: ${data[0]?.id}`);

    if (resetForm) resetForm();
    return true;
  } catch (error) {
    console.error('تفاصيل الخطأ:', error);
    let errorMessage = error.message || 'حدث خطأ غير متوقع';

    if (error.code === 'PGRST301') {
      errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
    } else if (error.message.includes('violates not-null constraint')) {
      errorMessage = 'يرجى التأكد من إدخال جميع الحقول المطلوبة';
    }

    showAlert('error', 'خطأ في الحجز', errorMessage);
    return false;
  }
};
