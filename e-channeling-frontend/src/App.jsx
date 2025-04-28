import React from "react";
import DoctorQueue from "./pages/doctor/DoctorQueue";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientQueue from "./pages/patient/PatientQueue";
import Home from "./pages/Home";
import Navbar from "./pages/components/Navbar";
import Register from "./pages/common/Register";
import LogIn from "./pages/common/LogIn";
import LogInStaff from "./pages/common/LogInStaff";
import AllDoctors from "./pages/public/AllDoctors";
import Dashboard from "./pages/staff/Dashboard";
import AddDoctor from "./pages/staff/AddDoctor";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import AllAppointmentsByUser from "./pages/patient/AllAppointmentsByUser";
import LogInDoctor from "./pages/common/LogInDoctor";
import AboutPage from "./pages/common/AboutPage";
import Profile from "./pages/patient/Profile";
import CreatePrescription from "./pages/patient/CreatePrescription";
import Orders from "./pages/staff/Orders";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          {/* auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/login-staff" element={<LogInStaff />} />
          <Route path="/login-doctor" element={<LogInDoctor />} />

          {/* public routes */}
          <Route path="/all-doctors" element={<AllDoctors />} />
          <Route path="/doctor/queue/:doctorId" element={<DoctorQueue />} />
          <Route
            path="/patient/appointment/queue/:patientId/:appointmentId/:doctorId"
            element={<PatientQueue />}
          />
          <Route path="/doctor/:id" element={<DoctorProfile />} />

          {/* patient */}
          <Route
            path="/patient/appointments/:id"
            element={<AllAppointmentsByUser />}
          />
          <Route path="patient/profile/:id" element={<Profile />} />
          <Route path="patient/order/:id" element={<CreatePrescription />} />

          {/* staff routes */}
          <Route path="/staff/dashboard" element={<Dashboard />} />
          <Route path="/staff/dashboard/add-doctor" element={<AddDoctor />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
