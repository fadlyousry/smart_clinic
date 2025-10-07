import React from 'react';
import { motion } from 'framer-motion';
import AppointmentItem from './AppointmentItem';

export const AppointmentTable = ({ filteredAppointments, isMobile, isTablet, reorderAppointments }) => {
  const moveAppointment = (fromIndex, toIndex) => {
    const updatedAppointments = [...filteredAppointments];
    const [movedItem] = updatedAppointments.splice(fromIndex, 1);
    updatedAppointments.splice(toIndex, 0, movedItem);
    reorderAppointments(updatedAppointments);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
          <tr>
            {!isMobile && <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">رقم</th>}
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
            <AppointmentItem key={appt.id} appt={appt} index={index} moveAppointment={moveAppointment} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
