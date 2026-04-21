import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/auth';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './LabTopbar.css';

function LabTopbar({ toggleSidebar }) {
    const [showMenu, setShowMenu] = useState(false);
    const { logout, CUname } = useAuthStore();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout(navigate);
    };

    const handleBackHome = () => {
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
                        <AccountCircleIcon style={{ fontSize: 35, borderRadius: '50%' }} />
                        <span className="user-name">
                            {CUname() || 'فني معمل'}
                        </span>
                    </button>

                    {showMenu && (
                        <div className="dropdown-menu">
                            <button onClick={handleBackHome}>
                                <span className="icon text-cyan-700"><AccountCircleIcon /></span> العودة للموقع
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

export default LabTopbar;
