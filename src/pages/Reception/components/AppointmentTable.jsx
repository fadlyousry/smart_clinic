import React from 'react';
import AppointmentItem from './AppointmentItem';

export const AppointmentTable = ({ 
  filteredAppointments, 
  isMobile, 
  isTablet, 
  updateAppointment, 
  deleteAppointment,
  togglePaymentStatus,
  onEdit
}) => {
  return (
    <div className="overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-cyan-50 to-blue-50 sticky top-0 z-10 shadow-sm">
          <tr>
            {!isMobile && <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">رقم الدور</th>}
            <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">اسم المريض</th>
            {!isMobile && <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الطبيب</th>}
            <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الحالة</th>
            {!isMobile && <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">التاريخ</th>}
            {!isMobile && <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">نوع الزيارة</th>}
            <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">حالة الدفع</th>
            <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appt, index) => (
            <AppointmentItem 
              key={appt.id} 
              appt={appt} 
              index={index} 
              updateAppointment={updateAppointment} 
              deleteAppointment={deleteAppointment} 
              togglePaymentStatus={togglePaymentStatus}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
