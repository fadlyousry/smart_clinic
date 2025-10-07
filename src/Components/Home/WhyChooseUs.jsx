import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FaClock, FaUserMd, FaCalendarAlt, FaShieldAlt, FaStar, FaClinicMedical } from 'react-icons/fa';

export default function WhyChooseUs() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  const stats = [
    { number: 12, title: "سنوات الخبرة" },
    { number: 10000, title: "مريض راضٍ" },
    { number: "24/7", title: "خدمة الطوارئ" }
  ];

  const features = [
    {
      icon: <FaClock className="text-3xl" />,
      title: "طوارئ 24/7",
      description: "خدمة طوارئ متاحة على مدار الساعة طوال أيام الأسبوع مع فريق طبي متخصص"
    },
    {
      icon: <FaUserMd className="text-3xl" />,
      title: "أطباء معتمدون",
      description: "فريق من الأطباء الاستشاريين الحاصلين على أعلى الشهادات والتدريبات العالمية"
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "حجوزات أونلاين",
      description: "نظام حجز إلكتروني متطور يمكنك من اختيار الطبيب والموعد المناسبين بسهولة"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "بيئة نظيفة وآمنة",
      description: "عيادة مطابقة لأعلى معايير النظافة والتعقيم لضمان سلامة المرضى"
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "جودة الخدمة",
      description: "التزامنا بتقديم أفضل رعاية طبية وفق أحدث البروتوكولات العالمية"
    },
    {
      icon: <FaClinicMedical className="text-3xl" />,
      title: "تكنولوجيا متطورة",
      description: "أجهزة طبية حديثة وتقنيات تشخيصية متقدمة لنتائج دقيقة"
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#B2EBF2] opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">
            لماذا تختار عيادتنا؟
          </h2>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
          <p className="text-[#757575] max-w-2xl mx-auto text-lg">
            نقدم تجربة طبية فريدة تجمع بين التميز الطبي والرعاية الإنسانية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#E0F7FA] overflow-hidden"
            >
              <div className="p-6">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#00BCD4] to-[#009688] flex items-center justify-center text-white"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-bold text-[#212121] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#757575]">
                  {feature.description}
                </p>
              </div>

              <div className="absolute inset-0 border-2 border-[#00BCD4] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-[#0097A7] to-[#009688] shadow-xl p-8 text-white"
        >
          <div ref={ref}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-4">
                  {typeof stat.number === 'number' ? (
                    <div className="text-3xl font-bold mb-2">
                      {inView && (
                        <CountUp
                          end={stat.number}
                          duration={3}
                          separator=","
                        />
                      )}+
                    </div>
                  ) : (
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  )}
                  <div>{stat.title}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}