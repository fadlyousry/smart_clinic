
import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesPages from "./routes/Routes.jsx";
import { setupRealtimePatients } from "./lib/supabaseRealtime.js";
import { removeRealtimeChannel } from "./lib/supabaseRealtime.js";

import useDoctorDashboardStore from "./store/doctorDashboardStore.js";
import { ToastContainer } from 'react-toastify';

export default function App() {
  const fetchData = useDoctorDashboardStore((state) => state.fetchData);

useEffect(() => {
  fetchData();

  const channel = setupRealtimePatients();
  return () => {
    removeRealtimeChannel(channel);
  };
}, [fetchData]);


  return (
    <BrowserRouter>
      <RoutesPages />
      <ToastContainer />
    </BrowserRouter>
  );
}