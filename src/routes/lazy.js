import { lazy } from 'react';

export const Login = lazy(() => import('../pages/Auth/Login/Login.jsx'));
export const Register = lazy(() => import('../pages/Auth/Register/Register.jsx'));
export const Forget = lazy(() => import('../pages/Auth/ForgetPassword/ForgetPassword.jsx'));
export const Reset = lazy(() => import('../pages/Auth/ResetPassword/ResetPassword.jsx'));
export const BookingPage = lazy(() => import('../pages/bookingPage/index.jsx'));
export const FirstAid = lazy(() => import('../pages/FirstAid/FirstAid.jsx'));
export const FirstAidDetails = lazy(() => import('../pages/FirstAid/FirstAidDetails.jsx'));
export const DoctorDashboard = lazy(() => import('../pages/doctorDashbord/pages/DoctorDashbord.jsx'));
export const NursingAppointments = lazy(() => import('../pages/Nursing/NursingAppointments.jsx'));
export const NursingPatientsList = lazy(() => import('../pages/Nursing/NursingPatientsList.jsx'));
// export const Profile = lazy(() => import('../pages/DoctorProfile/DoctorProfile.jsx'));
export const PatientView = lazy(() => import('../pages/DoctorProfile/PatientView.jsx'));
export const DoctorProfile = lazy(() => import('../pages/DoctorProfile/DoctorDashProfile.jsx'));
// export const PatientProfile = lazy(() => import('../pages/PatientProfile/PatientProfile.jsx'));
export const MedicalArticles = lazy(() => import('../pages/MedicalArticles/MedicalArticles.jsx'));

export const Home = lazy(() => import('../Components/Home/Home'));
export const About = lazy(() => import('../Components/Home/AboutClinic.jsx'));
export const Contact = lazy(() => import('../Components/Home/ContactUs.jsx'));
export const Services = lazy(() => import('../Components/Home/DoctorServices.jsx'));
export const Booking = lazy(() => import('../Components/Booking/Booking'));
export const Footer = lazy(() => import('../Components/Footer/Footer'));
export const Layout = lazy(() => import('../Components/Layout/Layout'));
export const Notfound = lazy(() => import('../Components/Notfound/Notfound'));
export const PatientRecordContainer = lazy(() => import('../Components/Navbar/PatientRecord.jsx'));
