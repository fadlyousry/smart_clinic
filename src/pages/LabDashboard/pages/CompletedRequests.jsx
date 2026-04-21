import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supaBase/booking';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScienceIcon from '@mui/icons-material/Science';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';

export default function CompletedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  const fetchCompletedRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_requests')
        .select(`
          *,
          patients (fullName),
          tests (name, duration)
        `)
        .eq('status', 'مكتمل')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching completed lab requests:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في جلب أرشيف التحاليل',
        confirmButtonColor: '#0097A7',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const filteredRequests = requests.filter(req => 
    req.patients?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.tests?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="lab-completed-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CheckCircleIcon className="text-green-600" />
          أرشيف النتائج المكتملة
        </h1>
        <div className="relative">
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث في الأرشيف..." 
            className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 w-64 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-dashed border-gray-300">
          <ScienceIcon style={{ fontSize: 60, color: '#e5e7eb', marginBottom: '1rem' }} />
          <h3 className="text-xl font-semibold mb-2">الأرشيف فارغ</h3>
          <p>لم يتم تسجيل نتائج لأي تحاليل بعد.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="p-4 font-bold">المريض</th>
                <th className="p-4 font-bold">نوع التحليل</th>
                <th className="p-4 font-bold">تاريخ الإكمال</th>
                <th className="p-4 font-bold">النتيجة</th>
                <th className="p-4 font-bold text-center">عرض</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <PersonIcon className="text-gray-400" fontSize="small" />
                      {req.patients?.fullName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-800 font-medium">
                      {req.tests?.name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(req.completed_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs truncate text-gray-600 text-sm italic">
                      {req.result_value}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleViewDetails(req)}
                      className="p-2 hover:bg-cyan-50 text-cyan-600 rounded-full transition-all"
                    >
                      <VisibilityIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال عرض النتيجة المكتملة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[2000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border-t-8 border-green-600">
            <div className="p-6 flex justify-between items-center border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">نتيجة التحليل المعتمدة</h2>
                <p className="text-gray-500 text-sm mt-1">{selectedRequest?.tests?.name} - {selectedRequest?.patients?.fullName}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="hover:bg-gray-100 p-2 rounded-full text-gray-400">
                <CloseIcon />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-green-50/10">
              <div className="space-y-2">
                <label className="block font-bold text-green-800 uppercase text-xs tracking-wider">النتيجة المسجلة (Result Value):</label>
                <div className="bg-white border border-green-200 rounded-xl p-6 min-h-[100px] text-gray-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {selectedRequest?.result_value}
                </div>
              </div>

              {selectedRequest?.lab_notes && (
                <div className="space-y-2">
                  <label className="block font-bold text-gray-600 uppercase text-xs tracking-wider border-r-4 border-gray-400 pr-2">ملاحظات إضافية:</label>
                  <p className="text-gray-700 bg-gray-100 p-4 rounded-lg italic">
                    {selectedRequest.lab_notes}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                <span>تاريخ الاعتماد: {new Date(selectedRequest?.completed_at).toLocaleString('ar-EG')}</span>
              </div>
            </div>

            <div className="p-6 border-t flex justify-center">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-800 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-black transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
