import React from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../../assets/Error.png'; // تأكد من صحة المسار

export default function Error404Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row" dir="rtl">

      {/* إضافة hidden md:block لإخفاء الصورة في الموبايل */}
      <div className="hidden lg:block w-full md:w-1/4 h-64 md:h-auto">
        <img
          src={Error}
          alt="رسم توضيحي لخطأ 404"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-3/4 p-8 md:p-12 lg:p-16">
        {/* قسم خطأ السيرفر */}
        <div className="text-gray-600 text-sm mb-2">خطأ في السيرفر</div>

        {/* رقم 404 */}
        <div className="text-6xl font-light text-red-400 mb-4">404</div>

        {/* عنوان الصفحة غير موجودة */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">الصفحة غير موجودة</h1>

        {/* الوصف */}
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          هذه الصفحة إما غير موجودة، أو تم نقلها إلى مكان آخر.
        </p>

        {/* قسم أزرار الإجراءات */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm font-medium mb-4">هذا ما يمكنك فعله</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-start">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
            >
              إعادة تحميل الصفحة
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
            >
              العودة للصفحة السابقة
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-colors text-sm"
            >
              الصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}