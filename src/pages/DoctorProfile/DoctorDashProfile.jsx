import React from 'react';
import DoctorProfile from './DoctorProfile';

const DoctorDashProfile = () => {
    return (
        <div className="doctor-dashboard">
            <DoctorProfile isDoctorView={true} />
        </div>
    );
};

export default DoctorDashProfile;