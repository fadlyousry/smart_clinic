import { create } from 'zustand';
import { supabase } from '../supaBase/NursingBooking';
import Swal from 'sweetalert2';

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  error: null,

  fetchAppointments: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          id,
          created_at,
          date,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name),
          visitType
        `
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        set({ error: `فشل في جلب المواعيد: ${error.message}` });
        return;
      }

      const formattedAppointments = data.map(appt => ({
        id: appt.id,
        date: appt.date,
        status: appt.status,
        reason: appt.reason || '',
        payment: appt.payment,
        cancelled: appt.cancelled,
        amount: appt.amount,
        patient_id: appt.patient_id,
        patientName: appt.patients?.fullName || 'غير محدد',
        doctor_id: appt.doctor_id,
        doctorName: appt.doctors?.name || 'غير محدد',
        visitType: appt.visitType || 'غير محدد',
      }));

      set({ appointments: formattedAppointments || [], error: null });
    } catch (err) {
      console.error('Unexpected error fetching appointments:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      set({ error: 'حدث خطأ غير متوقع أثناء جلب المواعيد.' });
    }
  },

  addAppointment: async appointment => {
    try {
      console.log('Inserting appointment:', appointment);
      const newAppointment = {
        date: appointment.date,
        status: appointment.status || 'في الإنتظار',
        reason: appointment.notes || null,
        amount: appointment.amount || null,
        payment: appointment.payment || false,
        cancelled: false,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        visitType: appointment.visitType,
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select(
          `
          id,
          created_at,
          date,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name),
          visitType
        `
        )
        .single();

      if (error) {
        console.error('Error adding appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`فشل في إضافة الموعد: ${error.message}`);
      }

      const formattedNewAppointment = {
        id: data.id,
        date: data.date,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
        visitType: data.visitType || 'غير محدد',
      };

      set(state => ({
        appointments: [...state.appointments, formattedNewAppointment],
        error: null,
      }));

      console.log('Appointment added successfully:', formattedNewAppointment);
    } catch (err) {
      console.error('Unexpected error adding appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      throw err;
    }
  },

  updateAppointment: async (id, updatedData) => {
    try {
      console.log('Updating appointment with ID:', id, 'Data:', updatedData);
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(
          `
          id,
          created_at,
          date,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name),
          visitType
        `
        )
        .single();

      if (error) {
        console.error('Error updating appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في تحديث الموعد: ${error.message}${error.details ? ` - ${error.details}` : ''}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (!data) {
        throw new Error('No data returned from update operation');
      }

      const formattedUpdatedAppointment = {
        id: data.id,
        date: data.date,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
        visitType: data.visitType || 'غير محدد',
      };

      set(state => ({
        appointments: state.appointments.map(appt => (appt.id === id ? formattedUpdatedAppointment : appt)),
        error: null,
      }));

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error updating appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء تحديث الموعد.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  },

  togglePaymentStatus: async (id, currentPaymentStatus) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          payment: !currentPaymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(
          `
          id,
          created_at,
          date,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name),
          visitType
        `
        )
        .single();

      if (error) {
        console.error('Error toggling payment status:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في تحديث حالة الدفع: ${error.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      const formattedUpdatedAppointment = {
        id: data.id,
        date: data.date,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
        visitType: data.visitType || 'غير محدد',
      };

      set(state => ({
        appointments: state.appointments.map(appt => (appt.id === id ? formattedUpdatedAppointment : appt)),
        error: null,
      }));

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: `تم تحديث حالة الدفع إلى ${data.payment ? 'مدفوع' : 'غير مدفوع'}!`,
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error toggling payment status:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء تحديث حالة الدفع.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  },

  toggleCancelledStatus: async (id, currentCancelledStatus) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          cancelled: !currentCancelledStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(
          `
          id,
          created_at,
          date,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name),
          visitType
        `
        )
        .single();

      if (error) {
        console.error('Error toggling cancelled status:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في تحديث حالة الإلغاء: ${error.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      const formattedUpdatedAppointment = {
        id: data.id,
        date: data.date,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
        visitType: data.visitType || 'غير محدد',
      };

      set(state => ({
        appointments: state.appointments.map(appt => (appt.id === id ? formattedUpdatedAppointment : appt)),
        error: null,
      }));

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: `تم تحديث حالة الإلغاء إلى ${data.cancelled ? 'ملغى' : 'غير ملغى'}!`,
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error toggling cancelled status:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء تحديث حالة الإلغاء.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  },

  deleteAppointment: async id => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في حذف الموعد: ${error.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      set(state => ({
        appointments: state.appointments.filter(appt => appt.id !== id),
        error: null,
      }));

      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error deleting appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء حذف الموعد.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  },

  reorderAppointments: async (startIndex, endIndex) => {
    try {
      const { appointments } = get();
      const newAppointments = [...appointments];
      const [reorderedItem] = newAppointments.splice(startIndex, 1);
      newAppointments.splice(endIndex, 0, reorderedItem);

      const updates = newAppointments.map((appt, index) => ({
        id: appt.id,
        created_at: new Date(Date.now() + index * 1000).toISOString(),
        date: appt.date,
        status: appt.status,
        reason: appt.reason || null,
        payment: appt.payment,
        cancelled: appt.cancelled,
        amount: appt.amount,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
        visitType: appt.visitType,
      }));

      const { error } = await supabase.from('appointments').upsert(updates, {
        onConflict: ['id'],
        returning: 'minimal',
      });

      if (error) {
        console.error('Error reordering appointments:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في إعادة ترتيب المواعيد: ${error.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      set({ appointments: newAppointments, error: null });

      Swal.fire({
        icon: 'success',
        title: 'تم إعادة الترتيب',
        text: 'تم إعادة ترتيب المواعيد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Unexpected error reordering appointments:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ غير متوقع أثناء إعادة ترتيب المواعيد.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  },
}));

export default useAppointmentStore;