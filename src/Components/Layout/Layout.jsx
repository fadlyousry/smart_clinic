import React from 'react';
import Style from './Layout.module.css';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import Home from '../Home/Home.jsx';
export default function Layout() {
  return (
    <>
      <Navbar />
      {/* <div className=''> */}
      <Outlet>

      </Outlet>
      {/* </div> */}
      <Footer />
    </>
  );
}
