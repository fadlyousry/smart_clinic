// Records.jsx (الملف الرئيسي المحدث)
import { useState, useEffect, useRef } from 'react';
import PrescriptionSheet from "../components/PrescriptionSheet";
import PrescriptionModel from "../pages/PrescriptionModel";
import PatientSearch from "../components/recordes/PatientSearch";
import PatientInfo from "../components/recordes/PatientInfo";
import VisitsHistory from "../components/recordes/VisitsHistory";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { setupRealtimePatients, removeRealtimeChannel } from "../../../lib/supabaseRealtime";
import PatientProfile from "../components/recordes/PatientProfile";
import usePatientStore from "../../../store/patientStore";


export default function Records() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
    const realtimeChannel = useRef(null);

    const { selectedPatientName } = usePatientStore();
    const {
        loading,
        error,
        patients,
        doctors,
        fetchData,
        fetchSelectedPatient,
    } = useDoctorDashboardStore();


    useEffect(() => {
        if (!patients.length || !doctors.length) {
            fetchData();
        }


        realtimeChannel.current = setupRealtimePatients();


        const handlePrescriptionSaved = async (event) => {
            console.log(' Prescription saved event received:', event.detail);


            await fetchData();


            if (selectedPatient?.id === event.detail.patientId) {
                await refreshSelectedPatient();
            }
        };

        const handleTestRequestUpdated = async (event) => {
            console.log(' Test request updated event received:', event.detail);


            await fetchData();


            if (selectedPatient?.id === event.detail.patientId) {
                await refreshSelectedPatient();
            }
        };

        const handleTestRequestDeleted = async (event) => {
            console.log(' Test request deleted event received:', event.detail);


            await fetchData();


            if (selectedPatient?.id === event.detail.patientId) {
                await refreshSelectedPatient();
            }
        };


        window.addEventListener('prescriptionSaved', handlePrescriptionSaved);
        window.addEventListener('testRequestUpdated', handleTestRequestUpdated);
        window.addEventListener('testRequestDeleted', handleTestRequestDeleted);


        window.onPatientsUpdate = async (payload) => {
            console.log(' Patients realtime update:', payload);
            await handlePatientsUpdate(payload);
        };

        window.onVisitsUpdate = async (payload) => {
            console.log(' Visits realtime update:', payload);
            await handleVisitsUpdate(payload);
        };

        window.onPrescriptionsUpdate = async (payload) => {
            console.log(' Prescriptions realtime update:', payload);
            await handlePrescriptionsUpdate(payload);
        };

        window.onPrescriptionMedicationsUpdate = async (payload) => {
            console.log(' Prescription medications realtime update:', payload);
            await handlePrescriptionMedicationsUpdate(payload);
        };

        window.onTestRequestsUpdate = async (payload) => {
            console.log(' Test requests realtime update:', payload);
            await handleTestRequestsUpdate(payload);
        };

        return () => {
            if (realtimeChannel.current) {
                removeRealtimeChannel(realtimeChannel.current);
            }

            window.removeEventListener('prescriptionSaved', handlePrescriptionSaved);
            window.removeEventListener('testRequestUpdated', handleTestRequestUpdated);
            window.removeEventListener('testRequestDeleted', handleTestRequestDeleted);

            delete window.onPatientsUpdate;
            delete window.onVisitsUpdate;
            delete window.onPrescriptionsUpdate;
            delete window.onPrescriptionMedicationsUpdate;
            delete window.onTestRequestsUpdate;
        };
    }, []);

    const handlePatientsUpdate = async (payload) => {
        const { eventType, new: newItem, old: oldItem } = payload;

        console.log(' Handling patients update:', { eventType, newItem, oldItem });

        await fetchData();

        if (selectedPatient) {
            switch (eventType) {
                case 'UPDATE':
                    if (selectedPatient.id === newItem.id) {
                        await refreshSelectedPatient();
                    }
                    break;
                case 'DELETE':
                    if (selectedPatient.id === oldItem.id) {
                        setSelectedPatient(null);
                    }
                    break;
            }
        }
    };

    const handleVisitsUpdate = async (payload) => {
        const { eventType, new: newItem } = payload;

        console.log(' Handling visits update:', { eventType, newItem });

        await fetchData();

        if (selectedPatient && newItem?.patient_id === selectedPatient.id) {
            await refreshSelectedPatient();
        }
    };

    const handlePrescriptionsUpdate = async (payload) => {
        console.log(' Handling prescriptions update:', payload);

        await fetchData();

        if (selectedPatient) {
            await refreshSelectedPatient();
        }
    };

    const handlePrescriptionMedicationsUpdate = async (payload) => {
        console.log(' Handling prescription medications update:', payload);

        await fetchData();

        if (selectedPatient) {
            await refreshSelectedPatient();
        }
    };

    const handleTestRequestsUpdate = async (payload) => {
        const { eventType, new: newItem } = payload;

        console.log(' Handling test requests update:', { eventType, newItem });

        await fetchData();

        if (selectedPatient && newItem?.patient_id === selectedPatient.id) {
            await refreshSelectedPatient();
        }
    };

    const refreshSelectedPatient = async () => {
        if (!selectedPatient?.id) return;

        try {
            console.log(' Refreshing selected patient:', selectedPatient.id);

            const updatedPatientData = await fetchSelectedPatient(selectedPatient.id);

            if (updatedPatientData) {
                setSelectedPatient({
                    ...updatedPatientData,
                    visits: updatedPatientData.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
                });
                console.log('Selected patient refreshed successfully');
            }
        } catch (error) {
            console.error(' Error refreshing selected patient:', error);
        }
    };

    useEffect(() => {
        if (selectedPatientName && patients.length > 0) {
            let targetPatient = null;

            if (typeof selectedPatientName === 'object' && selectedPatientName.id) {
                targetPatient = patients.find(p => p.id === selectedPatientName.id);
            } else if (typeof selectedPatientName === 'string') {
                targetPatient = patients.find(p =>
                    p.fullName?.toLowerCase() === selectedPatientName.toLowerCase()
                );
            }

            if (targetPatient) {
                setSelectedPatient({
                    ...targetPatient,
                    visits: targetPatient.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
                });
            }
        }
    }, [patients, selectedPatientName]);

    const handlePatientSelect = (patient) => {
        const patientWithSortedVisits = {
            ...patient,
            visits: patient.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
        };
        setSelectedPatient(patientWithSortedVisits);
    };

    const handleNewPrescription = () => {
        setIsPrescriptionOpen(true);
    };

    const handleViewPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setIsViewModalOpen(true);
    };

    const handlePrescriptionClose = async (shouldRefresh = true) => {
        setIsPrescriptionOpen(false);
        if (shouldRefresh && selectedPatient?.id) {
            setTimeout(async () => {
                await refreshSelectedPatient();
            }, 500);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p>حدث خطأ في تحميل البيانات:</p>
                    <p>{error.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!patients.length) {
        return <div className="p-4 text-red-600">لا توجد بيانات متاحة</div>;
    }

    return (
        <>
            {/* Modals */}
            <PrescriptionSheet
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                prescription={selectedPrescription}
                Patient={selectedPatient}
                data={{ doctors }}
            />
            <PrescriptionModel
                isOpen={isPrescriptionOpen}
                onClose={handlePrescriptionClose}
                selectedPatient={selectedPatient}
            />

            {/* Main Content */}
            <div className="flex flex-col mx-2 sm:mx-4 lg:mx-6 my-3 px-4">
                <div className="flex items-center gap-3 justify-between">
                    <span className="font-bold sm:text-lg lg:text-xl mb-5">سجل المريض</span>
                </div>

                {/* Search and New Prescription */}
                <PatientSearch
                    patients={patients}
                    onPatientSelect={handlePatientSelect}
                    onNewPrescription={handleNewPrescription}
                    selectedPatient={selectedPatient}
                />

                {/* Patient Information */}
                <PatientProfile  patient={selectedPatient}/>

                {/* Visits History */}
                <VisitsHistory
                    patient={selectedPatient}
                    onViewPrescription={handleViewPrescription}
                />
            </div>
        </>
    );
}