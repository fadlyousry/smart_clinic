// components/PatientProfile.jsx
import { useState, useEffect } from 'react';
import PatientInfo from './PatientInfo';
import TestsModal from './TestsModal';
import { supabase } from '../../../../supaBase/booking';

export default function PatientProfile({ patient }) {
    const [isTestsModalOpen, setIsTestsModalOpen] = useState(false);
    const [testRequests, setTestRequests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);

    // جلب البيانات مع دعم البث المباشر (Realtime)
    useEffect(() => {
        if (patient) {
            fetchTestRequests();

            // الاشتراك في تحديثات التحاليل لهذا المريض
            const channel = supabase
                .channel(`patient-tests-${patient.id}`)
                .on(
                    'postgres_changes',
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: 'test_requests'
                    },
                    (payload) => {
                        console.log('🔁 Realtime update in PatientProfile:', payload);
                        
                        // تحديث البيانات إذا كانت تخص المريض الحالي أو في حالة الحذف (الذي قد لا يحتوي على patient_id)
                        if (
                            payload.eventType === 'DELETE' || 
                            (payload.new && payload.new.patient_id === patient.id) ||
                            (payload.old && payload.old.patient_id === patient.id)
                        ) {
                            fetchTestRequests();
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [patient]);

    const fetchTestRequests = async () => {
        if (!patient) return;
        
        setLoadingTests(true);
        try {
            const { data, error } = await supabase
                .from('test_requests')
                .select('*, tests(*)')
                .eq('patient_id', patient.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestRequests(data || []);
        } catch (error) {
            console.error('Error fetching test requests:', error);
        } finally {
            setLoadingTests(false);
        }
    };

    return (
        <div className="space-y-6">
            <PatientInfo 
                patient={patient} 
                testRequests={testRequests}
                onOpenTestsModal={() => setIsTestsModalOpen(true)}
            />
            
            {patient && (
                <TestsModal
                    isOpen={isTestsModalOpen}
                    onClose={() => setIsTestsModalOpen(false)}
                    patient={patient}
                    testRequests={testRequests}
                />
            )}
        </div>
    );
}