import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import MedicalForm from "./MedicalForm";
import DoctorLogin from "./DoctorLogin";
import NurseLogin from "./NurseLogin";
import PatientRegister from "./PatientRegister";
import PatientDetails from "./PatientDetails"; // ✅ Import new page
import Qdetails from "./Qdetails";
import DoctorDashboard from "./DoctorDashboard"; // Import Dashboard
import HistoryView from "./HistoryView";


import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/nurse-login" element={<NurseLogin />} />
          <Route path="/medical-form" element={<MedicalForm />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/patient-details" element={<PatientDetails />} /> {/* ✅ New Route */}
          <Route path = "/q-details" element = {<Qdetails/>}/>
          <Route path="/history-view" element={<HistoryView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

