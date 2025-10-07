import React, { useState } from 'react';
import { FaUserMd } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OptimizedImage = ({ src, alt, className, placeholder: Placeholder = FaUserMd, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      {(!loaded || !error || !src) && (
        <div
          className={`${className} flex items-center justify-center bg-gradient-to-br from-[#0097A7] to-[#006064] text-white`}
        >
          <Placeholder className="text-5xl" />
        </div>
      )}

      {src && (
        <motion.img
          src={src}
          alt={alt}
          className={`${className} ${!loaded || error ? 'opacity-0 absolute' : 'opacity-100 relative'} object-cover`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          onClick={onClick}
        />
      )}
    </>
  );
};

export default OptimizedImage;
