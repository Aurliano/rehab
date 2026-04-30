// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import PatientSelection from "./pages/PatientSelection.tsx";
import AddPatient from "./pages/AddPatient.tsx";
import Schedule from "./pages/Schedule.tsx";



function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="patient-selection" element={<PatientSelection />} />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>
    </Routes>
  );
}

export default App;
