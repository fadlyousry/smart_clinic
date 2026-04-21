import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo2.png";
import "./ReceptionSidebar.css";

function ReceptionSidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              Clinic
              <img src={logo} className="logo-img" alt="Logo" />
              Smart
            </h3>
            <button onClick={toggleSidebar} className="close-btn">
              <CloseIcon />
            </button>
          </div>

          <ul className="sidebar-list">
            <li className="sidebar-item">
              <NavLink to="/reception-dashboard" className="sidebar-link" end>
                 <EventIcon /> المواعيد
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/reception-dashboard/calendar" className="sidebar-link">
                 <CalendarMonthIcon /> التقويم
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/reception-dashboard/patients" className="sidebar-link">
                <GroupIcon /> قائمة المرضى
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/reception-dashboard/statistics" className="sidebar-link">
                <BarChartIcon /> الإحصائيات
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/reception-dashboard/settings" className="sidebar-link">
                <SettingsIcon /> الإعدادات
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ReceptionSidebar;
