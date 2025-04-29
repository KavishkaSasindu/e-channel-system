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
import MySchedules from "./pages/doctor/MySchedules";
import OrderRead from "./pages/staff/OrderRead";
import ViewOrder from "./pages/staff/ViewOrder";
import UpdateDoctor from "./pages/staff/UpdateDoctor";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/all-doctors" element={<AllDoctors />} />
          <Route path="/about" element={<AboutPage />} />

          {/* auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/login-staff" element={<LogInStaff />} />
          <Route path="/login-doctor" element={<LogInDoctor />} />

          {/* doctor routes */}
          <Route path="/doctor/queue/:doctorId" element={<DoctorQueue />} />
          <Route
            path="/patient/appointment/queue/:patientId/:appointmentId/:doctorId"
            element={<PatientQueue />}
          />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/doctor/schedules/:id" element={<MySchedules />} />

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
          <Route path="/order/read/:id" element={<OrderRead />} />
          <Route path="/order/view/:id" element={<ViewOrder />} />
          <Route
            path="/staff/update-doctor/:id/:profileId"
            element={<UpdateDoctor />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
