import { Eye, Trash2 } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setupRealtimePatients } from "../../../lib/supabaseRealtime";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { useNavigate } from "react-router-dom";
import usePatientStore from "../../../store/patientStore";

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState("");

    const setSelectedPatientName = usePatientStore((state) => state.setSelectedPatientName);
    const loading = useDoctorDashboardStore((state) => state.loading);
    const error = useDoctorDashboardStore((state) => state.error);
    const patients = useDoctorDashboardStore((state) => state.patients);
    const visits = useDoctorDashboardStore((state) => state.visits);
    const navigate = useNavigate();

    useEffect(() => {
        const channel = setupRealtimePatients();
        return () => channel.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p>حدث خطأ في تحميل البيانات:</p>
                    <p>{error.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    const patientsWithLastVisit = patients
        .map((p) => {
            const patientVisits = visits
                .filter((v) => v.patient_id === p.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return {
                ...p,
                lastVisitDate: patientVisits.length > 0 ? patientVisits[0].date : null,
                lastVisitTimestamp: patientVisits.length > 0 ? new Date(patientVisits[0].date).getTime() : 0,
            };
        })
        .sort((a, b) => b.lastVisitTimestamp - a.lastVisitTimestamp);

    const lowerSearch = searchTerm.toLowerCase();
    const filteredPatients = patientsWithLastVisit.filter((p) => {
        const nameMatch = p.fullName?.toLowerCase().includes(lowerSearch);
        const phoneMatch = p.phoneNumber?.toString().includes(searchTerm);
        return nameMatch || phoneMatch;
    });

    return (
        <div className="p-9 space-y-4" dir="rtl">
            <h2 className="text-2xl font-bold">المرضى</h2>
            <div className="bg-gray-100 p-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-between gap-2">
                    <SearchBar placeholder="ابحث بالاسم أو الرقم ..." className="max-w-md bg-white rounded-2xl " onChange={setSearchTerm} />
                </div>
                <div className="hidden lg:block overflow-auto bg-white rounded-2xl shadow-md mt-3  max-h-[70vh] overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-white text-md text-gray-600 ">
                                    <th className="p-3">رقم</th>
                                    <th className="p-3">الإسم</th>
                                    <th className="p-3">العمر</th>
                                    <th className="p-3">النوع</th>
                                    <th className="p-3">رقم الهاتف</th>
                                    <th className="p-3">العنوان</th>
                                    <th className="p-3">آخر زيارة</th>
                                    <th className="p-3 flex justify-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((p, index) => (
                                    <tr key={p.id} className="border-t border-gray-200 text-md">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{p.fullName}</td>
                                        <td className="p-3">{p.age}</td>
                                        <td className="p-3">{p.gender}</td>
                                        <td className="p-3">{p.phoneNumber}</td>
                                        <td className="p-3">{p.address}</td>
                                        <td className="p-3">
                                            {p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString("ar-EG") : "لا يوجد زيارات"}
                                        </td>
                                        <td className="p-3 flex justify-center">
                                            <button className="text-cyan-500 hover:text-cyan-700 transition-colors"
                                                onClick={() => {
                                                    setSelectedPatientName(p.fullName);
                                                    navigate("/DoctorDashboard/records");
                                                }}
                                            >
                                                <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">لا توجد بيانات متاحة</p>
                        </div>
                    )}
                </div>

                {/* mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-3">
                    {filteredPatients.map((p, index) => (
                        <div key={p.id} className="bg-white shadow rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-600">#{index + 1}</span>
                            </div>
                            <div className="text-sm space-y-1">
                                <div><strong>الاسم:</strong> {p.fullName}</div>
                                <div><strong>العمر:</strong> {p.age}</div>
                                <div><strong>النوع:</strong> {p.gender}</div>
                                <div><strong>رقم الهاتف:</strong> {p.phoneNumber}</div>
                                <div><strong>العنون:</strong> {p.address}</div>
                                <div><strong>آخر زيارة:</strong> {p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString("ar-EG") : "لا يوجد زيارات"}</div>
                            </div>
                            <div className="flex justify-around pt-2 border-t border-gray-100">
                                <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-full"
                                    onClick={() => {
                                        setSelectedPatientName(p.fullName);
                                        navigate("/DoctorDashboard/records");
                                    }}><Eye size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}