import React from 'react';
import dr from '../../../assets/dr.jpeg';
import pitttttt from '../../../assets/pitttttt.png';
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import { logInAndRegisterSchema } from '../../../forms/schema/index.js';
import useAuthStore from '../../../store/auth.js';

export default function Register() {
  const { register } = useAuthStore();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone: '',
    },
    validationSchema: logInAndRegisterSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Register Data:', values);
      register(values, { resetForm });
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
          <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">إنشاء حساب</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* الاسم بالكامل */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">الاسم بالكامل</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="ادخل اسمك بالكامل"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.name}</p>
              )}
            </div>

            {/* البريد الالكتروني */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">البريد الالكتروني</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="ادخل بريدك الالكتروني .."
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

            {/* كلمة المرور وتأكيدها */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-white text-right drop-shadow-md">كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="ادخل كلمة المرور"
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

              <div>
                <label className="block mb-1 font-medium text-white text-right drop-shadow-md">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  placeholder="تأكيد كلمة المرور"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* العنوان */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">العنوان</label>
              <input
                type="text"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                placeholder="اكتب عنوانك هنا"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                  formik.touched.address && formik.errors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.address}</p>
              )}
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block mb-1 font-medium text-white text-right drop-shadow-md">رقم الهاتف</label>
              <input
                type="text"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                placeholder="ادخل رقم الهاتف"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 text-right bg-white/90 ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-right drop-shadow-md">{formik.errors.phone}</p>
              )}
            </div>

            {/* زر التسجيل */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="w-full hover:bg-[#009688] bg-[#0097A7] text-white py-2.5 px-4 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          transition duration-150 ease-in-out font-medium"
              >
                سجل الآن
              </button>
            </div>

            {/* رابط تسجيل الدخول */}
            <div className="text-center mt-4 text-sm">
              <span className="text-white drop-shadow-md">لديك حساب بالفعل؟ </span>
              <NavLink to="/login" className="text-blue-500  hover:underline font-medium drop-shadow-md">
                سجل الدخول
              </NavLink>
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
