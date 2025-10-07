
// components/PatientSearch.jsx
import { useState, useRef, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';

export default function PatientSearch({ 
    patients, 
    onPatientSelect, 
    onNewPrescription,
    selectedPatient 
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // تحديث مصطلح البحث عند تغيير المريض المحدد
    useEffect(() => {
        if (selectedPatient?.fullName) {
            setSearchTerm(selectedPatient.fullName);
        }
    }, [selectedPatient]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handlePatientSelect = (patient) => {
        onPatientSelect(patient);
        setSearchTerm(patient.fullName);
        setIsSearchOpen(false);
    };

    const filteredPatients = patients.filter((patient) =>
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex justify-between items-center mb-5 gap-2">
            <div className="relative w-full" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث باسم المريض"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsSearchOpen(e.target.value.length > 0);
                        }}
                        onFocus={() => searchTerm.length > 0 && setIsSearchOpen(true)}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isSearchOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {isSearchOpen && (
                    <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-300 max-h-60 overflow-auto">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <li
                                    key={patient.id || index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                                    onClick={() => handlePatientSelect(patient)}
                                >
                                    {patient.fullName}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 text-center">لا يوجد نتائج مطابقة</li>
                        )}
                    </ul>
                )}
            </div>
            <button
                className="flex items-center gap-1 text-white rounded-2xl px-3 py-2.5 bg-teal-600 hover:bg-teal-700 transition text-xs sm:text-sm whitespace-nowrap"
                onClick={onNewPrescription}
                disabled={!selectedPatient}
            >
                <AddIcon fontSize="small" />
                <span>روشتة جديدة</span>
            </button>
        </div>
    );
}