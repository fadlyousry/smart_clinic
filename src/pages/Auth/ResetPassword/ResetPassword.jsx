import React from 'react';
import dr from '../../../assets/dr.jpeg';
import pitttttt from '../../../assets/pitttttt.png';
import { useFormik } from 'formik';
import { ResetPassword } from '../../../forms/schema/index.js';
import useAuthStore from '../../../store/auth.js';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { updatePassword } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: ResetPassword,
    onSubmit: async values => {
      console.log(' Reset Data:', values);

      updatePassword(values.password, () => {
        navigate('/login');
      });
    },
  });

  return (
    <div className="w-full min-h-screen font-[Cairo] flex flex-col md:flex-row bg-gray-100">
      {/* الجزء الأيمن مع الفورم على الصورة */}
      <div className="relative w-full md:w-2/3 flex items-center justify-center p-4 md:p-8 min-h-screen">
        {/* الخلفية (الصورة) */}
        <img src={pitttttt} alt="background" className="absolute inset-0 w-full h-full object-cover z-0" />

        {/* الفورم بدون خلفية بيضاء */}
        <div className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-lg ">
          <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">اعادة تعيين كلمة المرور</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* كلمة المرور وتأكيدها */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 font-medium text-white text-right drop-shadow-md">كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="ادخل كلمة المرور"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${formik.touched.password && formik.errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.password}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">تأكيد كلمة المرور</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder="تأكيد كلمة المرور"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.confirmPassword}</p>
              )}
            </div>
            {/* زر تأكيد كلمة المرور */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          transition duration-150 ease-in-out font-medium"
              >
                تأكيد كلمة المرور
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* صورة الدكتور (للشاشات الكبيرة فقط) */}
      <div className="hidden md:block md:w-1/3 relative">
        <img src={dr} alt="صورة الدكتور" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}
