import React from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorRatings = ({ ratings, variants, itemVariants }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <motion.span key={i} whileHover={{ scale: 1.2 }}>
                <FaStar className={`transition-all duration-300 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            </motion.span>
        ));
    };

    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    return (
        <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8"
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
        >
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-[#0097A7] flex items-center gap-2">
                    <FaStar /> تقييمات المرضى
                </h3>
            </div>
            <div className="p-6 space-y-6">
                {ratings.map((rating, index) => (
                    <motion.div
                        key={rating.id}
                        className="bg-[#E0F7FA] p-4 rounded-lg border border-gray-200 hover:bg-[#B2EBF2] transition-colors"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-[#006064]">{rating.patient}</span>
                            <div className="flex gap-1">
                                {renderStars(rating.rating)}
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">{rating.comment}</p>
                    </motion.div>
                ))}
            </div>
            <div className="p-4 bg-gradient-to-r from-[#0097A7] to-[#006064] text-white flex items-center justify-center gap-4">
                <div className="flex gap-1">
                    {renderStars(Math.round(averageRating))}
                </div>
                <span className="font-medium">{averageRating.toFixed(1)} ({ratings.length} تقييم)</span>
            </div>
        </motion.div>
    );
};

export default DoctorRatings;