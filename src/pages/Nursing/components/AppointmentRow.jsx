import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';

export const AppointmentRow = ({ appt, index, isDragging, drag, drop, isMobile, setIsExpanded, deleteAppointment }) => {
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

  return (
    <motion.tr
      ref={node => drag(drop(node))}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.01,
        backgroundColor: 'rgba(236, 253, 245, 0.5)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 bg-gray-100 shadow-lg' : 'opacity-100 hover:bg-gray-50'
      }`}
    >
      {!isMobile && (
        <td className="cursor-move py-4">
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="inline-block">
            <i className="bi bi-grip-vertical me-2 text-gray-400"></i>
          </motion.div>
          <span className="font-medium bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm">{index + 1}</span>
        </td>
      )}
      <td className="py-4">
        <motion.div whileHover={{ x: -3 }} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <span className="text-blue-800 font-medium text-sm">{appt.patientName?.charAt(0) || 'N/A'}</span>
          </div>
          <span className="font-medium text-gray-800">{appt.patientName || 'غير متوفر'}</span>
        </motion.div>
      </td>
      {!isMobile && (
        <td className="py-4">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="badge bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1"
          >
            <i className="bi bi-heart-pulse text-blue-500"></i>
            {appt.doctorName || 'غير محدد'}
          </motion.span>
        </td>
      )}
      <td className="py-4">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`badge px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1 ${
            appt.status === 'في الإنتظار'
              ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800'
              : appt.status === 'ملغى'
              ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
              : 'bg-gradient-to-br from-green-50 to-green-100 text-green-800'
          }`}
        >
          <i
            className={`bi bi-${
              appt.status === 'في الإنتظار' ? 'clock' : appt.status === 'ملغى' ? 'x-circle' : 'check-circle'
            }`}
          ></i>
          {appt.status || 'غير محدد'}
        </motion.span>
      </td>
      {!isMobile && (
        <td className="py-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'غير متوفر'}
            </span>
          </motion.div>
        </td>
      )}
      {!isMobile && (
        <td className="py-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {appt.visitType || 'غير محدد'}
            </span>
          </motion.div>
        </td>
      )}
      <td className="py-4">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`badge px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1 ${
            appt.payment
              ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-800'
              : 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
          }`}
        >
          <i className={`bi bi-${appt.payment ? 'check-circle' : 'x-circle'}`}></i>
          {appt.payment ? 'مدفوع' : 'غير مدفوع'}
        </motion.span>
      </td>
      <td className="py-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Visibility fontSize="small" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="btn btn-sm bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm flex items-center gap-1"
          >
            <Delete fontSize="small" />
            {isMobile ? '' : 'حذف'}
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};
