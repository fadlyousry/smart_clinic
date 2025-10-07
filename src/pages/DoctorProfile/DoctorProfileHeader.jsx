import React from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { useProfileStore } from '../../store/profile';
import { motion } from 'framer-motion';

const DoctorProfileHeader = ({ editMode, setEditMode, variants }) => {
  const { updateProfileData, changedProfileData } = useProfileStore();

  return (
    <motion.div
      className="flex justify-between items-center mb-8 p-6 rounded-xl bg-gradient-to-r from-[#0097A7] to-[#006064] text-white shadow-lg"
      variants={variants}
    >
      <h1 className="text-2xl font-bold">البروفايل الطبي</h1>
      <div className="flex gap-4">
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg ${editMode ? 'bg-white text-[#0097A7] hover:bg-gray-100' : 'bg-[#006064] hover:bg-[#00838F]'
            } font-medium transition-all hover:shadow-md`}
          onClick={() => {
            if (editMode) {
              delete changedProfileData.image;
              updateProfileData(changedProfileData);
            }
            setEditMode(!editMode);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {editMode ? (
            <>
              <FaSave /> حفظ التغييرات
            </>
          ) : (
            <>
              <FaEdit /> تعديل البروفايل
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorProfileHeader;