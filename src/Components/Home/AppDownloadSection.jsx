import { motion } from 'framer-motion';
import { FaMobileAlt, FaHeadset, FaCalendarAlt, FaDownload, FaApple, FaGooglePlay } from 'react-icons/fa';
import QRCode from 'react-qr-code';

const AppDownloadSection = () => {
  return (
    <section className="py-16 ">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00BCD4] opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#E0F7FA] rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Content */}
            <div className="md:w-1/2 p-8 md:p-10 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0097A7] mb-4">حمل تطبيق العيادة الذكية</h2>
              <p className="text-[#757575] mb-6">
                تواصل مع الدكتور مباشرة، احجز مواعيدك، تابع حالتك الصحية وحصل على نصائح طبية من خلال تطبيقنا.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121] text-lg">حجز المواعيد</h3>
                    <p className="text-[#757575]">احجز موعدك في أي وقت ومن أي مكان</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaMobileAlt className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121]  text-lg">سهولة الاستخدام</h3>
                    <p className="text-[#757575]">سهولة استخدام التطبيق للمستخدمين</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-[#00BCD4] to-[#009688] p-3 rounded-lg mr-4">
                    <FaHeadset className="text-white text-2xl" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-[#212121] text-lg">دعم على مدار الساعة</h3>
                    <p className="text-[#757575]">فريق الدعم متواجد 24/7 للإجابة على استفساراتك</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - QR Code */}
            {/* Right Side - Coming Soon Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#0097A7] to-[#009688] p-8 md:p-10 flex flex-col items-center justify-center">
              <div className="text-center text-white mb-6">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">قريبًا</h3>
                <p className="text-[#B2EBF2] text-lg">سيتم توفير إمكانية تحميل التطبيق قريبًا</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <span className="text-[#009688] font-bold text-xl">🚧 جاري العمل...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
