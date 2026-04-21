import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo2.png";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScienceIcon from "@mui/icons-material/Science";

import "./LabSidebar.css";

function LabSidebar({ isOpen, toggleSidebar }) {
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
                        <NavLink to="/lab-dashboard" end className="sidebar-link">
                            <HomeIcon /> الطلبات المعلقة
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/lab-dashboard/completed" className="sidebar-link">
                            <CheckCircleIcon /> أرشيف النتائج
                        </NavLink>
                    </li>
                    <li className="sidebar-item">
                        <NavLink to="/lab-dashboard/calendar" className="sidebar-link">
                            <ScienceIcon /> التقويم
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default LabSidebar;
