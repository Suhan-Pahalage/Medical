 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Import the new login page
import MedicalForm from "./MedicalForm";
import DoctorLogin from "./DoctorLogin";
import NurseLogin from "./NurseLogin";
import PatientRegister from "./PatientRegister"; // Import new page
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/nurse-login" element={<NurseLogin />} />
          <Route path="/medical-form" element={<MedicalForm />} />
          <Route path="/patient-register" element={<PatientRegister />} /> {/* New route for nurse */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
