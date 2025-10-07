
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { supabase } from '../../../supaBase/booking';
import { usePrescriptionStore } from '../../../store/prescriptionStore';
import { setupRealtimePatients, removeRealtimeChannel } from "../../../lib/supabaseRealtime";
import { printPrescriptionDirectly } from '../components/Prescription/PrintPrescriptionData';

export default function PrescriptionModel({ isOpen, onClose, selectedPatient }) {
    const today = new Date().toLocaleDateString('en-US');
    const [formData, setFormData] = useState({
        patientName: selectedPatient?.fullName || '',
        notes: '',
        selectedMeds: [],
        activeCategory: 'مسكنات',
        currentMed: '',
        dosage: '',
        duration: '',
    });
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { drug_categories: medicationsData, dosage_options: dosageOptionsData,
        duration_options: durationOptionsData } = useDoctorDashboardStore();
    const prescriptionStore = usePrescriptionStore();
    const realtimeChannel = useRef(null);


    useEffect(() => {
        if (!isOpen || !selectedPatient?.id) return;

        const initRealtime = async () => {
            try {
                realtimeChannel.current = setupRealtimePatients(selectedPatient.id);
                await prescriptionStore.fetchPatientPrescriptions(selectedPatient.id);
            } catch (error) {
                console.error('Error initializing realtime:', error);
                toast.error('حدث خطأ في الاتصال بالخادم');
            }
        };

        initRealtime();

        return () => {
            if (realtimeChannel.current) {
                removeRealtimeChannel(realtimeChannel.current);
            }
        };
    }, [isOpen, selectedPatient?.id]);


    useEffect(() => {
        setFormData(prev => ({ ...prev, patientName: selectedPatient?.fullName || '' }));
    }, [selectedPatient]);



    const isMedAlreadyAdded = useCallback((medName) => {
        return formData.selectedMeds.some(med => med.name === medName);
    }, [formData.selectedMeds]);



    const addMedication = useCallback(() => {

        if (isMedAlreadyAdded(formData.currentMed)) {
            toast.warn('هذا الدواء مضاف مسبقاً للروشتة');
            return;
        }
        const newMed = {
            name: formData.currentMed,
            dosage: formData.dosage || 'جرعة حسب الحاجة',
            duration: formData.duration || 'حسب التعليمات'
        };
        setFormData(prev => ({
            ...prev,
            selectedMeds: [...prev.selectedMeds, newMed],
            dosage: '',
            duration: '',
        }));
        setShowDosageModal(false);
        toast.success('تم إضافة الدواء');
    }, [formData.currentMed, formData.dosage, formData.duration]);


    const removeMedication = useCallback((index) => {
        setFormData(prev => {
            const updated = [...prev.selectedMeds];
            updated.splice(index, 1);
            return { ...prev, selectedMeds: updated };
        });
        toast.info('تم إزالة الدواء');
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientName || formData.selectedMeds.length === 0) {
            toast.warn('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
            return;
        }

        setIsSubmitting(true);
        try {
            const currentDoctorId = 1; 
            


            let patientId;
            const { data: existingPatient, error: patientError } = await supabase
                .from('patients')
                .select('id')
                .eq('fullName', formData.patientName)
                .single();

            if (patientError && patientError.code !== 'PGRST116') throw patientError;

            if (!existingPatient) {
                const { data: newPatient, error: insertError } = await supabase
                    .from('patients')
                    .insert([{
                        fullName: formData.patientName,
                        age: null,
                        gender: "غير محدد",
                        phoneNumber: "",
                        address: "",
                        status: "جديد",
                        blood: "",
                        chronic_diseases: []
                    }])
                    .select('id')
                    .single();

                if (insertError) throw insertError;
                patientId = newPatient.id;
            } else {
                patientId = existingPatient.id;
            }


            const { data: visit, error: visitError } = await supabase
                .from('visits')
                .insert([{
                    patient_id: patientId,
                    doctor_id: currentDoctorId,
                    date: today,
                    notes: formData.notes,
                    appointment_id: selectedPatient?.appointment_id || null
                }])
                .select('id')
                .single();

            if (visitError) throw visitError;


            const { data: medicalRecord, error: recordError } = await supabase
                .from('medical_records')
                .insert([{
                    patient_id: patientId,
                    visit_id: visit.id,
                    date: today,
                    diagnosis: formData.notes,
                    notes: formData.notes
                }])
                .select('id')
                .single();

            if (recordError) throw recordError;


            await prescriptionStore.savePrescription(patientId, visit.id, {
                notes: formData.notes,
                medications: formData.selectedMeds
            });


            if (selectedPatient?.appointment_id) {
                await supabase
                    .from('appointments')
                    .update({ status: 'تم' })
                    .eq('id', selectedPatient.appointment_id);
            }


            window.dispatchEvent(new CustomEvent('prescriptionSaved', {
                detail: {
                    patientId: patientId,
                    visitId: visit.id
                }
            }));

            toast.success('تم حفظ الروشتة بنجاح!');
            onClose(true);
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handlePrint = () => {
        if (!selectedPatient || formData.selectedMeds.length === 0) {
            toast.warn('الرجاء اختيار مريض وإضافة أدوية أولاً');
            return;
        }

        const prescriptionData = {
            date: new Date().toLocaleDateString('ar-EG'),
            patientName: selectedPatient.fullName,
            age: selectedPatient.age,
            phone: selectedPatient.phone,
            gender: selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى',
            doctorName: 'د/ محمود خالد',
            medications: formData.selectedMeds,
            notes: formData.notes
        };

        printPrescriptionDirectly(prescriptionData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center ms-0 md:ms-40 lg:ms-60 items-center z-50">

            {showDosageModal && (
                <div className="fixed inset-0 bg-gray-500/60 flex justify-center items-center z-50 overflow-auto ">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-400">
                        <h3 className="text-xl font-bold mb-4 text-blue-800" style={{ color: "var(--color-primary)" }}>
                            تحديد جرعة الدواء: {formData.currentMed}
                        </h3>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
                            <div className="grid grid-cols-2 gap-2">
                                {dosageOptionsData?.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData(p => ({ ...p, dosage: option.value }))}
                                        className={`p-2 border rounded-lg text-sm ${formData.dosage === option.value
                                            ? 'bg-cyan-100 border-cyan-500'
                                            : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {option.value}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={formData.dosage}
                                onChange={(e) => setFormData(p => ({ ...p, dosage: e.target.value }))}
                                placeholder="أو اكتب جرعة مخصصة"
                                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
                            <div className="grid grid-cols-2 gap-2">
                                {durationOptionsData?.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData(p => ({ ...p, duration: option.value }))}
                                        className={`p-2 border rounded-lg text-sm ${formData.duration === option.value
                                            ? 'bg-cyan-100 border-cyan-500'
                                            : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {option.value}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))}
                                placeholder="أو اكتب مدة مخصصة"
                                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDosageModal(false)}
                                className="flex-1 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                style={{ backgroundColor: "var(--color-accent)" }}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={addMedication}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                disabled={!formData.dosage || !formData.duration}
                                style={{ backgroundColor: "var(--color-accent)" }}
                            >
                                تأكيد وإضافة
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl relative overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">نظام صرف الأدوية</h2>

                <button
                    className="absolute top-2 left-2 text-gray-500 hover:text-black"
                    onClick={() => onClose(false)}
                    disabled={isSubmitting}
                >
                    ✖ إغلاق
                </button>

                <div className="flex flex-col lg:flex-row gap-6 mt-6 h-[80vh]">

                    <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

                        <div className="bg-gray-100 p-2 rounded-lg mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {medicationsData?.map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setFormData(p => ({ ...p, activeCategory: cat.name }))}
                                        className={`w-full py-2 rounded-lg text-center font-medium transition ${formData.activeCategory === cat.name
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300'
                                            }`}
                                        style={{
                                            backgroundColor: formData.activeCategory === cat.name ? 'var(--color-accent)' : undefined,
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {medicationsData?.find(cat => cat.name === formData.activeCategory)?.medications?.length ? (
                                medicationsData?.find(cat => cat.name === formData.activeCategory)?.medications?.map((med, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (isMedAlreadyAdded(med.name)) {
                                                toast.info('هذا الدواء مضاف مسبقاً للروشتة', {
                                                    autoClose: 3000,
                                                    hideProgressBar: true,
                                                });
                                                return;
                                            }
                                            setFormData(p => ({ ...p, currentMed: med.name }));
                                            setShowDosageModal(true);
                                        }}
                                        className={`p-4 border rounded-lg transition text-center flex items-center justify-center h-20 ${isMedAlreadyAdded(med.name)
                                            ? 'bg-green-100 border-green-300'
                                            : 'border-gray-200 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className={`font-medium ${isMedAlreadyAdded(med.name) ? 'text-green-700' : ''
                                            }`}>
                                            {med.name}
                                            {isMedAlreadyAdded(med.name) && (
                                                <span className="text-xs text-green-600 mr-2"> (مضاف)</span>
                                            )}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">
                                    <p>لا توجد أدوية في هذه الفئة</p>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>روشتة العلاج</h2>
                            <div className="text-gray-600">
                                <p className="font-medium">التاريخ: {today}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-700">اسم المريض</label>
                            <input
                                disabled
                                type="text"
                                value={formData.patientName}
                                onChange={(e) => setFormData(p => ({ ...p, patientName: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="border border-gray-200 rounded-lg mb-6 h-50 overflow-y-auto">
                            <div className="p-2 grid grid-cols-12 gap-1 font-medium text-blue-800"
                                style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
                                <span className="col-span-5">الدواء</span>
                                <span className="col-span-4">الجرعة</span>
                                <span className="col-span-2">المدة</span>
                                <span className="col-span-1">إزالة</span>
                            </div>
                            <div className="max-h-64">
                                {formData.selectedMeds.length > 0 ? (
                                    formData.selectedMeds.map((med, index) => (
                                        <div key={index} className="border-b border-gray-200 p-2 grid grid-cols-12 gap-1 items-center hover:bg-gray-50">
                                            <span className="col-span-5 font-medium">{med.name}</span>
                                            <span className="col-span-4 text-gray-600">{med.dosage}</span>
                                            <span className="col-span-2 text-gray-600">{med.duration}</span>
                                            <button
                                                onClick={() => removeMedication(index)}
                                                className="col-span-1 text-red-500 hover:text-red-700"
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>لا توجد أدوية مضافة</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">ملاحظات الطبيب</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                rows="3"
                                placeholder="التشخيص أو أي تعليمات إضافية..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                style={{ backgroundColor: isSubmitting ? undefined : "var(--color-accent)" }}
                            >
                                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الروشتة'}
                            </button>
                            <button
                                onClick={handlePrint}
                                className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center bg-teal-600 hover:bg-teal-700'}`}
                            >
                                طباعة الروشتة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}