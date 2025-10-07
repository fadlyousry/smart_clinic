import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceIcon from "@mui/icons-material/Science";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo2.png";
import CloseIcon from "@mui/icons-material/Close";

import "./SideBar.css";

function SideBar({ isOpen, toggleSidebar }) {
    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <div className={`sidebar ${isOpen ? "mobile open" : ""}`}>
                <div className="sidebar-header">
                    <h3
                        style={{
                            fontFamily: "var(--logo-font)",
                            marginTop: 5,
                            marginBottom: 0,
                            color: "var(--color-text-white)",
                            letterSpacing: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                        }}
                    >
                        Clinic
                        <img
                            src={logo}
                            width={35}
                            height={35}
                            alt="Logo"
                            style={{
                                margin: "0 1px",
                                verticalAlign: "middle",
                                display: "inline-block",
                            }}
                            className="mx-2"
                        />
                        Smart
                    </h3>
                    <button onClick={toggleSidebar} className="close-btn">
                        <CloseIcon />
                    </button>
                </div>

                <ul className="sidebar-list">
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard" end className="sidebar-link">
                            <HomeIcon /> الرئيسية
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/appointments" className="sidebar-link">
                            <EventIcon /> المواعيد
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/patients" className="sidebar-link">
                            <GroupIcon /> المرضى
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/records" className="sidebar-link">
                            <AssignmentIcon /> سجل المرضى
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/prescription" className="sidebar-link">
                            <LocalHospitalIcon /> الروشتة والأدوية
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/tests" className="sidebar-link">
                            <ScienceIcon /> التحاليل والفحوصات
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/statistics" className="sidebar-link">
                            <BarChartIcon /> الإحصائيات
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/DoctorDashboard/DoctorDashProfile" className="sidebar-link">
                            <PersonIcon /> الملف الشخصي
                        </NavLink>
                    </li>

                </ul>
            </div>
        </>
    );
}


export default SideBar;
