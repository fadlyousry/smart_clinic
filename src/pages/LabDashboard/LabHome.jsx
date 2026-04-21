import React, { useState, useEffect } from 'react';
import { supabase } from '../../supaBase/booking';
import useAuthStore from '../../store/auth';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabResultModal from './components/LabResultModal';

export default function LabHome() {
  const { current_user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingRequests();

    // إعداد البث المباشر (Realtime) لطلبات التحاليل
    const channel = supabase
      .channel('lab-home-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test_requests' },
        (payload) => {
          console.log('🔁 Realtime update in LabHome:', payload);
          fetchPendingRequests();
          
          // تشغيل صوت تنبيه عند إضافة طلب جديد
          if (payload.eventType === 'INSERT') {
            playNotificationSound();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Audio play failed (interaction required):', e));
    } catch (err) {
      console.error('Error playing notification sound:', err);
    }
  };

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      // جلب الطلبات قيد التنفيذ مع بيانات المريض والتحليل
      const { data, error } = await supabase
        .from('test_requests')
        .select(`
          *,
          patients (fullName),
          tests (name, duration),
          doctors (name)
        `)
        .eq('status', 'قيد التنفيذ')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching lab requests:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'فشل في جلب طلبات التحاليل',
        confirmButtonColor: '#0097A7',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultModal = (request) => {
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
    <div className="lab-home-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AssignmentIcon className="text-cyan-600" />
          طلبات التحاليل المعلقة
        </h1>
        <div className="relative">
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث عن مريض أو تحليل..." 
            className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 w-64 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-dashed border-gray-300">
          <ScienceIcon style={{ fontSize: 60, color: '#e5e7eb', marginBottom: '1rem' }} />
          <h3 className="text-xl font-semibold mb-2">لا توجد طلبات معلقة</h3>
          <p>سيتم عرض الطلبات الجديدة المحولة من الأطباء هنا.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b">
              <tr>
                <th className="p-4 font-bold">المريض</th>
                <th className="p-4 font-bold">نوع التحليل</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">المدة المقررة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
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
                    <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium border border-cyan-100">
                      {req.tests?.name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(req.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <AccessTimeIcon fontSize="inherit" />
                      {req.tests?.duration || 'غير محدد'}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleOpenResultModal(req)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                    >
                      إدخال النتيجة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال إدخال النتيجة */}
      {showModal && selectedRequest && (
        <LabResultModal 
          request={selectedRequest}
          onClose={() => setShowModal(false)}
          onSuccess={fetchPendingRequests}
        />
      )}
    </div>
  );
}
