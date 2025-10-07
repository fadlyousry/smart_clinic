import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../../assets/img/logo.png'; // Adjust the path as necessary
const Footer = () => {
  return (
    <footer className="bg-[#0097A7] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center mb-6"
            >
              <h3 style={{
                fontFamily: "var(--logo-font)",
                marginTop: 5,
                marginBottom: 0,
                color: "var(--color-text-white)",
                letterSpacing: 2,
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                paddingLeft: 60,
              }} className=" text-2xl flex items-center">
                Clinic
                <img
                  src={logo}
                  width={35}
                  height={35}
                  alt="Logo"

                />
                Smart
              </h3>
            </motion.div>
            <p className="text-[#B2EBF2] mb-4">
              نقدم رعاية طبية متكاملة بمعايير عالمية في بيئة آمنة ومريحة.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 space-x-reverse mt-6">
              {[
                { icon: <FaFacebook className="text-xl" />, color: "hover:text-[#1877F2]" },
                { icon: <FaTwitter className="text-xl" />, color: "hover:text-[#1DA1F2]" },
                { icon: <FaInstagram className="text-xl" />, color: "hover:text-[#E1306C]" },

                { icon: <FaWhatsapp className="text-xl ms-3" />, color: "hover:text-[#25D366]" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3 }}
                  className={`text-white ${social.color} transition-colors duration-300`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-[#B2EBF2]">
              {[
                { label: 'الرئيسية', href: '#' },
                { label: 'من نحن', href: '#HAbout' },
                { label: 'الخدمات', href: '#HServices' },
                { label: 'اتصل بنا', href: '#HContact' },
              ].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a href={item.href} className="hover:text-white transition">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">اتصل بنا</h4>
            <ul className="space-y-3 text-[#B2EBF2]">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 me-2 flex-shrink-0" />
                <span>شارع الجامعة طنطا الغربيه</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-2 me-2 flex-shrink-0" />
                <a href="tel:+20554601660" className="hover:text-white transition"> 1554601660 (20+)</a>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-2 me-2 flex-shrink-0" />
                <a href="mailto:fadlahmed258@gmail.com" className="hover:text-white transition">fadlahmed258@gmail.com</a>
              </li>
            </ul>
          </div>



        </div>


        <div className="border-t border-[#00BCD4] mt-8 pt-6 text-center text-[#B2EBF2]">
          <p>© {new Date().getFullYear()} Smart Clinic جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;