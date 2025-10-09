import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';

export const PatientModal = ({
  showEditModal,
  setShowEditModal,
  currentPatient,
  formData,
  formErrors,
  handleChange,
  handlePatientSubmit,
  setFormErrors,
}) => (
  <AnimatePresence>
    {showEditModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-xl font-bold text-cyan-800">{currentPatient ? 'تعديل بيانات المريض' : 'إضافة مريض'}</h5>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowEditModal(false);
                setFormErrors({});
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Close />
            </motion.button>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handlePatientSubmit();
            }}
          >
            <div className="grid grid-cols-1 gap-4">
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم المريض
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border ${
                    formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {formErrors.fullName && <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                  العمر
                </label>
                <input
                  type="number"
                  className={`w-full p-3 border ${
                    formErrors.age ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                {formErrors.age && <p className="text-red-600 text-sm mt-1">{formErrors.age}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className={`w-full p-3 border ${
                    formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                {formErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{formErrors.phoneNumber}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className={`w-full p-3 border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border ${
                    formErrors.address ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {formErrors.address && <p className="text-red-600 text-sm mt-1">{formErrors.address}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  تاريخ الحجز
                </label>
                <input
                  type="date"
                  className={`w-full p-3 border ${
                    formErrors.bookingDate ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
                {formErrors.bookingDate && <p className="text-red-600 text-sm mt-1">{formErrors.bookingDate}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label htmlFor="visitType" className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع الزيارة
                </label>
                <select
                  className={`w-full p-3 border ${
                    formErrors.visitType ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="visitType"
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر نوع الزيارة</option>
                  <option value="فحص">فحص</option>
                  <option value="متابعة">متابعة</option>
                  <option value="استشارة">استشارة</option>
                </select>
                {formErrors.visitType && <p className="text-red-600 text-sm mt-1">{formErrors.visitType}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <label htmlFor="chronic_diseases" className="block text-sm font-semibold text-gray-700 mb-2">
                  الأمراض المزمنة
                </label>
                <textarea
                  className={`w-full p-3 border ${
                    formErrors.chronic_diseases ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="chronic_diseases"
                  name="chronic_diseases"
                  rows="3"
                  value={formData.chronic_diseases}
                  onChange={handleChange}
                  placeholder="أضف الأمراض المزمنة مفصولة بفواصل (مثال: السكر, ارتفاع ضغط الدم)..."
                ></textarea>
                {formErrors.chronic_diseases && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.chronic_diseases}</p>
                )}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  الجنس
                </label>
                <select
                  className={`w-full p-3 border ${
                    formErrors.gender ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
                {formErrors.gender && <p className="text-red-600 text-sm mt-1">{formErrors.gender}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                <label htmlFor="blood" className="block text-sm font-semibold text-gray-700 mb-2">
                  فصيلة الدم
                </label>
                <select
                  className={`w-full p-3 border ${
                    formErrors.blood ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="blood"
                  name="blood"
                  value={formData.blood}
                  onChange={handleChange}
                >
                  <option value="">اختر فصيلة الدم</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {formErrors.blood && <p className="text-red-600 text-sm mt-1">{formErrors.blood}</p>}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                  الملاحظات
                </label>
                <textarea
                  className={`w-full p-3 border ${
                    formErrors.notes ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                  id="notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أضف ملاحظات (اختياري)..."
                ></textarea>
                {formErrors.notes && <p className="text-red-600 text-sm mt-1">{formErrors.notes}</p>}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex justify-end gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setFormErrors({});
                  }}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 shadow-md"
                >
                  {currentPatient ? 'تحديث المريض' : 'إضافة المريض'}
                </motion.button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
