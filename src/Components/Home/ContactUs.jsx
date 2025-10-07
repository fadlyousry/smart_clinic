import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <section id="HContact" className="py-20 bg-[#E0F7FA] ">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00BCD4] opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">تواصل معنا</h2>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
          <p className="text-[#757575] max-w-2xl mx-auto text-lg">
            نحن هنا لمساعدتك في أي وقت، زورنا أو تواصل معنا عبر أي من وسائل الاتصال التالية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-[#212121] mb-6 flex items-center">
              <FaMapMarkerAlt className="text-[#009688] mr-3" />
              معلومات الاتصال
            </h3>

            <div className="mb-8">
              <h4 className="font-bold text-[#0097A7] mb-3">عنوان العيادة:</h4>
              <p className="text-[#757575]">شارع الجامعة طنطا الغربيه</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                  <FaPhone className="text-[#009688]" />
                </div>
                <div className="ms-2">
                  <h4 className="font-bold text-[#0097A7] mb-1">الهاتف:</h4>
                  <a href="tel:+201144045412" className="text-[#757575] hover:text-[#00BCD4] transition">
                    20554601660+
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                  <FaEnvelope className="text-[#009688]" />
                </div>
                <div className="ms-2">
                  <h4 className="font-bold text-[#0097A7] mb-1">البريد الإلكتروني:</h4>
                  <a href="mailto:fadlahmed258@gmail.com" className="text-[#757575] hover:text-[#00BCD4] transition">
                    fadlahmed258@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#E0F7FA] p-3 rounded-full mr-4">
                  <FaWhatsapp className="text-[#009688]" />
                </div>
                <div className="ms-2">
                  <h4 className="font-bold text-[#0097A7] mb-1">واتساب:</h4>
                  <a href="https://wa.me/201554601660" className="text-[#757575] hover:text-[#00BCD4] transition">
                    201554601660+
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-lg overflow-hidden"
          >
            <div className="h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6882.352282472555!2d30.813265526634097!3d30.82240805369998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5a2a8b6a42dbf%3A0x8ccc7a75d594b012!2z2YjZhNi52Kkg2KfZhNio2LnYsSDYp9mE2LTYsdin2LEg2KfZhNio2LmI2YTZiNmFINin2YTYudin2YTZhSDYp9mE2YXYs9mK!5e0!3m2!1sar!2seg!4v1620000000000!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-[#0097A7] to-[#009688] shadow-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">للحالات الطارئة فقط</h3>
          <p className="text-xl mb-6">خدمة الطوارئ متاحة 24 ساعة طوال أيام الأسبوع</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="tel:01210677917"
              className="flex items-center bg-white text-[#009688] px-6 py-3 rounded-lg font-bold hover:text-white hover:bg-[#009688] transition"
            >
              <FaPhone className="mr-2 me-2" />
              01210677917
            </a>
            <a
              href="https://wa.me/+201210677917"
              className="flex items-center bg-white text-[#009688] px-6 py-3 rounded-lg font-bold hover:text-white hover:bg-[#0097A7] transition"
            >
              <FaWhatsapp className="mr-2 me-2" />
              واتساب الطوارئ
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
