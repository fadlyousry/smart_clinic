import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData, resetForm) => {
  const { phoneNumber } = patientData;
  let newPatient = {};
  const { data: existingPhone } = await supabase
    .from('patients')
    .select('id')
    .eq('phoneNumber', phoneNumber)
    .maybeSingle();

  if (!existingPhone) {
    const { data, error } = await supabase.from('patients').insert(patientData).select().single();
    newPatient = data;
    if (error) {
      console.error('Error adding patient:', error);
    }
  }

  const now = new Date();

  const { error } = await supabase
    .from('appointments')
    .insert([
      {
        date: patientData.bookingDate,
        visitType: patientData.visitType,
        status: 'في الإنتظار',
        doctor_id: 1,
        patient_id: existingPhone?.id || newPatient?.id,
        time: now.toLocaleTimeString(),
      },
    ])
    .select();

  if (error) {
    console.error('Error adding patient:', error);
    showAlert('error', 'حدث خطأ اثناء التسجيل', 'يرجي مراجعة بيناتك واعادة تالمحاولة');
  } else {
    showAlert('success', 'تم حجز الموعد بنجاح', 'سوف تصلك مكالمة لتأكيد الحجز');
    if (typeof resetForm === 'function') resetForm();
  }
};

//-----------------------------------------------------
const showAlert = (icon, title, text) => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: '#0097A7',
    background: '#f8f9fa',
    customClass: {
      container: 'custom-swal-container',
      popup: 'rounded-lg shadow-xl',
    },
  });
};
