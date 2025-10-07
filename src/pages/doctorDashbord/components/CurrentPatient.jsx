import React, { useEffect, useState } from 'react';

import { Stethoscope, User, Phone, Calendar, MapPin } from 'lucide-react';
import PrescriptionModel from '../pages/PrescriptionModel';
import useDoctorDashboardStore from '../../../store/doctorDashboardStore';

export function CurrentPatient() {
    const { currentVisit, patients } = useDoctorDashboardStore();
    const [patient, setPatient] = useState(null);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    useEffect(() => {
        console.log("currentVisit:", currentVisit);
        if (currentVisit) {
            const foundPatient = patients.find(p => p.id === currentVisit.patient_id);
            console.log("Found patient:", foundPatient);
            setPatient(foundPatient);
        } else {
            setPatient(null);
        }
    }, [currentVisit, patients]);
    if (!currentVisit || !patient) return <p className="text-gray-500">لا يوجد مريض حالياً</p>;

    return (
        <>
            <PrescriptionModel
                isOpen={isPrescriptionOpen}
                onClose={() => setIsPrescriptionOpen(false)}
                selectedPatient={patient}
            />

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">المريض الحالي</h3>
                <Stethoscope className="text-primary" />
            </div>

            <div className="bg-white rounded-xl p-3 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-3 bg-blue-200 p-1 px-2 rounded-md">
                    <div>
                        <h4 className="font-bold text-gray-800 text-md">{patient.fullName}</h4>
                    </div>
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold shadow">
                        {currentVisit.status}
                    </span>
                </div>
                <div className=" mb-3  p-1 px-2 rounded-md">
                    <span className="text-gray-600 text-sm flex gap-2"><User className='text-cyan-500'/> {patient.age} سنة • {patient.gender}</span>
                    <span className="text-gray-600 text-sm flex gap-2"><MapPin /> {patient.address} </span>
                    <span className="text-gray-600 text-sm flex gap-4"><Phone className="w-4 h-6 text-green-600" />
                        {patient.phoneNumber} </span>

                </div>



            </div>


            <button
                className="w-full bg-accent text-white py-2 rounded-xl hover:bg-opacity-90 transition"
                style={{ backgroundColor: 'var(--color-accent)' }}
                onClick={() => setIsPrescriptionOpen(true)}
            >
                كتابة روشتة
            </button>
        </>
    );
}
