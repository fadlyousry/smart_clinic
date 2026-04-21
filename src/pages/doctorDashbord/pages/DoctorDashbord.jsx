import { useState, useEffect, Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Topbar from '../components/Topbar';
import './DoctorDashbord.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { this.setState({ error, errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', direction: 'ltr', textAlign: 'left', background: '#ffebee', margin: '2rem', borderRadius: '8px' }}>
          <h2>💥 حدث خطأ في النظام (React Crash)</h2>
          <p><strong>{this.state.error?.toString()}</strong></p>
          <pre style={{ overflow: 'auto', maxHeight: '300px' }}>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import Home from './Home';
import Appointments from './Appointments';
import Patients from './Patients';
import Records from './Records';
import Prescription from './Prescription';
import Tests from './Tests';
import Statistics from './Statistics';
import DoctorDashProfile from '../../DoctorProfile/DoctorDashProfile';
import DoctorCalendar from './DoctorCalendar';
import DoctorManagement from './DoctorManagement';
import LabManagement from './LabManagement';

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
          <Route path="calendar" element={<DoctorCalendar />} />
          <Route path="doctor-management" element={<ErrorBoundary><DoctorManagement /></ErrorBoundary>} />
          <Route path="lab-management" element={<ErrorBoundary><LabManagement /></ErrorBoundary>} />
        </Routes>
      </div>
    </div>
  );
}

export default DoctorDashboard;
