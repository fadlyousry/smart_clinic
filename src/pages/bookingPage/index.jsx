import React from 'react';
import { Body } from './component/Body';
import { BookingPageHeader } from './component/BookingPageHeader.jsx';
import { FooterInfo } from './component/FooterInfo.jsx';
import { Schema, formData, handleSubmit } from './schema.js';
import Navbar from '../../Components/Navbar/Navbar.jsx';
import Footer from '../../Components/Footer/Footer.jsx';

export default function ClinicBookingPageArabic() {
  return (
    <div className="min-h-screen bg-cyan-100 mt-12" dir="rtl">
      {/* <BookingPageHeader /> */}
      <Navbar />
      <div className="container mx-auto py-10 px-4 md:w-3/4 ">
        <Body formData={formData} handleSubmit={handleSubmit} Schema={Schema} />
        {/* <FooterInfo /> */}
      </div>
      <Footer />
    </div>
  );
}
