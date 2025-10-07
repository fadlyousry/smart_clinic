
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../supaBase/booking';
import { toast } from 'react-toastify';
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { usePrescriptionStore } from '../../../store/prescriptionStore';
import { setupRealtimePatients, removeRealtimeChannel } from "../../../lib/supabaseRealtime";
import { printPrescriptionDirectly } from '../components/Prescription/PrintPrescriptionData';


import PatientSearch from '../components/PatientSearchPrescription';
import MedicationsList from '../components/Prescription/MedicationsList';
import PrescriptionForm from '../components/Prescription/PrescriptionForm';
import DosageModal from '../components/Prescription/DosageModal';
import ManageMedicationsModal from '../components/Prescription/ManageMedicationsModal';
import LoadingOverlay from '../components/Prescription/LoadingOverlay';

export default function Prescription({ onClose }) {
    const today = new Date().toLocaleDateString('en-US');
    const [formData, setFormData] = useState({
        patientName: '',
        notes: '',
        selectedMeds: [],
        activeCategory: 'مسكنات',
        currentMed: '',
        dosage: '',
        duration: '',
    });
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [showManageMedicationsModal, setShowManageMedicationsModal] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const { drug_categories: medicationsData, dosage_options: dosageOptionsData, duration_options: durationOptionsData } = useDoctorDashboardStore();
    const prescriptionStore = usePrescriptionStore();
    const realtimeChannel = useRef(null);

    useEffect(() => {
        if (!selectedPatient?.id) return;


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
    }, [selectedPatient?.id]);


    const isMedAlreadyAdded = useCallback((medName) => {
        return formData.selectedMeds.some(med => med.name === medName);
    }, [formData.selectedMeds]);


    const handleMedClick = useCallback((med) => {
        if (isMedAlreadyAdded(med)) {
            toast.info('هذا الدواء مضاف مسبقاً للروشتة', {
                autoClose: 3000,
                hideProgressBar: true,
            });
            return;
        }
        setFormData(prev => ({ ...prev, currentMed: med }));
        setShowDosageModal(true);
    }, [isMedAlreadyAdded]);


    const addMedication = useCallback(() => {
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
        if (!selectedPatient || formData.selectedMeds.length === 0) {
            toast.warn('الرجاء اختيار مريض وإضافة أدوية أولاً');
            return;
        }

        setIsSubmitting(true);
        try {
            const currentDoctorId = 1;


            const { data: visit, error: visitError } = await supabase
                .from('visits')
                .insert([{
                    patient_id: selectedPatient.id,
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
                    patient_id: selectedPatient.id,
                    visit_id: visit.id,
                    date: today,
                    diagnosis: formData.notes,
                    notes: formData.notes
                }])
                .select('id')
                .single();

            if (recordError) throw recordError;


            const savedPrescription = await prescriptionStore.savePrescription(selectedPatient.id, visit.id, {
                notes: formData.notes,
                medications: formData.selectedMeds
            });

            // 4. Update appointment status if exists
            if (selectedPatient?.appointment_id) {
                await supabase
                    .from('appointments')
                    .update({ status: 'تم' })
                    .eq('id', selectedPatient.appointment_id);
            }

            // 5. Refresh local data state
            await useDoctorDashboardStore.getState().fetchSelectedPatient(selectedPatient.id);
            await useDoctorDashboardStore.getState().fetchData();

            // 6. Dispatch realtime event for other pages
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('prescriptionSaved', {
                    detail: {
                        patientId: selectedPatient.id,
                        visitId: visit.id,
                        prescription: savedPrescription
                    }
                }));
            }

            // 7. Clear form and selection
            setFormData({
                patientName: '',
                notes: '',
                selectedMeds: [],
                activeCategory: 'مسكنات',
                currentMed: '',
                dosage: '',
                duration: '',
            });
            setSelectedPatient(null);

            toast.success('تم حفظ الروشتة بنجاح!');
            if (typeof onClose === 'function') onClose(true);
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle printing the prescription
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

    // Add a new drug category
    const addCategory = async () => {
        if (!newCategory.trim()) {
            toast.warn('الرجاء إدخال اسم التصنيف');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('drug_categories')
                .insert([{ name: newCategory }])
                .select();

            if (error) throw error;
            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم إضافة التصنيف بنجاح');
            setNewCategory('');
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        }
    };

    // Add a new medication to database
    const addMedicationToDB = async () => {
        if (!newMedication.name.trim() || !newMedication.category_id) {
            toast.warn('الرجاء إدخال اسم الدواء واختيار التصنيف');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('medications')
                .insert([{
                    name: newMedication.name,
                    category_id: newMedication.category_id,
                    description: newMedication.description
                }])
                .select();

            if (error) throw error;
            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم إضافة الدواء بنجاح');
            setNewMedication({
                name: '',
                category_id: '',
                description: ''
            });
        } catch (error) {
            console.error('Error adding medication:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        }
    };

    // Delete a category after checking if it's not in use
    const deleteCategory = async (categoryId) => {
        try {
            const inUse = await isCategoryInUse(categoryId);
            if (inUse) {
                toast.warn('لا يمكن حذف هذا التصنيف لأنه يحتوي على أدوية مرتبطة بسجلات وصفات طبية.');
                return;
            }

            if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟ سيتم حذف جميع الأدوية التابعة له.')) return;

            setIsSubmitting(true);

            // Delete medications linked to this category
            const { error: deleteMedsError } = await supabase
                .from('medications')
                .delete()
                .eq('category_id', categoryId);

            if (deleteMedsError) throw deleteMedsError;

            // Delete the category itself
            const { error: deleteCategoryError } = await supabase
                .from('drug_categories')
                .delete()
                .eq('id', categoryId);

            if (deleteCategoryError) throw deleteCategoryError;

            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم حذف التصنيف بنجاح');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete a medication after checking if it's not in use
    const deleteMedication = async (medicationId) => {
        try {
            const inUse = await isMedicationInUse(medicationId);
            if (inUse) {
                toast.warn('لا يمكن حذف هذا الدواء لأنه مرتبط بسجل وصفة طبية.');
                return;
            }

            if (!window.confirm('هل أنت متأكد من حذف هذا الدواء؟')) return;

            setIsSubmitting(true);

            const { error } = await supabase
                .from('medications')
                .delete()
                .eq('id', medicationId);

            if (error) throw error;

            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم حذف الدواء بنجاح');
        } catch (error) {
            console.error('Error deleting medication:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to check if a category is in use
    const isCategoryInUse = async (categoryId) => {
        const { data, error } = await supabase
            .from('medications')
            .select('id')
            .eq('category_id', categoryId);

        if (error) throw error;

        for (const med of data) {
            if (await isMedicationInUse(med.id)) {
                return true;
            }
        }
        return false;
    };

    // Function to check if a medication is in use
    const isMedicationInUse = async (medicationId) => {
        const { data, error } = await supabase
            .from('prescription_medications')
            .select('prescription_id')
            .eq('medication_id', medicationId)
            .limit(1);

        if (error) throw error;
        return data.length > 0;
    };

    // Function to update a category
    const updateCategory = async (categoryId, newData) => {
        try {
            setIsSubmitting(true);
            const { error } = await supabase
                .from('drug_categories')
                .update(newData)
                .eq('id', categoryId);

            if (error) throw error;

            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم تعديل التصنيف بنجاح');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to update a medication
    const updateMedication = async (medicationId, newData) => {
        try {
            setIsSubmitting(true);
            const { error } = await supabase
                .from('medications')
                .update(newData)
                .eq('id', medicationId);

            if (error) throw error;

            await useDoctorDashboardStore.getState().fetchDrugCategories();
            toast.success('تم تعديل الدواء بنجاح');
        } catch (error) {
            console.error('Error updating medication:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [newCategory, setNewCategory] = useState('');
    const [newMedication, setNewMedication] = useState({
        name: '',
        category_id: '',
        description: ''
    });

    return (
        <>
            <div className="flex items-center gap-3 justify-between pt-5 px-2 md:px-8">
                <span className="text-base sm:text-lg lg:text-xl px-3">كتابة الروشتة</span>
                <button
                    onClick={() => setShowManageMedicationsModal(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                >
                    إدارة الأدوية والتصنيفات
                </button>
            </div>

            <div className="bg-gray-100 rounded-2xl mx-2 sm:mx-4 lg:mx-6 my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-5">
                <div className="h-170 bg-gray-100 p-1">
                    <div className="flex flex-col lg:flex-row gap-3 h-165">
                        <MedicationsList
                            activeCategory={formData.activeCategory}
                            onCategoryChange={(category) => setFormData(prev => ({ ...prev, activeCategory: category }))}
                            onMedClick={(medName) => {
                                if (isMedAlreadyAdded(medName)) {
                                    toast.info('هذا الدواء مضاف مسبقاً للروشتة', {
                                        autoClose: 3000,
                                        hideProgressBar: true,
                                    });
                                    return;
                                }
                                setFormData(prev => ({ ...prev, currentMed: medName }));
                                setShowDosageModal(true);
                            }}
                            medicationsData={medicationsData}
                            isMedAlreadyAdded={isMedAlreadyAdded}
                        />

                        <PrescriptionForm
                            today={today}
                            selectedPatient={selectedPatient}
                            onPatientSelect={(patient) => {
                                setSelectedPatient(patient);
                                setFormData(prev => ({ ...prev, patientName: patient.fullName }));
                            }}
                            selectedMeds={formData.selectedMeds}
                            onRemoveMed={removeMedication}
                            notes={formData.notes}
                            onNotesChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            onSubmit={handleSubmit}
                            onPrint={handlePrint}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>




            <DosageModal
                show={showDosageModal}
                onClose={() => {
                    setShowDosageModal(false);
                    setFormData(prev => ({ ...prev, dosage: '', duration: '' }));
                }}
                currentMed={formData.currentMed}
                dosage={formData.dosage}
                duration={formData.duration}
                onDosageChange={(value) => setFormData(prev => ({ ...prev, dosage: value }))}
                onDurationChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                onAddMedication={addMedication}
                dosageOptions={dosageOptionsData}
                durationOptions={durationOptionsData}
            />
            <ManageMedicationsModal
                show={showManageMedicationsModal}
                onClose={() => setShowManageMedicationsModal(false)}
                medicationsData={medicationsData}
                newCategory={newCategory}
                onNewCategoryChange={setNewCategory}
                newMedication={newMedication}
                onNewMedicationChange={setNewMedication}
                onAddCategory={addCategory}
                onAddMedication={addMedicationToDB}
                onDeleteCategory={deleteCategory}
                onDeleteMedication={deleteMedication}
                onUpdateCategory={updateCategory}
                onUpdateMedication={updateMedication}
                prescriptionsData={prescriptionStore.prescriptions}
            />

            <LoadingOverlay show={isSubmitting} />
        </>
    );
}