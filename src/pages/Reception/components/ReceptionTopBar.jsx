import React, { useState, useRef, useEffect } from 'react';
import "./ReceptionTopBar.css";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

function ReceptionTopBar({ toggleSidebar }) {
    const [showMenu, setShowMenu] = useState(false);
    const { logout, CUname } = useAuthStore();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    const handleGoHome = () => {
        navigate("/");
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div className="topbar">
            <button className="burger-btn" onClick={toggleSidebar}>
                <MenuIcon />
            </button>
            <div className="topbar-icons">
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <AccountCircleIcon style={{ fontSize: 35, color: '#0097A7' }} />
                        <span className="user-name">
                            {CUname() || 'موظف استقبال'}
                        </span>
                    </button>

                    {showMenu && (
                        <div className="dropdown-menu">
                            <button onClick={handleGoHome}>
                                <span className="icon text-cyan-700"><HomeIcon /></span> الموقع الرئيسي
                            </button>
                            <button onClick={handleLogout}>
                                <span className="icon text-red-700"><LogoutIcon /></span> تسجيل الخروج
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReceptionTopBar;
