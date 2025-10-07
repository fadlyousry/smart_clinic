import React from 'react';
import DoctorProfile from './DoctorProfile';

const PatientView = () => {
    return (
        <div className="patient-profile-page">
            <DoctorProfile isDoctorView={false} />
        </div>
    );
};

export default PatientView;