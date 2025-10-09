import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';

export const PatientCards = ({ filteredPatients, isTablet, openEditModal, deletePatient }) => (
  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
    {filteredPatients.map(patient => (
      <motion.div
        key={patient.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{patient.fullName}</h3>
            <p className="text-sm text-gray-500">رقم: {patient.id}</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-orange-600 hover:bg-orange-50 transition-colors"
              onClick={() => openEditModal(patient)}
            >
              <Edit />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'تأكيد الحذف',
                  text: 'هل أنت متأكد من حذف هذا المريض؟',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'نعم، احذف',
                  cancelButtonText: 'إلغاء',
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                });
                if (result.isConfirmed) {
                  await deletePatient(patient.id);
                  Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف',
                    text: 'تم حذف المريض بنجاح!',
                    confirmButtonText: 'حسناً',
                    confirmButtonColor: '#3085d6',
                  });
                }
              }}
            >
              <Delete />
            </motion.button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p>العمر: {patient.age}</p>
          <p>رقم الهاتف: {patient.phoneNumber}</p>
          <p>البريد الإلكتروني: {patient.email || '-'}</p>
          {!isTablet && (
            <>
              <p>العنوان: {patient.address || '-'}</p>
              <p>تاريخ اخر زيارة: {patient.bookingDate || '-'}</p>
              <p>نوع الزيارة: {patient.visitType || '-'}</p>
              <p>الأمراض المزمنة: {patient.chronic_diseases ? patient.chronic_diseases.join(', ') : '-'}</p>
              <p>الجنس: {patient.gender || '-'}</p>
              <p>فصيلة الدم: {patient.blood || '-'}</p>
            </>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);
