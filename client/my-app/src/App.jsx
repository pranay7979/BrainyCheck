import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Predict from "./pages/Predict";
import PreviousScans from "./pages/PreviousScans";
import DiseaseInfo from "./pages/DiseaseInfo";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import ViewPatients from "./pages/ViewPatients";
import AppointDoctor from "./pages/AppointDoctor";
import DoctorDashboard from "./pages/DoctorDashBoard";
import ServiceLoginPage from "./pages/ServiceLoginPage";
import ProtectedRoute from "./pages/ProtectedRoute";
//import DoctorPage from "./pages/Doctor";
import ReceptionistPage from "./pages/ReceptionistDashboard";
import AddDoctor from "./pages/AddDoctor";
import AddReceptionist from "./pages/AddReceptionist";





ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/register" element={<PatientRegistration />} />
            <Route path="/receptionist/patients" element={<ViewPatients />} />
            <Route path="/receptionist/appointdoctor" element={<AppointDoctor />} />
            <Route path="/doctor" element={<DoctorDashboard />} />\
            <Route path="/services" element={<ServiceLoginPage />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/previousscans" element={<PreviousScans />} />
            <Route path="/diseases-info" element={<DiseaseInfo />} />
            <Route path="/adddoctor" element={<AddDoctor />} />
            <Route path="/addreceptionist" element={<AddReceptionist />} />




          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;