import React, { useState, useRef, useEffect } from 'react';
import { FaGraduationCap, FaPlus, FaCamera, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { useDoctorCertificatesStore } from '../../store/certificateion';

const DoctorCertificates = ({ editMode, setExpandedImage, variants, cardVariants, certificates, setCertificates }) => {
  const { fetchCertificates, allCertificates, deleteCertificate, addCertificate } = useDoctorCertificatesStore();
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    institution: '',
    year: '',
    image: null,
  });
  const certificateInputRef = useRef(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const imageData = event.target.result;

        if (field === 'newCertificate') {
          setNewCertificate({ ...newCertificate, image: imageData });
        } else {
          setCertificates(allCertificates.map(cert => (cert.id === field ? { ...cert, image: imageData } : cert)));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addAnotherCertificate = () => {
    if (newCertificate.name.trim()) {
      const updatedCertificates = [...allCertificates, { ...newCertificate, id: Date.now() }];
      setCertificates(updatedCertificates);
      addCertificate(newCertificate);
      setNewCertificate({ name: '', institution: '', year: '', image: null });
      setShowCertificateForm(false);
      if (certificateInputRef.current) {
        certificateInputRef.current.value = '';
      }
    }
  };

  const removeCertificate = id => {
    deleteCertificate(id);
    setCertificates(allCertificates.filter(cert => cert.id !== id));
  };

  const expandVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="border-t border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-[#0097A7] flex items-center gap-2">
          <FaGraduationCap /> الشهادات والمؤهلات
        </h3>
        {editMode && (
          <motion.button
            className="flex items-center gap-1 px-4 py-2 bg-[#0097A7] text-white rounded-lg hover:bg-[#006064] transition-colors"
            onClick={() => setShowCertificateForm(!showCertificateForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> {showCertificateForm ? 'إلغاء' : 'إضافة شهادة'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showCertificateForm && (
          <motion.div
            className="bg-[#E0F7FA] p-4 rounded-lg mb-6"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">اسم الشهادة:</label>
              <input
                type="text"
                value={newCertificate.name}
                onChange={e => setNewCertificate({ ...newCertificate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: دكتوراه في أمراض القلب"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">اسم المؤسسة:</label>
              <input
                type="text"
                value={newCertificate.institution}
                onChange={e => setNewCertificate({ ...newCertificate, institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: جامعة القاهرة"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">سنة الحصول:</label>
              <input
                type="text"
                value={newCertificate.year}
                onChange={e => setNewCertificate({ ...newCertificate, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: 2015"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">صورة الشهادة:</label>
              <motion.label
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0097A7] to-[#006064] text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-max"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCamera /> {newCertificate.image ? 'تغيير الصورة' : 'اختر صورة'}
                <input
                  type="file"
                  ref={certificateInputRef}
                  onChange={e => handleImageUpload(e, 'newCertificate')}
                  accept="image/*"
                  className="hidden"
                />
              </motion.label>
              {newCertificate.image && (
                <div className="mt-3 text-center">
                  <motion.img
                    src={newCertificate.image}
                    alt="معاينة صورة الشهادة"
                    className="max-w-full max-h-40 rounded border border-gray-300 cursor-pointer mx-auto"
                    onClick={() => setExpandedImage(newCertificate.image)}
                    whileHover={{ scale: 1.02 }}
                  />
                </div>
              )}
            </div>
            <motion.button
              className="w-full py-2 bg-gradient-to-r from-[#0097A7] to-[#006064] text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={addAnotherCertificate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              حفظ الشهادة
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCertificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="bg-[#E0F7FA] p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover="hover"
          >
            <div className="flex gap-4">
              {cert.image ? (
                <motion.div
                  className="w-24 h-24 rounded overflow-hidden border border-gray-200 cursor-pointer flex-shrink-0"
                  onClick={() => setExpandedImage(cert.image)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-[#0097A7] to-[#006064] rounded flex items-center justify-center text-white flex-shrink-0">
                  <FaGraduationCap className="text-3xl" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 text-sm truncate">{cert.institution}</span>
                  <span className="text-[#0097A7] font-medium">{cert.year}</span>
                </div>
                {editMode && (
                  <div className="flex justify-between items-center mt-3">
                    <motion.label
                      className="text-[#0097A7] hover:text-[#006064] cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    ></motion.label>
                    <motion.button
                      className="text-red-500 hover:text-red-700"
                      onClick={e => {
                        e.stopPropagation();
                        removeCertificate(cert.id);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorCertificates;
