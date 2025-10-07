import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MedicationIcon from '@mui/icons-material/Medication';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PrintIcon from '@mui/icons-material/Print';

export default function PrescriptionSheet({
    isOpen,
    onClose,
    prescription,
    data = { doctors: [] },
    Patient = {}
}) {
    if (!isOpen || !prescription) return null;
    
    const handlePrint = () => {
        window.print();
    };

    const doctor = {
        name: data.doctors?.[0]?.name || "غير معروف",
        specialty: data.doctors?.[0]?.specialty || "غير معروف"
    };
    const patientInfo = {
        name: Patient?.fullName || "غير معروف",
        age: Patient?.age || "غير معروف",
        gender: Patient?.gender || "غير معروف",
        phone: Patient?.phoneNumber || "غير معروف"
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh] border-2 border-cyan-600">
                <button onClick={onClose} className="absolute top-2 right-1/2  text-gray-500 hover:text-white transition bg-red-100 hover:bg-red-400 rounded-full p-1" >
                    <CloseIcon />
                </button>
                <div className="border-b-2 border-cyan-600 pb-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-cyan-800">روشتة طبية</h2>
                        <div className="text-sm bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                            {prescription.date}
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <div>{doctor.name}</div>
                        <div>تخصص: {doctor.specialty}</div>
                    </div>
                </div>

                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-1">بيانات المريض</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500 text-sm">الاسم:</span> {patientInfo.name}</div>
                        <div><span className="text-gray-500 text-sm">العمر:</span> {patientInfo.age}</div>
                        <div><span className="text-gray-500 text-sm">الجنس:</span> {patientInfo.gender}</div>
                        <div><span className="text-gray-500 text-sm">الرقم:</span> {patientInfo.phone}</div>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-1 pb-1 border-b border-cyan-200 text-cyan-700 flex items-center gap-2">
                        <MedicationIcon fontSize="small" />
                        <span>الأدوية الموصوفة</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full ">
                            <thead>
                                <tr className="bg-cyan-50 text-cyan-800 text-sm">
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm ">#</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">اسم الدواء</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">الجرعة</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">المدة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.medications.map((med, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                                        <td className="text-center py-1 px-1 text-gray-500  text-sm">{index + 1}</td>
                                        <td className="text-center py-1 px-2 font-medium text-gray-800  text-sm">{med.name}</td>
                                        <td className="text-center py-1 px-2 text-gray-600  text-sm">{med.dosage}</td>
                                        <td className="text-center py-1 px-2 text-gray-600  text-sm">{med.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-cyan-700 flex items-center gap-2">
                        <NoteAltIcon fontSize="small" />
                        <span>تعليمات وإرشادات</span>
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm text-gray-700 leading-relaxed">
                        {prescription.notes}
                    </div>
                </div>
                <div className="mt-6 pt-3 border-t border-dashed border-gray-300 text-xs text-gray-500 text-center">
                    <div className="mb-2">شكراً لثقتكم بنا - نتمنى لكم الشفاء العاجل</div>
                </div>
                
                <div className="mt-4 flex justify-center">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <PrintIcon fontSize="small" />
                        <span>طباعة الروشتة</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
