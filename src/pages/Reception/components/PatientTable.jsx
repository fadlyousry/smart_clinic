import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Delete } from '@mui/icons-material';

export const PatientTable = ({ filteredPatients, isTablet, openEditModal, deletePatient }) => (
  <div className="hidden lg:block overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <tr>
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">رقم</th>
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الإسم</th>
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">العمر</th>
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">رقم الهاتف</th>
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">البريد الإلكتروني</th>
          {!isTablet && (
            <>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">العنوان</th>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">تاريخ اخر زيارة</th>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">نوع الزيارة</th>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الأمراض المزمنة</th>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الجنس</th>
              <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">فصيلة الدم</th>
            </>
          )}
          <th className="px-4 py-3 text-right font-semibold text-cyan-800 text-sm">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {filteredPatients.map(patient => (
          <motion.tr
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.id}</td>
            <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.fullName}</td>
            <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.age}</td>
            <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.phoneNumber}</td>
            <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.email || '-'}</td>
            {!isTablet && (
              <>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.address || '-'}</td>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.bookingDate || '-'}</td>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.visitType || '-'}</td>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">
                  {patient.chronic_diseases ? patient.chronic_diseases.join(', ') : '-'}
                </td>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.gender || '-'}</td>
                <td className="px-4 py-3 text-right text-gray-600 text-sm">{patient.blood || '-'}</td>
              </>
            )}
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
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
                  onClick={() => deletePatient(patient.id)}
                >
                  <Delete />
                </motion.button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);
