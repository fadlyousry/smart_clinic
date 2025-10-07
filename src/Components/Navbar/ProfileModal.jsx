import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth';

export default function ProfileModal({ isOpen, onClose }) {
  const { CUphone, CUaddress, CUname } = useAuthStore();
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('auth-storage'));
    if (storedData?.state?.current_user) {
      setUserData({
        full_name: CUname() || '',
        email: storedData.state.current_user.email || '',
        phone: CUphone() || '',
        address: CUaddress() || '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{ backgroundColor: 'rgb(0 0 0 / 36%)' }}
      className="fixed inset-0 flex justify-center items-center z-50"
    >
      <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-4">الملف الشخصي</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">الاسم الكامل</label>
          <input
            type="text"
            name="full_name"
            value={userData.full_name}
            readOnly
            className="w-full bg-[#E0F7FA] border border-gray-300 px-4 py-3 rounded-lg text-lg cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            readOnly
            className="w-full border bg-[#E0F7FA] border-gray-300 px-4 py-3 rounded-lg  text-lg cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            readOnly
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-[#E0F7FA] text-lg cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">العنوان</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            readOnly
            className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-[#E0F7FA] text-lg cursor-not-allowed"
          />
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
