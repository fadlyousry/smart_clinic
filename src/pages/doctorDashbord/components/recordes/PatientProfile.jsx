// components/PatientProfile.jsx
import { useState, useEffect } from 'react';
import PatientInfo from './PatientInfo';
import TestsModal from './TestsModal';
import { supabase } from '../../../../supaBase/booking';

export default function PatientProfile({ patient }) {
    const [isTestsModalOpen, setIsTestsModalOpen] = useState(false);
    const [testRequests, setTestRequests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);

    useEffect(() => {
        if (isTestsModalOpen && patient) {
            fetchTestRequests();
        }
    }, [isTestsModalOpen, patient]);

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
            alert('حدث خطأ في جلب التحاليل');
        } finally {
            setLoadingTests(false);
        }
    };

    useEffect(() => {
        const handleTestRequestUpdated = () => fetchTestRequests();
        const handleTestRequestDeleted = () => fetchTestRequests();

        window.addEventListener('testRequestUpdated', handleTestRequestUpdated);
        window.addEventListener('testRequestDeleted', handleTestRequestDeleted);

        return () => {
            window.removeEventListener('testRequestUpdated', handleTestRequestUpdated);
            window.removeEventListener('testRequestDeleted', handleTestRequestDeleted);
        };
    }, []);

    return (
        <div className="space-y-6">
            <PatientInfo 
                patient={patient} 
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