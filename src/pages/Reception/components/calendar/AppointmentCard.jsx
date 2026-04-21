import React, { memo } from 'react';
import { getDoctorColor, getStatusColor } from '../../utils/calendarHelpers';
import { Visibility, Edit, AccessTime, LocalHospital, AttachMoney } from '@mui/icons-material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * كارت الموعد الموحد - يُستخدم في كل العروض
 * @param {'compact' | 'normal' | 'full'} variant
 */
const AppointmentCard = memo(({ appt, variant = 'normal', onView, onEdit }) => {
  const doctorColor = getDoctorColor(appt.doctor_id);
  const statusColor = getStatusColor(appt.status);
  const time = appt.date ? format(new Date(appt.date), 'hh:mm a', { locale: ar }) : '';

  // ─── Compact: نقطة فقط (للتقويم الشهري) ─────────────────
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold truncate cursor-pointer hover:brightness-95 transition-all"
        style={{ backgroundColor: doctorColor.light, color: doctorColor.bg }}
        onClick={(e) => { e.stopPropagation(); onView?.(appt); }}
        title={`${appt.patientName} — ${appt.doctorName} — ${time}`}
      >
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: statusColor.dot }}></div>
        <span className="truncate">{appt.patientName}</span>
      </div>
    );
  }

  // ─── Normal: كارت متوسط (للعرض الأسبوعي واليومي) ──────────
  if (variant === 'normal') {
    return (
      <div
        className="rounded-xl p-3 border-r-4 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
        style={{ borderRightColor: doctorColor.bg }}
        onClick={() => onView?.(appt)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-sm text-gray-800 truncate">{appt.patientName}</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0"
                style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
              >
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: statusColor.dot }}></div>
                {appt.status}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1" title="الطبيب">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doctorColor.bg }}></div>
                <span className="truncate max-w-[100px]">{appt.doctorName}</span>
              </span>
              <span className="flex items-center gap-0.5" title="الوقت">
                <AccessTime style={{ fontSize: 11 }} />
                {time}
              </span>
              <span className="hidden sm:inline">{appt.visitType === 'فحص' ? 'كشف' : appt.visitType}</span>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <button
                onClick={e => { e.stopPropagation(); onEdit(appt); }}
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] transition-all"
                title="تعديل الموعد"
              >
                <Edit style={{ fontSize: 14 }} />
              </button>
            )}
          </div>
        </div>

        {/* شريط الدفع */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
            appt.payment
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-gray-50 text-gray-400'
          }`}>
            <AttachMoney style={{ fontSize: 10 }} />
            {appt.payment ? `مدفوع${appt.amount ? ` (${appt.amount} ج.م)` : ''}` : 'غير مدفوع'}
          </span>
          {appt.phoneNumber && (
            <span className="text-[10px] text-gray-300 hidden sm:inline">{appt.phoneNumber}</span>
          )}
        </div>
      </div>
    );
  }

  // ─── Full: كارت كامل (للقائمة) ────────────────────────────
  return (
    <div
      className="rounded-2xl p-3 sm:p-4 border-r-4 bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
      style={{ borderRightColor: doctorColor.bg }}
      onClick={() => onView?.(appt)}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0"
            style={{ backgroundColor: doctorColor.bg }}
          >
            {appt.patientName?.charAt(0) || 'P'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 truncate">{appt.patientName}</p>
            <p className="text-xs text-gray-400 truncate">{appt.phoneNumber}</p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0"
          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor.dot }}></div>
          <span className="hidden sm:inline">{appt.status}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
        <div className="bg-gray-50 px-3 py-2 rounded-lg">
          <p className="text-gray-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
            <LocalHospital style={{ fontSize: 10 }} /> الطبيب
          </p>
          <p className="font-bold text-gray-700 flex items-center gap-1 truncate">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doctorColor.bg }}></div>
            <span className="truncate">{appt.doctorName}</span>
          </p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-lg">
          <p className="text-gray-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
            <AccessTime style={{ fontSize: 10 }} /> الموعد
          </p>
          <p className="font-bold text-gray-700">{time}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-lg">
          <p className="text-gray-400 text-[10px] font-bold mb-0.5">نوع الزيارة</p>
          <p className="font-bold text-gray-700">{appt.visitType === 'فحص' ? 'كشف' : appt.visitType}</p>
        </div>
        <div className="bg-gray-50 px-3 py-2 rounded-lg">
          <p className="text-gray-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
            <AttachMoney style={{ fontSize: 10 }} /> الدفع
          </p>
          <p className={`font-bold ${appt.payment ? 'text-emerald-600' : 'text-gray-400'}`}>
            {appt.payment ? `${appt.amount || 0} ج.م` : 'لم يدفع'}
          </p>
        </div>
      </div>

      {/* أزرار */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onView?.(appt); }}
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1"
        >
          <Visibility style={{ fontSize: 14 }} /> عرض
        </button>
        {onEdit && (
          <button
            onClick={e => { e.stopPropagation(); onEdit(appt); }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
          >
            <Edit style={{ fontSize: 14 }} /> تعديل
          </button>
        )}
      </div>
    </div>
  );
});

AppointmentCard.displayName = 'AppointmentCard';

export default AppointmentCard;
