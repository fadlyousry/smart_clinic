import { useState, useRef, useEffect } from 'react';
import useDoctorDashboardStore from '../../../store/doctorDashboardStore';

export default function PatientSearch({ onPatientSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const searchRef = useRef(null);
  

  const patients = useDoctorDashboardStore(state => state.patients);

  useEffect(() => {
    if (searchTerm.length === 0) {

      setFilteredPatients(patients);
    } else {

      const filtered = patients.filter(patient =>
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber?.toString().includes(searchTerm)
      ).slice(0, 20); 
      
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePatientSelect = (patient) => {
    setSearchTerm(patient.fullName);
    setIsSearchOpen(false);
    onPatientSelect(patient);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث باسم المريض أو رقم الهاتف"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            setIsSearchOpen(true);
            if (searchTerm.length === 0) {
              setFilteredPatients(patients.slice(0, 50));
            }
          }}
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
            filteredPatients.map((patient) => (
              <li
                key={patient.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition flex justify-between items-center"
                onClick={() => handlePatientSelect(patient)}
              >
                <span>{patient.fullName}</span>
                <span className="text-sm text-gray-500">{patient.phoneNumber}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 text-center">
              {searchTerm.length === 0 ? 'اكتب للبحث أو اختر من القائمة' : 'لا يوجد نتائج مطابقة'}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}