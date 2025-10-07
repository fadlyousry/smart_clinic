import React from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export const EditForm = ({ editFormData, handleEditChange, handleEditSubmit, setIsEditing, doctors }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      const [date, time] = editFormData.appointmentDateTime.split('T');
      const updatedData = {
        date,
        time,
        status: editFormData.status,
        visitType: editFormData.visitType || null,
        payment: editFormData.payment,
        amount: editFormData.amount ? parseFloat(editFormData.amount) : null,
        doctor_id: editFormData.doctor_id || null,
      };
      handleEditSubmit(e, updatedData);
    }}
    className="grid grid-cols-1 gap-4"
  >
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">التاريخ والوقت</label>
      <input
        type="datetime-local"
        name="appointmentDateTime"
        value={editFormData.appointmentDateTime}
        onChange={handleEditChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">الطبيب</label>
      <select
        name="doctor_id"
        value={editFormData.doctor_id}
        onChange={handleEditChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      >
        <option value="">اختر الطبيب</option>
        {doctors.map(doctor => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name} (رسوم: {doctor.fees} جنيه)
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
      <select
        name="status"
        value={editFormData.status}
        onChange={handleEditChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      >
        <option value="في الإنتظار">في الإنتظار</option>
        <option value="ملغى">ملغى</option>
        <option value="تم">تم</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الزيارة</label>
      <select
        name="visitType"
        value={editFormData.visitType}
        onChange={handleEditChange}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      >
        <option value="">اختر نوع الزيارة</option>
        <option value="فحص">فحص</option>
        <option value="متابعة">متابعة</option>
        <option value="استشارة">استشارة</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">حالة الدفع</label>
      <input
        type="checkbox"
        name="payment"
        checked={editFormData.payment}
        onChange={handleEditChange}
        className="p-3 border border-gray-300 rounded-lg"
      />
      <span className="ml-2">{editFormData.payment ? 'مدفوع' : 'غير مدفوع'}</span>
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">المبلغ</label>
      <input
        type="number"
        name="amount"
        value={editFormData.amount ?? ''}
        readOnly
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
      />
    </div>
    <div className="flex justify-end gap-3">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setIsEditing(false)}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
      >
        إلغاء
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
      >
        حفظ التغييرات
      </motion.button>
    </div>
  </form>
);
