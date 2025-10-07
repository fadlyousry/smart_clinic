import { useEffect, useRef } from 'react';
import { setupRealtimePatients, removeRealtimeChannel } from '../../../lib/supabaseRealtime'

export const useRealtime = (callbacks = {}) => {
    const channelRef = useRef(null);
    const callbacksRef = useRef(callbacks);

    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {

        window.onPatientsUpdate = callbacksRef.current.onPatientsUpdate;
        window.onVisitsUpdate = callbacksRef.current.onVisitsUpdate;
        window.onPrescriptionsUpdate = callbacksRef.current.onPrescriptionsUpdate;
        window.onPrescriptionMedicationsUpdate = callbacksRef.current.onPrescriptionMedicationsUpdate;
        window.onTestRequestsUpdate = callbacksRef.current.onTestRequestsUpdate;


        channelRef.current = setupRealtimePatients();

        return () => {

            if (channelRef.current) {
                removeRealtimeChannel(channelRef.current);
                channelRef.current = null;
            }


            window.onPatientsUpdate = null;
            window.onVisitsUpdate = null;
            window.onPrescriptionsUpdate = null;
            window.onPrescriptionMedicationsUpdate = null;
            window.onTestRequestsUpdate = null;
        };
    }, []);

    return {
        channel: channelRef.current
    };
};