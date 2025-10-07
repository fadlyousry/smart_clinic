import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";
import { FaUserCircle, FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from 'react-icons/fa';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    rating: 0,
    comment: ''
  });

  // تحميل التقييمات من localStorage عند التحميل الأولي
  const [testimonials, setTestimonials] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('testimonials');
      return saved ? JSON.parse(saved) : [
        {
          name: "محمد أحمد",
          role: "مريض سابق",
          rating: 3,
          comment: "الدكتور أحمد من أفضل الأطباء الذين تعاملت معهم، شرح وافي ودقيق للحالة وقدم خطة علاج ممتازة."
        },
        {
          name: "سارة خالد",
          role: "مريضة",
          rating: 4,
          comment: "الرعاية المقدمة ممتازة والطبيب محترف جداً في التشخيص والمتابعة، أنصح الجميع به."
        },
        {
          name: "علي محمود",
          role: "مرافق مريض",
          rating: 2,
          comment: "العيادة نظيفة والمواعيد دقيقة، الدكتور متابع لكل التفاصيل ويعطي وقت كافي لكل مريض."
        },
        {
          name: "نورا سعد",
          role: "مريضة",
          rating: 5,
          comment: "تجربة ممتازة من جميع النواحي، الخدمة الذكية في الحجز سهلت علي الكثير."
        }
      ];
    }
    return [];
  });

  // حفظ التقييمات في localStorage عند أي تغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('testimonials', JSON.stringify(testimonials));
    }
  }, [testimonials]);

  useEffect(() => {
    if (!showForm && testimonials.length > 0) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, showForm]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setNewTestimonial(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.comment) {
      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);
      setNewTestimonial({
        name: '',
        role: '',
        rating: 0,
        comment: ''
      });
      setShowForm(false);
      setCurrentIndex(updatedTestimonials.length - 1); // عرض التقييم الجديد مباشرة
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <section className="py-16 md:py-20  bg-[#E0F7FA] overflow-hidden  relative ">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#B2EBF2] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#009688] opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0097A7] mb-3 md:mb-4">
            آراء عملائنا
          </h2>
          <div className="w-20 md:w-24 h-1 bg-[#00BCD4] mx-auto rounded-full mb-4 md:mb-5"></div>
          <p className="text-[#757575] text-base md:text-lg max-w-2xl mx-auto">
            تقييمات المرضى الذين استفادوا من خدمات عيادتنا
          </p>
        </motion.div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${showForm ? 'bg-[#f44336] hover:bg-[#d32f2f]' : 'bg-[#009688] hover:bg-[#00796B]'} text-white transition-colors`}
          >
            {showForm ? (
              <>
                <FaTimes /> إلغاء
              </>
            ) : (
              <>
                <FaPlus /> أضف تقييمك
              </>
            )}
          </button>
        </div>

        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white  rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm max-w-3xl mx-auto"
          >
            <h3 className="text-xl md:text-2xl font-bold text-[#0097A7] mb-6 text-center">
              شاركنا تجربتك
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[#0097A7] mb-1">الاسم</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTestimonial.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#B2EBF2] focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-[#0097A7] mb-1">
                    الصفة (اختياري)
                  </label>
                  <select
                  
                    id="role"
                    name="role"
                    value={newTestimonial.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-[#B2EBF2] focus:outline-none focus:ring-2 focus:ring-[#0097A7] bg-white text-[#212121]"
                  >
                    <option value=""></option>
                    <option value="مريض">مريض</option>
                    <option value="مرافق مريض">مرافق مريض</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-[#0097A7] mb-1">التقييم</label>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl ${star <= newTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-[#0097A7] mb-1">التعليق</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newTestimonial.comment}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-[#B2EBF2] focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-[#009688] hover:bg-[#00796B] text-white rounded-lg transition-colors"
                >
                  إرسال التقييم
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <>
            <div className="relative h-[380px] sm:h-[320px] md:h-[280px]">
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -ml-2 sm:-ml-4"
                aria-label="السابق"
                disabled={testimonials.length === 0}
              >
                <FaChevronLeft className="text-sm sm:text-base" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center text-[#009688] hover:bg-[#E0F7FA] transition -mr-2 sm:-mr-4"
                aria-label="التالي"
                disabled={testimonials.length === 0}
              >
                <FaChevronRight className="text-sm sm:text-base" />
              </button>

              {testimonials.length > 0 ? (
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 px-2 sm:px-4"
                  >
                    <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 h-full">
                      <div className="flex-shrink-0 text-[#0097A7]">
                        <FaUserCircle className="text-6xl sm:text-7xl md:text-8xl opacity-80" />
                      </div>

                      <div className="text-center md:text-right flex-1">
                        <FaQuoteLeft className="text-[#009688] text-xl md:text-2xl mb-3 md:mb-4 mx-auto md:mx-0" />

                        <p className="text-[#757575] text-sm sm:text-base md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                          {testimonials[currentIndex].comment}
                        </p>

                        <div className="mb-3 md:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`inline-block mx-0.5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              size={18}
                            />
                          ))}
                        </div>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#212121] mb-1">
                          {testimonials[currentIndex].name}
                        </h3>
                        <p className="text-[#0097A7] text-sm md:text-base">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[#757575] text-lg">لا توجد تقييمات متاحة حالياً</p>
                </div>
              )}
            </div>

            {testimonials.length > 0 && (
              <div className="flex justify-center mt-6 md:mt-8 gap-1.5 md:gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${currentIndex === index ? 'bg-[#009688] w-4 md:w-6' : 'bg-[#B2EBF2] hover:bg-[#80DEEA]'}`}
                    aria-label={`انتقل إلى التقييم ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}