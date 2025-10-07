import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';
import { supabase } from '../supaBase/booking';

const useAuthStore = create(
  persist(
    (set, get) => ({
      current_user: null,

      showAlert: (icon, title, text) => {
        Swal.fire({
          icon,
          title,
          text,
          confirmButtonColor: '#0097A7',
          background: '#f8f9fa',
          customClass: {
            container: 'custom-swal-container',
            popup: 'rounded-lg shadow-xl',
          },
        });
      },

      login: async ({ email, password }, navigate) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw error;
          }

          set({ current_user: data.user?.user_metadata || null });
          get().showAlert('success', 'تم تسجيل الدخول بنجاح', 'مرحباً بعودتك!');
          if (data.user?.user_metadata.role == 'doctor') navigate('/DoctorDashboard');
          else if (data.user?.user_metadata.role == 'nurse') navigate('/nursing-dashboard');
          else navigate('/');
        } catch (error) {
          get().showAlert('error', 'خطأ في تسجيل الدخول', 'يوجد خطأ فى الايميل أو كلمة السر');
        }
      },

      register: async ({ email, password, phone, name, address }, { resetForm }) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                phone,
                address,
                role: 'user',
              },
            },
          });

          if (error) {
            throw error;
          }

          set({ current_user: data.user?.user_metadata || null });
          get().showAlert(
            'success',
            'تم التسجيل بنجاح',
            'تم إنشاء حسابك بنجاح. يرجى التحقق من بريدك الإلكتروني للتأكيد.'
          );
          resetForm();
          return true;
        } catch (error) {
          get().showAlert('error', 'خطأ في التسجيل', error.message || 'حدث خطأ أثناء التسجيل');
          return false;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();

          if (error) {
            throw error;
          }

          set({ current_user: null });
          get().showAlert('success', 'تم تسجيل الخروج', 'نراكم قريباً!');
          return true;
        } catch (error) {
          get().showAlert('error', 'خطأ في تسجيل الخروج', error.message || 'حدث خطأ أثناء تسجيل الخروج');
          return false;
        }
      },

      handleForgotPassword: async email => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `https://health-project-mu.vercel.app/resetpassword`,
          });

          if (error) {
            throw error;
          }

          get().showAlert(
            'success',
            'تم إرسال رابط إعادة التعيين',
            'إذا كان البريد مسجلاً لدينا، ستتلقى رابط إعادة التعيين على بريدك الإلكتروني.'
          );
          return true;
        } catch (error) {
          get().showAlert('error', 'خطأ في إرسال البريد', error.message || 'حدث خطأ أثناء إرسال البريد');
          return false;
        }
      },

      updatePassword: async (newPassword, next) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) {
            throw error;
          }

          get().showAlert('success', 'تم التحديث بنجاح', 'تم تحديث كلمة المرور بنجاح');
          window.history.replaceState(null, '', window.location.pathname);

          if (next && typeof next === 'function') {
            next();
          }
          return true;
        } catch (error) {
          get().showAlert('error', 'خطأ في تحديث كلمة المرور', error.message || 'حدث خطأ أثناء تحديث كلمة المرور');
          return false;
        }
      },

      CUname: () => get().current_user?.full_name || '',
      CUaddress: () => get().current_user?.address || '',
      CUphone: () => get().current_user?.phone || '',
      CUrole: () => get().current_user?.role || '',
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ current_user: state.current_user }),
    }
  )
);

export default useAuthStore;
