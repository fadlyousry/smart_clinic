import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export default function AboutClinic() {
  return (
    <section id="HAbout" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-[#0097A7] mb-4">حول العيادة</h2>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full"></div>
        </motion.div>

        <div className="flex flex-col gap-8 md:flex-row items-center mb-16">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <div className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]">
              <h3 className="text-2xl font-bold text-[#0097A7] mb-4">نظرة عامة</h3>
              <p className="text-[#757575] leading-relaxed text-lg">
                عيادة الشفاء مركز طبي متكامل يقدم رعاية صحية عالية الجودة منذ عام 2010. نتميز بفريق طبي متخصص وبيئة
                علاجية مجهزة بأحدث التقنيات الطبية، مع التركيز على الراحة النفسية للمرضى وتقديم خدمة شخصية.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 md:pl-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 12, label: 'سنوات الخبرة', color: 'bg-[#B2EBF2]' },
                { value: 10000, label: 'مريض راضٍ', color: 'bg-[#4DD0E1]' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className={`${item.color} p-4 rounded-lg text-center shadow-sm`}
                >
                  <div className="text-[#00838F] font-bold text-2xl mb-1">
                    {typeof item.value === 'number' ? (
                      <CountUp
                        end={item.value}
                        duration={3}
                        separator={item.value >= 1000 ? ',' : ''}
                        suffix={index !== 3 ? '+' : ''}
                      />
                    ) : (
                      item.value
                    )}
                  </div>
                  <div className="text-[#006064]">{item.label}</div>
                </motion.div>
              ))}

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-[#26C6DA] col-span-2 p-4 rounded-lg text-center shadow-sm"
              >
                <div className="text-[#00838F] font-bold text-2xl mb-1">24/7</div>
                <div className="text-[#006064]">خدمة طوارئ</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]"
          >
            <h3 className="text-2xl font-bold text-[#0097A7] mb-4 flex items-center">
              <svg className="w-8 h-8 mr-3 text-[#00838F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              ما نقدمه
            </h3>
            <ul className="space-y-3 text-[#757575]">
              {[
                "استشارات وفحوصات طبية شاملة",
                "تشخيصات دقيقة بأحدث الأجهزة",
                "برامج علاجية متكاملة",
                "متابعة الأمراض المزمنة",
                "خدمات وقائية وتوعوية",
                // "عيادات تخصصية متنوعة"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#009688] mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#E0F7FA] p-8 rounded-xl shadow-sm border border-[#B2EBF2]"
          >
            <h3 className="text-2xl font-bold text-[#0097A7] mb-4 flex items-center">
              <svg className="w-8 h-8 mr-3 text-[#00838F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              مهمتنا وقيمنا
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#00838F] mb-2">مهمتنا:</h4>
                <p className="text-[#757575]">
                  تقديم رعاية صحية شاملة تعتمد على أحدث المعايير العالمية مع الحفاظ على القيم الإنسانية والاهتمام بكل
                  مريض كفرد له احتياجاته الخاصة.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#00838F] mb-2">قيمنا:</h4>
                <ul className="grid grid-cols-2 gap-2 text-[#757575]">
                  {['الجودة والتميز', 'النزاهة', 'الشفافية', 'التركيز على المريض', 'الابتكار', 'المسؤولية'].map(
                    (item, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-4 h-4 text-[#009688] mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
