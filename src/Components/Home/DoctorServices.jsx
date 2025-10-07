import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaStethoscope,
  FaHeartbeat,
  FaLungs,
  FaBrain,
  FaClinicMedical,
  FaXRay,
  FaMobileAlt,
  FaCalendarAlt,
  FaVideo,
  FaFileMedicalAlt,
  FaNotesMedical,
  FaBell,
  FaUserClock,
  FaExclamationTriangle as FaWarning,
} from 'react-icons/fa';
import { useProfileStore } from '../../store/profile';
import { useEffect, useState } from 'react';

export default function DoctorServices() {
  const { getDoctorProfile, getDoctorImage } = useProfileStore();
  const [profile, setProfile] = useState({});
  const [image, setImage] = useState({});
  const addProfile = async () => {
    const profileData = await getDoctorProfile();
    const img = await getDoctorImage(profileData.image);
    setImage(img);
    setProfile(profileData);
  };
  useEffect(() => {
    addProfile();
  }, []);

  const doctor = {
    name: profile.name,
    specialty: profile.specialty,
    image: image,
    bio: 'طبيب استشاري بأمراض الباطنة والقلب، حاصل على البورد الأمريكي في الطب الباطني والزمالة البريطانية في أمراض القلب. يتمتع بخبرة تزيد عن 15 عاماً في تشخيص وعلاج الحالات الحرجة والمزمنة.',
    services: [
      {
        title: 'الكشف الطبي العام',
        icon: <FaStethoscope className="text-3xl" />,
        description: 'فحص شامل وتشخيص دقيق للحالات العامة مع وضع خطة علاجية متكاملة',
      },
      {
        title: 'أمراض القلب',
        icon: <FaHeartbeat className="text-3xl" />,
        description: 'تشخيص وعلاج أمراض القلب والشرايين وارتفاع ضغط الدم',
      },
      {
        title: 'أمراض الصدر',
        icon: <FaLungs className="text-3xl" />,
        description: 'علاج أمراض الجهاز التنفسي والرئتين والربو الشعبي',
      },
      {
        title: 'الضغط والسكري',
        icon: <FaClinicMedical className="text-3xl" />,
        description: 'متابعة وعلاج حالات الضغط والسكري والدهون بالدم',
      },
    ],
  };
  const navigate = useNavigate();
  const PatientView = () => {
    navigate('../profile');
  };
  return (
    <section id="HServices" className="py-20 bg-[#E0F7FA] relative ">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#00BCD4] blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#009688] blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 xl:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#0097A7] mb-2">خدمات {doctor.name}</h2>
          <p className="text-xl xl:text-2xl text-[#009688] mb-4">{doctor.specialty}</p>
          <div className="w-24 h-1 bg-[#00BCD4] mx-auto mb-6"></div>
          <p className="text-[#757575] max-w-4xl mx-auto text-lg xl:text-xl leading-relaxed">
            يقدم الدكتور مجموعة متكاملة من الخدمات الطبية بأعلى معايير الجودة والكفاءة الطبية
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 xl:w-2/5"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="h-64 xl:h-72 bg-gradient-to-r from-[#00BCD4] to-[#009688] flex items-center justify-center relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-48 h-48 xl:w-56 xl:h-56 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
              <div className="p-6 xl:p-8">
                <h3 className="text-2xl xl:text-3xl font-bold text-[#212121] mb-2">{doctor.name}</h3>
                <p className="text-[#009688] text-lg xl:text-xl mb-4">{doctor.specialty}</p>
                <p className="text-[#757575] mb-6 xl:mb-8 leading-relaxed">{doctor.bio}</p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={PatientView}
                    className="inline-block bg-[#009688] text-white px-8 py-3 rounded-lg hover:bg-[#00897B] transition shadow-md"
                  >
                    عرض الملف الشخصي الكامل
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-2/3 xl:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {doctor.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full"
              >
                <div className="p-6 xl:p-7 flex-grow">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-r from-[#B2EBF2] to-[#80DEEA] flex items-center justify-center text-[#0097A7] mx-auto"
                  >
                    {service.icon}
                  </motion.div>

                  <h3 className="text-xl xl:text-2xl font-bold text-[#212121] mb-3 text-center">{service.title}</h3>
                  <p className="text-[#757575] mb-4 text-center xl:text-lg leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-br from-[#0097A7] to-[#009688] shadow-2xl overflow-hidden text-white"
        >
          <div className="p-8 xl:p-10 flex flex-col md:flex-row items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
              <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-xl bg-white bg-opacity-20 flex items-center justify-center shadow-inner">
                <FaMobileAlt className="text-4xl xl:text-5xl text-[#009688]" />
              </div>
            </motion.div>

            <div className="md:w-2/3 md:pl-8">
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl xl:text-3xl font-bold mb-6 text-center md:text-right"
              >
                الخدمات الذكية للعيادة
              </motion.h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                {[
                  {
                    title: 'حجز مواعيد أونلاين',
                    icon: <FaCalendarAlt className="text-2xl xl:text-3xl" />,
                    desc: 'احجز موعدك بسهولة في أي وقت',
                  },

                  {
                    title: 'متابعة النتائج',
                    icon: <FaFileMedicalAlt className="text-2xl xl:text-3xl relative" />,
                    desc: (
                      <div className="relative flex flex-col items-center">
                        <span>خدمة التحاليل المنزلية متاحة الآن</span>
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          New
                        </span>
                      </div>
                    ),
                  },

                  {
                    title: 'معرفة السجل المرضي',
                    icon: <FaNotesMedical className="text-2xl xl:text-3xl" />,
                    desc: (
                      <div className="relative flex flex-col items-center">
                        <span> يمكنك عرض كل زياراتك السابقة وسجلاتك الطبية بسهولة </span>
                        <span className=" bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          New
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: 'معرفة الدور في الكشف',
                    icon: <FaUserClock className="text-2xl xl:text-3xl" />,
                    desc: (
                      <div className="relative flex flex-col items-center">
                        <span> تابع ترتيبك الحالي في قائمة الانتظار دون الحاجة للحضور مبكرًا</span>
                        <span className=" bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          New
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: 'استشارات عن بعد',
                    icon: <FaVideo className="text-2xl  xl:text-3xl" />,
                    desc: (
                      <span className="text-red-400 ">
                        جاري العمل على توفير الخدمه قريبا
                        <FaWarning className="text-xl " />
                      </span>
                    ),
                  },
                  {
                    title: 'تذكير بالمواعيد',
                    icon: <FaBell className="text-2xl xl:text-3xl" />,
                    desc: (
                      <span className="text-red-400">
                        {' '}
                        جاري العمل على توفير الخدمه قريبا
                        <FaWarning className="text-xl " />
                      </span>
                    ),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{
                      y: -5,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                    className="flex flex-col items-center text-center p-4 xl:p-5 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-default"
                  >
                    <div className="w-14 h-14 xl:w-16 hover:bg-[#009688] hover:text-[#B2EBF2] xl:h-16 mb-3 flex items-center justify-center text-[#009688] bg-[#B2EBF2] bg-opacity-20 rounded-full">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-[#212121] mb-1 xl:text-lg">{feature.title}</h4>
                    <p className="text-xs xl:text-sm text-[#757575] text-opacity-80">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
