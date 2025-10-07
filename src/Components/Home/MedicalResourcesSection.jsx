import { motion } from 'framer-motion';
import { FaBookMedical, FaFirstAid, FaArrowLeft, FaHeartbeat, FaBriefcaseMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MedicalResourcesSection = () => {
  const navigate = useNavigate();
  const resources = [
    {
      title: 'المكتبة الطبية',
      icon: <FaBookMedical className="text-4xl text-[#0097A7]" />,
      description: 'مقالات طبية موثقة تغطي كافة التخصصات الطبية',
      features: ['أمراض القلب والشرايين', 'السكري وضغط الدم', 'صحة الجهاز الهضمي', 'أمراض الجهاز التنفسي'],
      btnText: 'استكشف المقالات',
      link: 'MedicalArticles',
    },
    {
      title: 'الإسعافات الأولية',
      icon: <FaFirstAid className="text-4xl text-[#0097A7]" />,
      description: 'دليل عملي للإجراءات الطبية الطارئة',
      features: ['إسعاف الجروح والحروق', 'التعامل مع الكسور', 'إنعاش القلب الرئوي', 'حالات التسمم الطارئة'],
      btnText: 'تعلم الإسعافات',
      link: 'firstaid',
    },
  ];

  return (
    <section className="py-20 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#00BCD4] opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0097A7] mb-4">موارد طبية للمعرفة والاستفادة</h2>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-5"></div>
          <p className="text-[#757575] max-w-2xl mx-auto text-lg">
            معلومات طبية موثوقة وإرشادات إسعافية أولية مقدمة من أطباء متخصصين
          </p>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white  shadow-lg border border-[#B2EBF2] overflow-hidden"
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row">
                {/* Icon Section */}
                <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                  <div className="bg-[#E0F7FA] w-20 h-20 rounded-full flex items-center justify-center">
                    {resource.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-3/4 md:pr-4">
                  <h3 className="text-2xl font-bold text-[#0097A7] mb-3">{resource.title}</h3>
                  <p className="text-[#757575] mb-4">{resource.description}</p>

                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {resource.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span
                          className={`w-2 h-2 rounded-full mt-2 mr-2 ${index === 0 ? 'bg-[#009688]' : 'bg-[#009787]'}`}
                        ></span>
                        <span className="text-[#616161] mr-2">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    // href={resource.link}
                    onClick={() => navigate(`/${resource.link}`)}
                    className={`inline-flex items-center rounded-md border-1 p-2 ${
                      index === 0 ? 'text-[#009688]' : 'text-[#009688]'
                    } font-semibold`}
                  >
                    <span>{resource.btnText}</span>
                    <FaArrowLeft className="mr-2" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalResourcesSection;
