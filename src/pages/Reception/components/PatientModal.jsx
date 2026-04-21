import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close, 
  Person, 
  Phone, 
  Home as HomeIcon, 
  Cake, 
  Email, 
  Wc, 
  Bloodtype, 
  MedicalServices, 
  Description,
  History,
  AssignmentInd
} from '@mui/icons-material';

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
      <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            setShowEditModal(false);
            setFormErrors({});
          }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-50 flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Branding Section */}
          <div 
            className="hidden md:flex md:w-1/3 p-8 flex-col justify-center items-center text-white text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <AssignmentInd className="text-[200px] -rotate-12 absolute -top-10 -left-10" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                 <AssignmentInd className="text-4xl" />
              </div>
              <h2 className="text-3xl font-black mb-4 leading-tight">
                {currentPatient ? 'تعديل بيانات المريض' : 'إضافة مريض جديد'}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                برجاء التأكد من دقة البيانات الأساسية للمريض لضمان جودة الخدمة الطبية المقدمة وسرعة التواصل.
              </p>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
            <button 
              onClick={() => {
                setShowEditModal(false);
                setFormErrors({});
              }}
              className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
            >
              <Close />
            </button>

            <form
              onSubmit={e => {
                e.preventDefault();
                handlePatientSubmit();
              }}
              className="space-y-6 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-right" dir="rtl">
                
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم المريض الكامل</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                      <Person />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-light)] transition-all ${
                        formErrors.fullName ? 'border-rose-300' : 'border-gray-100 focus:border-[var(--color-primary)]'
                      }`}
                      placeholder="الاسم الثلاثي أو الرباعي..."
                      required
                    />
                  </div>
                  {formErrors.fullName && <p className="text-rose-500 text-xs mt-1 mr-1">{formErrors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">رقم الهاتف</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                      <Phone />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] transition-all ${
                        formErrors.phoneNumber ? 'border-rose-300' : 'border-gray-100'
                      }`}
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                  {formErrors.phoneNumber && <p className="text-rose-500 text-xs mt-1 mr-1">{formErrors.phoneNumber}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">العمر</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                      <Cake />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all ${
                        formErrors.age ? 'border-rose-300' : 'border-gray-100'
                      }`}
                      placeholder="سنة"
                      required
                    />
                  </div>
                  {formErrors.age && <p className="text-rose-500 text-xs mt-1 mr-1">{formErrors.age}</p>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">العنوان</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                      <HomeIcon />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all ${
                        formErrors.address ? 'border-rose-300' : 'border-gray-100'
                      }`}
                      placeholder="المحافظة - المدينة - الشارع..."
                      required
                    />
                  </div>
                  {formErrors.address && <p className="text-rose-500 text-xs mt-1 mr-1">{formErrors.address}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                      <Email />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all"
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">الجنس</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 pointer-events-none">
                      <Wc />
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] appearance-none transition-all"
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">فصيلة الدم</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 pointer-events-none">
                      <Bloodtype />
                    </div>
                    <select
                      name="blood"
                      value={formData.blood}
                      onChange={handleChange}
                      className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] appearance-none transition-all"
                    >
                      <option value="">اختر الفصيلة</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">الأمراض المزمنة</label>
                  <div className="relative">
                    <div className="absolute top-4 right-4 text-gray-400">
                      <MedicalServices />
                    </div>
                    <textarea
                      name="chronic_diseases"
                      value={formData.chronic_diseases}
                      onChange={handleChange}
                      rows="2"
                      className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all"
                      placeholder="أضف الأمراض المزمنة (مثال: السكر، الضغط...)"
                    ></textarea>
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">ملاحظات عامة</label>
                  <div className="relative">
                    <div className="absolute top-4 right-4 text-gray-400">
                      <Description />
                    </div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all"
                      placeholder="أي ملاحظات إضافية عن حالة المريض..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-6 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', boxShadow: '0 10px 20px -5px var(--color-primary-light)' }}
                >
                  <AssignmentInd fontSize="small" />
                  {currentPatient ? 'تحديث البيانات' : 'حفظ المريض'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setFormErrors({});
                  }}
                  className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
