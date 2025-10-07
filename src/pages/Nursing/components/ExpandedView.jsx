import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { ErrorBoundary } from './ErrorBoundary';
import { EditForm } from './EditForm';

export const ExpandedView = ({
  appt,
  isExpanded,
  isEditing,
  setIsEditing,
  editFormData,
  handleEditChange,
  updateAppointment,
  doctors,
  isMobile,
}) => {
  const handleEditSubmit = async (e, updatedData) => {
    e.preventDefault();
    try {
      await updateAppointment(appt.id, updatedData);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Error updating appointment:', err);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء تحديث الموعد.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan={isMobile ? 4 : 9} className="p-4 bg-gray-50">
            <ErrorBoundary>
              {isEditing ? (
                <EditForm
                  editFormData={editFormData}
                  handleEditChange={handleEditChange}
                  handleEditSubmit={handleEditSubmit}
                  setIsEditing={setIsEditing}
                  doctors={doctors}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">رقم الموعد:</span>
                    <span className="text-gray-800 font-medium">{appt.id || 'غير متوفر'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">اسم المريض:</span>
                    <span className="text-gray-800 font-medium">{appt.patientName || 'غير متوفر'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">الطبيب:</span>
                    <span className="text-gray-800 font-medium">{appt.doctorName || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">الحالة:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appt.status === 'في الإنتظار'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appt.status === 'ملغى'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {appt.status || 'غير محدد'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">التاريخ:</span>
                    <span className="text-gray-800 font-medium">
                      {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">الوقت:</span>
                    <span className="text-gray-800 font-medium">{appt.time || 'غير متوفر'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">نوع الزيارة:</span>
                    <span className="text-gray-800 font-medium">{appt.visitType || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">حالة الدفع:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appt.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appt.payment ? 'مدفوع' : 'غير مدفوع'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700">المبلغ:</span>
                    <span className="text-gray-800 font-medium">
                      {appt.amount ? `${appt.amount} جنيه` : 'غير محدد'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
                  >
                    تعديل الموعد
                  </motion.button>
                </div>
              )}
            </ErrorBoundary>
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  );
};
