
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
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 transition-all overflow-y-auto ms-0 md:ms-40 lg:ms-60">

            {showDosageModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[110] p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border-0 transform transition-all">
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
                                        className={`p-2 border rounded-xl text-sm transition-all focus:outline-none ${formData.dosage === option.value
                                            ? 'bg-cyan-50 border-[var(--color-primary)] text-[var(--color-primary-dark)] font-bold'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {option.value}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={formData.dosage}
                                onChange={(e) => setFormData(p => ({ ...p, dosage: e.target.value }))}
                                placeholder="أو اكتب جرعة مخصصة..."
                                className="w-full mt-3 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
                            <div className="grid grid-cols-2 gap-2">
                                {durationOptionsData?.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormData(p => ({ ...p, duration: option.value }))}
                                        className={`p-2 border rounded-xl text-sm transition-all focus:outline-none ${formData.duration === option.value
                                            ? 'bg-cyan-50 border-[var(--color-primary)] text-[var(--color-primary-dark)] font-bold'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {option.value}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))}
                                placeholder="أو اكتب مدة مخصصة..."
                                className="w-full mt-3 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDosageModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={addMedication}
                                className="flex-1 text-white px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
                                disabled={!formData.dosage || !formData.duration}
                                style={{ backgroundColor: "var(--color-primary)" }}
                            >
                                تأكيد وإضافة
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-6xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-black text-gray-800">نظام صرف الأدوية</h2>
                    <button
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
                        onClick={() => onClose(false)}
                        disabled={isSubmitting}
                        title="إغلاق"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 p-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* القسم الأيمن: الأدوية */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary-dark)" }}>تصنيفات الأدوية</h3>

                        <div className="bg-gray-100 p-2 rounded-lg mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {medicationsData?.map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setFormData(p => ({ ...p, activeCategory: cat.name }))}
                                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none ${
                                            formData.activeCategory === cat.name
                                                ? 'shadow-md text-white scale-105'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                        style={formData.activeCategory === cat.name ? { backgroundColor: 'var(--color-primary)' } : {}}
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
                                        className={`p-3 border rounded-xl transition-all text-center flex flex-col items-center justify-center gap-2 h-24 focus:outline-none ${
                                            isMedAlreadyAdded(med.name)
                                                ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-[var(--color-primary-light)] hover:shadow-md'
                                        }`}
                                    >
                                        <span className={`font-bold text-sm ${isMedAlreadyAdded(med.name) ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            {med.name}
                                        </span>
                                        {isMedAlreadyAdded(med.name) && (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">مضاف لمعاينة</span>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">
                                    <p>لا توجد أدوية في هذه الفئة</p>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>

                    {/* القسم الأيسر: الروشتة الحالية */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-50">
                                <h3 className="text-lg font-bold" style={{ color: "var(--color-primary-dark)" }}>تفاصيل الروشتة</h3>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                                    {today}
                                </span>
                            </div>

                            <div className="mb-5">
                                <label className="block mb-1.5 text-sm font-bold text-gray-700">اسم المريض</label>
                                <input
                                    disabled
                                    type="text"
                                    value={formData.patientName}
                                    onChange={(e) => setFormData(p => ({ ...p, patientName: e.target.value }))}
                                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed text-gray-600 font-medium"
                                    required
                                />
                            </div>

                            <label className="block mb-1.5 text-sm font-bold text-gray-700">الأدوية المضافة</label>
                            <div className="border border-gray-100 rounded-xl mb-5 flex-1 overflow-hidden flex flex-col bg-gray-50">
                                <div className="p-3 grid grid-cols-12 gap-2 text-xs font-bold shrink-0 border-b border-gray-100"
                                    style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary-dark)" }}>
                                    <span className="col-span-5">اسم الدواء</span>
                                    <span className="col-span-4">الجرعة</span>
                                    <span className="col-span-2">المدة</span>
                                    <span className="col-span-1 text-center">حذف</span>
                                </div>
                                <div className="overflow-y-auto custom-scrollbar flex-1 min-h-[150px]">
                                    {formData.selectedMeds.length > 0 ? (
                                        formData.selectedMeds.map((med, index) => (
                                            <div key={index} className="border-b border-gray-100 p-3 grid grid-cols-12 gap-2 items-center bg-white hover:bg-gray-50 transition-colors text-sm">
                                                <span className="col-span-5 font-bold text-gray-800">{med.name}</span>
                                                <span className="col-span-4 text-gray-600 text-xs">{med.dosage}</span>
                                                <span className="col-span-2 text-gray-600 text-xs">{med.duration}</span>
                                                <div className="col-span-1 flex justify-center">
                                                    <button
                                                        onClick={() => removeMedication(index)}
                                                        className="w-6 h-6 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs"
                                                        title="إزالة الدواء"
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                                            <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                                            <p className="font-bold text-sm">لم يتم إضافة أدوية بعد</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block mb-1.5 text-sm font-bold text-gray-700">تعليمات وملاحظات الطبيب</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all resize-none"
                                    rows="3"
                                    placeholder="التشخيص، التوصيات الطبية، أو أي تعليمات إضافية للمريض..."
                                />
                            </div>

                            <div className="flex gap-3 mt-auto shrink-0 pt-4 border-t border-gray-50">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`flex-1 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-95 shadow-md shadow-cyan-500/20'
                                    }`}
                                    style={{ backgroundColor: "var(--color-primary)" }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ الروشتة'}
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 text-[var(--color-primary-dark)] bg-cyan-50 border border-cyan-100 px-4 py-3 rounded-xl font-bold transition-all hover:bg-cyan-100 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    معاينة وطباعة
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}