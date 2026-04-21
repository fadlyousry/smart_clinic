import React from 'react';

import { Edit, Delete, History } from '@mui/icons-material';

export const PatientTable = ({ 
  filteredPatients, 
  isTablet, 
  openEditModal, 
  openRecordModal,
  deletePatient 
}) => (
  <div className="overflow-x-auto relative">
    <table className="w-full border-collapse">
      <thead className="bg-[var(--color-primary-light)] sticky top-0 z-10 shadow-sm">
        <tr>
          <th className="px-5 py-4 text-right font-black text-[var(--color-primary-dark)] text-sm uppercase tracking-wider">المريض</th>
          <th className="px-5 py-4 text-right font-black text-[var(--color-primary-dark)] text-sm uppercase tracking-wider">رقم الهاتف</th>
          {!isTablet && <th className="px-5 py-4 text-right font-black text-[var(--color-primary-dark)] text-sm uppercase tracking-wider">العنوان</th>}
          {!isTablet && <th className="px-5 py-4 text-right font-black text-[var(--color-primary-dark)] text-sm uppercase tracking-wider">الجنس / الفصيلة</th>}
          <th className="px-5 py-4 text-right font-black text-[var(--color-primary-dark)] text-sm uppercase tracking-wider">الإجراءات</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {filteredPatients.map((patient, index) => (
          <tr
            key={patient.id}
            className="border-b border-gray-50 hover:bg-[var(--color-primary-light)]/20 transition-all group"
          >
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-xl flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                  {patient.fullName?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-black text-gray-800 leading-none mb-1">{patient.fullName}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{patient.age} سنة</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-4">
              <span className="text-sm font-bold text-gray-600">{patient.phoneNumber}</span>
            </td>
            {!isTablet && (
              <td className="px-5 py-4">
                <span className="text-sm text-gray-500 font-medium truncate max-w-[150px] block">{patient.address || '-'}</span>
              </td>
            )}
            {!isTablet && (
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${patient.gender === 'ذكر' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                    {patient.gender || 'غير محدد'}
                  </span>
                  {patient.blood && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black">
                      {patient.blood}
                    </span>
                  )}
                </div>
              </td>
            )}
            <td className="px-5 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(patient)}
                  className="p-2.5 bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)] rounded-xl hover:bg-[var(--color-primary-light)] transition-all shadow-sm border border-[var(--color-primary-light)]"
                  title="تعديل"
                >
                  <Edit fontSize="small" />
                </button>
                <button
                  onClick={() => deletePatient(patient.id)}
                  className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all shadow-sm border border-rose-100"
                  title="حذف"
                >
                  <Delete fontSize="small" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
