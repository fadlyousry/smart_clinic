import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DoctorProfileHeader from './DoctorProfileHeader';
import DoctorProfileInfo from './DoctorProfileInfo';
import DoctorExperience from './DoctorExperience';
import DoctorCertificates from './DoctorCertificates';
import ExpandedImageView from './ExpandedImageView';
import './DoctorProfile.css';

const DoctorProfile = ({ isDoctorView = false }) => {
  const loadData = () => {
    const savedData = localStorage.getItem('doctorProfileData');
    if (!savedData) return null;

    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Failed to parse saved data:', error);
      return null;
    }
  };

  const initialData = {
    experiences: [
      // {
      //   id: 1,
      //   position: 'ستشاري القلب والأوعية الدموية',
      //   hospital: 'مستشفى القاهرة الجديدة',
      //   period: '2020 - حتى الآن',
      //   description: 'تشخيص وعلاج حالات القلب المعقدة وإجراء القسطرة القلبية',
      // },
    ],
    certificates: [
      // {
      //   id: 1,
      //   name: 'دكتوراه في أمراض القلب',
      //   institution: 'جامعة القاهرة',
      //   year: '2014',
      //   image: null,
      // },
    ],
  };

  const savedData = loadData();
  const [experiences, setExperiences] = useState(savedData?.experiences || initialData.experiences);
  const [certificates, setCertificates] = useState(savedData?.certificates || initialData.certificates);
  const [editMode, setEditMode] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const dataToSave = {
      experiences,
      certificates,
    };
    localStorage.setItem('doctorProfileData', JSON.stringify(dataToSave));
  }, [experiences, certificates]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div
      className="w-full mx-auto px-8 sm:px-10 lg:px-25 py-8 min-h-screen bg-[#E0F7FA]"
      style={{
        direction: 'rtl',
        fontFamily: "'Tajawal', sans-serif",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isDoctorView ? (
        <DoctorProfileHeader editMode={editMode} setEditMode={setEditMode} variants={itemVariants} />
      ) : (
        <motion.div
          className="flex justify-between items-center mb-8 p-6 rounded-xl bg-gradient-to-r from-[#0097A7] to-[#006064] text-white shadow-lg"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold">البروفايل الطبي</h1>
        </motion.div>
      )}

      <div className="grid grid-cols-1">
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <DoctorProfileInfo editMode={isDoctorView && editMode} variants={itemVariants} />
          <DoctorExperience
            experiences={experiences}
            setExperiences={isDoctorView ? setExperiences : null}
            editMode={isDoctorView && editMode}
            variants={itemVariants}
            cardVariants={cardVariants}
          />
          <DoctorCertificates
            certificates={certificates}
            setCertificates={isDoctorView ? setCertificates : null}
            editMode={isDoctorView && editMode}
            setExpandedImage={setExpandedImage}
            variants={itemVariants}
            cardVariants={cardVariants}
          />
        </motion.div>
      </div>

      <ExpandedImageView expandedImage={expandedImage} setExpandedImage={setExpandedImage} />
    </motion.div>
  );
};

export default DoctorProfile;
