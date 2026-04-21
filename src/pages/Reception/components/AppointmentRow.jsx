import React from 'react';

import { Delete, Visibility, CheckCircle, Edit, AttachMoney } from '@mui/icons-material';
import Swal from 'sweetalert2';

export const AppointmentRow = ({ 
  appt, 
  index, 
  isMobile, 
  onView, 
  onEdit,
  deleteAppointment, 
  updateAppointment,
  togglePaymentStatus
}) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا الموعد؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      await deleteAppointment(appt.id);
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const handleCheckIn = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحضور',
      text: 'هل وصل المريض إلى العيادة فعلاً؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، وصل',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      await updateAppointment(appt.id, { status: 'في قاعة الانتظار' });
    }
  };

  return (
    <tr
      className="group transition-all duration-300 border-b border-gray-100 opacity-100"
    >
      {!isMobile && (
        <td className="py-4 pr-6">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div 
                  className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
                >
                  <span className="text-white font-black text-lg">{index + 1}</span>
                </div>
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2"
                  style={{ borderColor: 'var(--color-primary)' }}
                ></div>
             </div>
          </div>
        </td>
      )}
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <span className="text-slate-600 font-bold">{appt.patientName?.charAt(0) || 'P'}</span>
          </div>
          <div>
            <p className="font-bold text-gray-800 group-hover:text-[var(--color-primary-dark)] transition-colors">{appt.patientName || 'غير متوفر'}</p>
            <p className="text-xs text-gray-400">{appt.phoneNumber}</p>
          </div>
        </div>
      </td>
      {!isMobile && (
        <td className="py-4">
          <div className="flex items-center gap-2 text-gray-600">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
            >
              <i className="bi bi-person-badge"></i>
            </div>
            <span className="text-sm font-medium">{appt.doctorName || 'غير محدد'}</span>
          </div>
        </td>
      )}
      <td className="py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all ${
          appt.status === 'محجوز'
            ? 'bg-amber-50 text-amber-700 border border-amber-100'
            : appt.status === 'في قاعة الانتظار'
            ? 'bg-blue-50 text-blue-700 border border-blue-100'
            : appt.status === 'ملغى'
            ? 'bg-rose-50 text-rose-700 border border-rose-100'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
             appt.status === 'محجوز' ? 'bg-amber-500' : 
             appt.status === 'في قاعة الانتظار' ? 'bg-blue-500' : 
             appt.status === 'ملغى' ? 'bg-rose-500' : 'bg-emerald-500'
          }`}></div>
          {appt.status || 'غير محدد'}
        </span>
      </td>
      {!isMobile && (
        <td className="py-4">
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'N/A'}
          </span>
        </td>
      )}
      {!isMobile && (
        <td className="py-4">
           <span className="text-xs font-bold text-slate-600">
             {appt.visitType === 'فحص' ? 'كشف' : appt.visitType}
           </span>
        </td>
      )}
      <td className="py-4">
        <span 
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            appt.payment ? 'text-white' : 'bg-slate-100 text-slate-500'
          }`}
          style={appt.payment ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 10px -2px var(--color-primary)' } : {}}
        >
          {appt.payment ? 'PAID' : 'UNPAID'}
        </span>
      </td>
      <td className="py-4 pl-6">
        <div className="flex justify-end items-center gap-2">
          {/* View Button */}
          <button
            onClick={() => onView(appt)}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm border border-blue-100"
            title="عرض التفاصيل"
          >
            <Visibility fontSize="small" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(appt)}
            className="p-2.5 rounded-xl bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] transition-all shadow-sm border border-[var(--color-primary-light)]"
            title="تعديل الحجز"
          >
            <Edit fontSize="small" />
          </button>
          
          {/* Check-in Action */}
          {appt.status === 'محجوز' && (
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 text-white rounded-xl shadow-lg transition-all font-black text-xs h-[42px] hover:brightness-110 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              وصل
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all shadow-sm border border-rose-100"
            title="حذف"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      </td>
    </tr>
  );
};
