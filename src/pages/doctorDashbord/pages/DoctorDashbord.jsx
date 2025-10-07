import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Topbar from '../components/Topbar';
import './DoctorDashbord.css';

import Home from './Home';
import Appointments from './Appointments';
import Patients from './Patients';
import Records from './Records';
import Prescription from './Prescription';
import Tests from './Tests';
import Statistics from './Statistics';
import DoctorDashProfile from '../../DoctorProfile/DoctorDashProfile';

import { setupRealtimePatients } from '../../../lib/supabaseRealtime';
import useAuthStore from '../../../store/auth';

function DoctorDashboard() {
  const { CUrole } = useAuthStore();
  if (CUrole() != 'doctor') location.replace('/notFound');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const channel = setupRealtimePatients();
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  return (
    <div className="doctor-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content">
        <Topbar toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="DoctorDashProfile" element={<DoctorDashProfile />} />
          <Route path="patients" element={<Patients />} />
          <Route path="records" element={<Records />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="tests" element={<Tests />} />
          <Route path="statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}

export default DoctorDashboard;
