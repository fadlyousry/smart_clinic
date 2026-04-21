import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close, 
  Event, 
  LocalHospital, 
  Notes, 
  Payment, 
  AccessTime, 
  CheckCircle,
  Schedule,
  Cancel
} from '@mui/icons-material';
import Swal from 'sweetalert2';

export const AppointmentViewModal = ({ show, onClose, appt, updateAppointment }) => {
  if (!appt) return null;

  const handleStatusUpdate = async (newStatus) => {
    const result = await Swal.fire({
      title: 'تغيير الحالة',
      text: `هل أنت متأكد من تغيير حالة الموعد إلى "${newStatus}"؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'تغيير الآن',
      cancelButtonText: 'تراجع',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: '#94a3b8',
    });

    if (result.isConfirmed) {
      try {
        await updateAppointment(appt.id, { status: newStatus });
        Swal.fire({
          icon: 'success',
          title: 'تم التحديث',
          text: `تم تغيير حالة الموعد بنجاح إلى "${newStatus}"`,
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire('خطأ', 'فشل في تحديث الحالة، يرجى المحاولة لاحقاً', 'error');
      }
    }
  };

  const detailItem = (icon, label, value) => (
    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
      <div 
        className="p-3 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
      >
        {icon}
      </div>
      <div className="text-right flex-1">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value || '---'}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden relative z-50 flex flex-col border border-white/20"
          >
            {/* Header */}
            <div 
              className="relative p-8 text-white text-right"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
            >
               <button
                onClick={onClose}
                className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <Close />
              </button>
              
              <div className="flex items-center gap-5 pt-4" dir="rtl">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl font-black shadow-lg border border-white/30">
                  {appt.patientName?.charAt(0) || 'P'}
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-2 leading-tight">{appt.patientName}</h2>
                  <div className="flex items-center gap-3">
                     <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">رقم الدور: {appt.index + 1}</span>
                     <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                     <span className="text-sm font-bold opacity-80">{appt.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 bg-gray-50/50 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
                {detailItem(<Event />, "تاريخ الحجز", appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'غير محدد')}
                {detailItem(<LocalHospital />, "الطبيب المعالج", appt.doctorName)}
                {detailItem(<AccessTime />, "نوع الزيارة", appt.visitType === 'فحص' ? 'كشف' : appt.visitType)}
                {detailItem(<Payment />, "حالة الدفع", appt.payment ? 'مدفوع' : 'غير مدفوع')}
                
                <div className="md:col-span-2">
                  <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Notes fontSize="small" className="text-[var(--color-primary)]" /> ملاحظات إضافية
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      {appt.notes || 'لا توجد ملاحظات مسجلة لهذا الموعد.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Action Section */}
              <div className="mt-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">تحديث الحالة</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      appt.status === 'ملغى' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      الحالة الحالية: {appt.status}
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusUpdate('في قاعة الانتظار')}
                      disabled={appt.status === 'في قاعة الانتظار'}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${
                        appt.status === 'في قاعة الانتظار' 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 opacity-50' 
                        : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <CheckCircle fontSize="small" />
                      <span className="text-[10px] font-black">وصل</span>
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate('محجوز')}
                      disabled={appt.status === 'محجوز'}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${
                        appt.status === 'محجوز' 
                        ? 'bg-amber-50 border-amber-200 text-amber-600 opacity-50' 
                        : 'bg-white border-gray-100 text-gray-600 hover:border-amber-200 hover:bg-amber-50/50'
                      }`}
                    >
                      <Schedule fontSize="small" />
                      <span className="text-[10px] font-black">انتظار</span>
                    </button>

                    <button
                      onClick={() => handleStatusUpdate('ملغى')}
                      disabled={appt.status === 'ملغى'}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${
                        appt.status === 'ملغى' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 opacity-50' 
                        : 'bg-white border-gray-100 text-gray-600 hover:border-rose-200 hover:bg-rose-50/50'
                      }`}
                    >
                      <Cancel fontSize="small" />
                      <span className="text-[10px] font-black">إلغاء</span>
                    </button>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex gap-4" dir="rtl">
               <button onClick={onClose} className="flex-[2] py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all text-lg">إغلاق</button>
               <button
                onClick={() => Swal.fire({ title: 'طباعة التذكرة', text: 'جاري المعالجة...', icon: 'info', confirmButtonColor: 'var(--color-primary)' })}
                className="flex-[3] py-4 text-white font-black rounded-2xl shadow-xl transition-all text-lg"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
              >
                طباعة التذكرة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
