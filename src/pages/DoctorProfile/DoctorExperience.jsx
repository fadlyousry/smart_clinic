import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaPlus, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperiencesStore } from '../../store/experiences';

const DoctorExperience = ({ editMode, variants, cardVariants, experiences, setExperiences }) => {
  const { getAllExperiences, allExperiences, addExperience, deleteExperience } = useExperiencesStore();
  const [expandedExperiences, setExpandedExperiences] = useState([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    position: '',
    hospital: '',
    period: '',
    description: '',
  });

  useEffect(() => {
    getAllExperiences();
  }, []);

  const toggleExperience = id => {
    setExpandedExperiences(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const addAnotherExperience = () => {
    if (newExperience.position.trim()) {
      const updatedExperiences = [...allExperiences, { ...newExperience, id: Date.now() }];
      setExperiences(updatedExperiences);
      addExperience(newExperience);
      setNewExperience({ position: '', hospital: '', period: '', description: '' });
      setShowExperienceForm(false);
    }
  };

  const removeExperience = id => {
    deleteExperience(id);
    setExperiences(allExperiences.filter(exp => exp.id !== id));
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
          <FaBriefcase /> الخبرات العملية
        </h3>
        {editMode && (
          <motion.button
            className="flex items-center gap-1 px-4 py-2 bg-[#0097A7] text-white rounded-lg hover:bg-[#006064] transition-colors"
            onClick={() => setShowExperienceForm(!showExperienceForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> {showExperienceForm ? 'إلغاء' : 'إضافة خبرة'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showExperienceForm && (
          <motion.div
            className="bg-[#E0F7FA] p-4 rounded-lg mb-6"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">المسمى الوظيفي:</label>
              <input
                type="text"
                value={newExperience.position}
                onChange={e => setNewExperience({ ...newExperience, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: استشاري القلب"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">اسم المستشفى/المؤسسة:</label>
              <input
                type="text"
                value={newExperience.hospital}
                onChange={e => setNewExperience({ ...newExperience, hospital: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: مستشفى القاهرة الجديدة"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">الفترة الزمنية:</label>
              <input
                type="text"
                value={newExperience.period}
                onChange={e => setNewExperience({ ...newExperience, period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7]"
                placeholder="مثال: 2020 - حتى الآن"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">وصف الخبرة:</label>
              <textarea
                value={newExperience.description}
                onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0097A7] focus:border-[#0097A7] min-h-[100px]"
                placeholder="وصف مختصر للمهام والمسؤوليات"
              />
            </div>
            <motion.button
              className="w-full py-2 bg-gradient-to-r from-[#0097A7] to-[#006064] text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={addAnotherExperience}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              حفظ الخبرة
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {allExperiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="bg-[#E0F7FA] p-4 rounded-lg border border-gray-200"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover="hover"
          >
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExperience(exp.id)}>
              <h4 className="font-semibold text-[#006064]">{exp.position}</h4>
              <div className="flex items-center gap-2">
                {editMode && (
                  <motion.button
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={e => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                )}
                <motion.button
                  className="text-[#0097A7] hover:text-[#006064] transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {expandedExperiences.includes(exp.id) ? <FaChevronUp /> : <FaChevronDown />}
                </motion.button>
              </div>
            </div>
            <p className="text-[#0097A7] mt-1">
              {exp.hospital} | {exp.period}
            </p>

            <AnimatePresence>
              {expandedExperiences.includes(exp.id) && (
                <motion.div
                  className="pt-3 mt-3 border-t border-gray-200"
                  variants={expandVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <p className="text-gray-700">{exp.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DoctorExperience;
