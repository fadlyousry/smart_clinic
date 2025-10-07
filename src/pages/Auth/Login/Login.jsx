import React from 'react';
import { useFormik } from 'formik';
import drr from '../../../assets/drr.jpeg';
import pitttttt from '../../../assets/pitttttt.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../../forms/schema';
import useAuthStore from '../../../store/auth';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: values => {
      // console.log('Login Data:', values);
      login(values, navigate);
    },
  });

  return (
    <div className="w-full min-h-screen font-[Cairo] flex flex-col md:flex-row bg-gray-100">
      {/* صورة الدكتور فقط */}
      <div className="w-full md:w-1/3 h-64 md:h-screen">
        <img src={drr} alt="صورة الدكتور" className="w-full h-full object-cover object-center" />
      </div>

      {/* الجزء الأيمن مع الفورم على الصورة */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-8">
        {/* الخلفية (الصورة) */}
        <img src={pitttttt} alt="background" className="absolute inset-0 w-full h-full object-cover z-0" />

        {/* الفورم بدون خلفية بيضاء */}
        <div className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-md">تسجيل الدخول</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">كلمة المرور</label>
              <input
                type="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right">
              <NavLink to="/forgetpassword" className="text-white hover:text-blue-500 hover:underline drop-shadow-md">
                هل نسيت كلمة المرور؟
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full hover:bg-[#009688] bg-[#0097A7] text-white py-2.5 px-4 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        transition duration-150 ease-in-out font-medium"
            >
              تسجيل الدخول
            </button>

            {/* Create account link */}
            <div className="text-center mt-4 text-sm">
              <span className="text-white drop-shadow-md">ليس لديك حساب؟ </span>
              <NavLink to="/register" className="text-blue-500 hover:text-blue-500 hover:underline drop-shadow-md">
                إنشاء حساب جديد
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
