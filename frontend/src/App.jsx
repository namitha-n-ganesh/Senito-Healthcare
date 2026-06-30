import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import PatientLogin from "./pages/PatientLogin";
import CaregiverLogin from "./pages/CaregiverLogin";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/caregiver-login" element={<CaregiverLogin />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;