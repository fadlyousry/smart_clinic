import { supabase } from '../supaBase/booking';
import useDoctorDashboardStore from '../store/doctorDashboardStore';
import { usePrescriptionStore } from '../store/prescriptionStore';

const activeChannels = new Map();

const handleTableUpdate = (tableName, currentData, payload, setter) => {
    const { eventType, new: newItem, old: oldItem } = payload;
    const { selectedPatient, refreshSelectedPatient } = useDoctorDashboardStore.getState();

    console.log(`🔁 Realtime [${tableName}]:`, payload);

    let updatedData = [...(currentData || [])];

    switch (eventType) {
        case 'INSERT':

        if (!updatedData.find(item => item.id === newItem.id)) {
                updatedData.push(newItem);
            }
            break;
        case 'UPDATE':
            updatedData = updatedData.map(item => 
                item.id === newItem.id ? { ...item, ...newItem } : item
            );
            break;
        case 'DELETE':
            updatedData = updatedData.filter(item => item.id !== oldItem.id);
            break;
        default:
            break;
    }

    setter(updatedData);
};


export const setupRealtimePatients = (patientId = null) => {
    const channelName = patientId 
        ? `clinic-patient-${patientId}`
        : `clinic-global-${Math.random().toString(36).substr(2, 9)}`;


        if (activeChannels.has(channelName)) {
        return activeChannels.get(channelName);
    }

    const {
        setPatients,
        setAppointments,
        setVisits,
        setPrescriptions,
        setPrescriptionMedications,
        setTests,
        setTestRequests,
        setDrugCategories,
        fetchData
    } = useDoctorDashboardStore.getState();

    const { fetchPatientPrescriptions } = usePrescriptionStore.getState();

    const channel = supabase.channel(channelName);

    // --- patients ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'patients',
            ...(patientId && { filter: `id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Patients update:', payload);
            

            await fetchData();
            

            if (window.onPatientsUpdate) {
                window.onPatientsUpdate(payload);
            }
        }
    );

    // --- visits ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'visits',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log(' Visits update:', payload);
            

            if (selectedPatient?.id === payload.new?.patient_id) {
      await refreshSelectedPatient();
    }

    if (window.onVisitsUpdate) {
                window.onVisitsUpdate(payload);
            }
        }
    );

    // --- prescriptions ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescriptions',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Prescriptions update:', payload);
            

            await fetchData();
            

            const { new: newPrescription } = payload;
            if (newPrescription?.patient_id) {
                await fetchPatientPrescriptions(newPrescription.patient_id);
            }
            

            if (window.onPrescriptionsUpdate) {
                window.onPrescriptionsUpdate(payload);
            }
        }
    );

    // --- prescription_medications ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescription_medications',
        },
        async (payload) => {
            console.log('🔁 Prescription medications update:', payload);
            

            await fetchData();
            

            if (window.onPrescriptionMedicationsUpdate) {
                window.onPrescriptionMedicationsUpdate(payload);
            }
        }
    );

    // --- test_requests ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'test_requests',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Test requests update:', payload);
            

            await fetchData();
            

            if (window.onTestRequestsUpdate) {
                window.onTestRequestsUpdate(payload);
            }
        }
    );

    // --- appointments ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'appointments',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Appointments update:', payload);
            
            const current = useDoctorDashboardStore.getState().appointments || [];
            handleTableUpdate('appointments', current, payload, setAppointments);
        }
    );

    // --- tests ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'tests',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().tests || [];
            handleTableUpdate('tests', current, payload, setTests);
        }
    );

    // --- drug_categories ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'drug_categories',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().drug_categories || [];
            handleTableUpdate('drug_categories', current, payload, setDrugCategories);
        }
    );

    channel.subscribe((status, err) => {
        if (err) {
            console.error('Realtime subscription error:', err);
            activeChannels.delete(channelName);
        } else {
            activeChannels.set(channelName, channel);
            console.log(`✅ Realtime channel [${channelName}] status:`, status);
        }
    });

    return channel;
};

export const removeRealtimeChannel = async (channel) => {
    if (!channel) return;

    try {
        const channelName = channel.topic.replace('realtime:', '');
        const { error } = await supabase.removeChannel(channel);
        
        if (error) {
            console.error('Error removing channel:', error);
        } else {  
            activeChannels.delete(channelName);
            console.log('✅ Channel removed successfully:', channelName);
        }
    } catch (err) {
        console.error('Exception while removing channel:', err);
    }
};

export const getActiveChannels = () => {
    return Array.from(activeChannels.keys());
};

export const cleanupAllChannels = async () => {
    const channels = Array.from(activeChannels.values());
    
    for (const channel of channels) {
        await removeRealtimeChannel(channel);
    }
    
    activeChannels.clear();
    console.log('✅ All channels cleaned up');
};

