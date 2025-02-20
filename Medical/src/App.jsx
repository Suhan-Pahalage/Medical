 
/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicalForm from "./MedicalForm";
import DoctorLogin from "./DoctorLogin";
import NurseLogin from "./NurseLogin";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the Medical System</h1>
        <Routes>
          <Route path="/" element={<h2>Select Login: <a href="/doctor-login">Doctor</a> | <a href="/nurse-login">Nurse</a></h2>} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/nurse-login" element={<NurseLogin />} />
          <Route path="/medical-form" element={<MedicalForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MedicalForm from "./MedicalForm";
import DoctorLogin from "./DoctorLogin";
import NurseLogin from "./NurseLogin";
import PatientRegister from "./PatientRegister"; // Import new page
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the Medical System</h1>
        <Routes>
          <Route path="/" element={<h2>Select Login: <a href="/doctor-login">Doctor</a> | <a href="/nurse-login">Nurse</a></h2>} />
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
