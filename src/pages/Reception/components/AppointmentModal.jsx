import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close, 
  Phone, 
  Person, 
  Home as HomeIcon, 
  Cake, 
  Event, 
  LocalHospital, 
  MedicalServices, 
  AttachMoney, 
  Description, 
  CheckCircle,
  Search
} from '@mui/icons-material';
import * as Yup from 'yup';
import { Schema } from '../receptionBookingSchema';
import Swal from 'sweetalert2';
import useAppointmentStore from '../../../store/appointmentStore';
import { supabase } from '../../../supaBase/ReceptionBooking';

export const AppointmentModal = ({
  showModal,
  setShowModal,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  doctors,
  editData,
}) => {
  const { addAppointment, updateAppointment } = useAppointmentStore();
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isExistingPatient, setIsExistingPatient] = useState(false);

  const normalizeArabic = (str) => {
    if (!str) return '';
    return str
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (editData) {
      // Normalize and map legacy or variant names
      let visitType = editData.visitType || '';
      const normalized = normalizeArabic(visitType);
      
      if (normalized === normalizeArabic('فحص')) visitType = 'كشف';
      else if (normalized === normalizeArabic('استشارة')) visitType = 'استشارة';
      else if (normalized === normalizeArabic('متابعة')) visitType = 'متابعة';
      
      setFormData({
        fullName: editData.patientName || '',
        address: editData.address || '',
        age: editData.age || '',
        phoneNumber: editData.phoneNumber || '',
        visitType: visitType,
        notes: editData.reason || '',
        doctor_id: editData.doctor_id || '',
        appointmentDateTime: formatDateTime(editData.date),
        status: editData.status || 'في الإنتظار',
        amount: editData.amount || null,
        payment: editData.payment || false,
        patient_id: editData.patient_id || null,
      });
      setIsExistingPatient(!!editData.patient_id);
    }
  }, [editData, setFormData]);

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, fullName: value }));
    setFormErrors(prev => ({ ...prev, fullName: '' }));
    
    if (value.length > 2) {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('fullName', `%${value}%`)
        .limit(5);
      
      if (!error && data) {
        setSearchResults(data);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      fullName: patient.fullName,
      phoneNumber: patient.phoneNumber,
      address: patient.address || '',
      age: patient.age ? String(patient.age) : '',
      patient_id: patient.id
    }));
    setIsExistingPatient(true);
    setSearchResults([]);
    setIsSearching(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'doctor_id' && {
        amount: doctors.find(d => String(d.id) === value)?.fees || null,
      }),
      // If they change phone/name manually after selecting, clear the patient_link
      ...((name === 'fullName' || name === 'phoneNumber') && { patient_id: null })
    }));
    if (name === 'phoneNumber') setIsExistingPatient(false);
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await Schema.validate(formData, { abortEarly: false });

      const date = formData.appointmentDateTime;
      let patientId = formData.patient_id;

      if (!patientId) {
        // Double check by phone if not linked
        const { data: existingPatient } = await supabase
          .from('patients')
          .select('id')
          .eq('phoneNumber', formData.phoneNumber)
          .single();

        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          const patientData = {
            fullName: formData.fullName,
            address: formData.address,
            age: parseInt(formData.age) || 0,
            phoneNumber: formData.phoneNumber,
            bookingDate: date,
            visitType: formData.visitType,
          };
          const { data: newPatient, error: insertError } = await supabase
            .from('patients')
            .insert([patientData])
            .select('id')
            .single();

          if (insertError) throw new Error(`فشل في إضافة المريض: ${insertError.message}`);
          patientId = newPatient.id;
        }
      }

      const appointmentData = {
        patient_id: patientId,
        doctor_id: parseInt(formData.doctor_id),
        date,
        visitType: formData.visitType,
        status: formData.status,
        payment: formData.payment,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        reason: formData.notes || null, // In DB it's 'reason', in form it's 'notes'
      };

      if (editData) {
        await updateAppointment(editData.id, appointmentData);
      } else {
        await addAppointment(appointmentData);
      }

      setShowModal(false);
      setFormData({
        fullName: '',
        address: '',
        age: '',
        phoneNumber: '',
        visitType: '',
        notes: '',
        doctor_id: '',
        appointmentDateTime: '',
        status: 'في الإنتظار',
        amount: null,
        payment: false,
      });
      setIsExistingPatient(false);
      setFormErrors({});
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: 'تم إضافة الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: 'var(--color-primary)',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: err.message || 'حدث خطأ غير متوقع.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-50 flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Branding Section */}
            <div 
              className="hidden md:flex md:w-1/3 p-8 flex-col justify-center items-center text-white text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <MedicalServices className="text-[200px] -rotate-12 absolute -top-10 -left-10" />
              </div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                   <LocalHospital className="text-4xl" />
                </div>
                <h2 className="text-3xl font-black mb-4 leading-tight">حجز موعد جديد</h2>
                <p className="text-white/80 text-sm leading-relaxed">يرجى تسجيل بيانات المريض بعناية لضمان متابعة طبية دقيقة وتجربة انتظار مميزة.</p>
                
                {isExistingPatient && (
                  <div className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center justify-center gap-2 mb-2 text-emerald-300">
                      <CheckCircle fontSize="small" />
                      <span className="font-bold text-sm">مريض سابق</span>
                    </div>
                    <p className="text-[10px] text-white/70">تم التعرف على المريض وربط بياناته بسجله القديم.</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Form Section */}
            <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
              >
                <Close />
              </button>

              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-right" dir="rtl">
                  
                  {/* Name Input with Autocomplete */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم المريض</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)]">
                        <Person />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleNameChange}
                        className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-light)] transition-all ${
                          formErrors.fullName ? 'border-rose-300' : 'border-gray-100 focus:border-[var(--color-primary)]'
                        }`}
                        placeholder="الاسم الثلاثي المريض..."
                      />
                      
                      <AnimatePresence>
                        {isSearching && searchResults.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                          >
                             {searchResults.map(p => (
                               <button
                                 key={p.id}
                                 type="button"
                                 onClick={() => selectPatient(p)}
                                 className="w-full p-4 flex items-center gap-4 hover:bg-[var(--color-primary-light)] transition-colors text-right border-b border-gray-50 last:border-0"
                               >
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[var(--color-primary)]">
                                     <Person />
                                  </div>
                                  <div className="flex-1">
                                     <p className="font-bold text-gray-800 text-sm">{p.fullName}</p>
                                     <p className="text-xs text-gray-400">{p.phoneNumber}</p>
                                  </div>
                                  <Search className="text-gray-300" fontSize="small" />
                               </button>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {formErrors.fullName && <p className="text-rose-500 text-xs mt-1 mr-1">{formErrors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">رقم الهاتف</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                        <Phone />
                      </div>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-light)] transition-all ${
                          formErrors.phoneNumber ? 'border-rose-300' : 'border-gray-100'
                        }`}
                        placeholder="01XXXXXXXXX"
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
                        onChange={handleInputChange}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all"
                        placeholder="سنة"
                      />
                    </div>
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
                        onChange={handleInputChange}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all"
                        placeholder="أدخل عنوان السكن بالتفصيل..."
                      />
                    </div>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">الطبيب</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 pointer-events-none">
                        <LocalHospital />
                      </div>
                      <select
                        name="doctor_id"
                        value={formData.doctor_id}
                        onChange={handleInputChange}
                        className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none appearance-none transition-all ${
                          formErrors.doctor_id ? 'border-rose-300' : 'border-gray-100 focus:border-[var(--color-primary)]'
                        }`}
                      >
                        <option value="">اختار الطبيب</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">وقت الموعد</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
                        <Event />
                      </div>
                      <input
                        type="datetime-local"
                        name="appointmentDateTime"
                        value={formData.appointmentDateTime}
                        onChange={handleInputChange}
                        className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
                          formErrors.appointmentDateTime ? 'border-rose-300' : 'border-gray-100 focus:border-[var(--color-primary)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Visit Type */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">نوع الزيارة</label>
                    <div className="flex gap-2">
                       {['كشف', 'استشارة', 'متابعة'].map(type => (
                         <button
                           key={type}
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, visitType: type }))}
                           className={`flex-1 py-3 text-xs font-bold rounded-xl border-2 transition-all ${
                             formData.visitType === type 
                               ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg' 
                               : 'border-gray-100 bg-gray-50 text-gray-400'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">المبلغ المطلوب</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--color-primary-dark)] font-bold">L.E</div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount || ''}
                        onChange={handleInputChange}
                        className="w-full pr-4 pl-12 py-3.5 bg-gray-100 border-2 border-gray-100 rounded-2xl focus:outline-none font-black"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="md:col-span-2 py-4 bg-gray-50 px-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${formData.payment ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-gray-200 text-gray-400'}`}>
                          <AttachMoney />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-700">تأكيد الدفع</p>
                          <p className="text-[10px] text-gray-400">{formData.payment ? 'المريض دفع الرسوم نقداً' : 'لم يتم التحصيل بعد'}</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="payment"
                        checked={formData.payment}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg active:scale-95"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', boxShadow: '0 10px 20px -5px var(--color-primary-light)' }}
                  >
                    {loading ? (
                       <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Event fontSize="small" />
                        {editData ? 'تحديث الحجز' : 'حفظ الموعد'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
};
