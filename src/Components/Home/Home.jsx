import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const HeroSection = React.lazy(() => import(/* webpackPrefetch: true */ './HeroSection'));
const AboutClinic = React.lazy(() => import('./AboutClinic'));
const DoctorServices = React.lazy(() => import('./DoctorServices'));
const Testimonials = React.lazy(() => import('./Testimonials'));
const ContactUs = React.lazy(() => import('./ContactUs'));
const WhyChooseUs = React.lazy(() => import('./WhyChooseUs'));
const AppDownloadSection = React.lazy(() => import('./AppDownloadSection'));
const MedicalResourcesSection = React.lazy(() => import('./MedicalResourcesSection'));

function Home() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <AboutClinic />
        <DoctorServices />
        <MedicalResourcesSection />
        <Testimonials />
        <WhyChooseUs />
        <ContactUs />
        <AppDownloadSection />
      </Suspense>
    </>
  );
}

export default Home;
