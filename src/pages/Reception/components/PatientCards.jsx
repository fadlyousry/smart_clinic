import React from 'react';

import { Edit, Delete, History, Phone, Home as HomeIcon, Cake } from '@mui/icons-material';

export const PatientCards = ({ 
  filteredPatients, 
  isTablet, 
  openEditModal, 
  openRecordModal,
  deletePatient 
}) => (
  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
    {filteredPatients.map(patient => (
      <div
        key={patient.id}
        className="bg-white p-5 rounded-[2rem] shadow-md border border-gray-100 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
              {patient.fullName?.charAt(0) || 'P'}
            </div>
            <div>
              <h3 className="text-base font-black text-gray-800 leading-tight">{patient.fullName}</h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-500">#{patient.id}</span>
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${patient.gender === 'ذكر' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                    {patient.gender || 'غير محدد'}
                 </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="text-gray-300" fontSize="small" />
            <span className="text-sm font-bold">{patient.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Cake className="text-gray-300" fontSize="small" />
            <span className="text-sm font-bold">{patient.age} سنة</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <HomeIcon className="text-gray-300" fontSize="small" />
            <span className="text-sm font-medium truncate">{patient.address || 'العنوان غير مسجل'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50">
          <button
            onClick={() => openEditModal(patient)}
            className="w-12 h-12 bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)] rounded-2xl hover:bg-[var(--color-primary-light)] transition-all shadow-sm border border-[var(--color-primary-light)] flex items-center justify-center"
            title="تعديل"
          >
            <Edit fontSize="small" />
          </button>
          
          <button
            onClick={() => deletePatient(patient.id)}
            className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all shadow-sm border border-rose-100 flex items-center justify-center"
            title="حذف"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      </div>
    ))}
  </div>
);
