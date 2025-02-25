import { useNavigate } from "react-router-dom";
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="doctor-dashboard">
      <h2 className="dashboard-title"></h2>
      <div className="button-container">
        <button className="dashboard-button" onClick={() => navigate("/patient-details")}>
          Patient Details
        </button>
        <button className="dashboard-button" onClick={() => navigate("/q-details")}>
          Q-Details
        </button>
        <button className="dashboard-button" onClick={() => navigate("/medical-form")}>
          Prescription
        </button>
      </div>
      <button className="back-buttonmain" onClick={() => navigate("/")}>
        Main Menu
      </button>
      <button className="back-buttondash" onClick={() => navigate("/doctor-login")}>
  Back
</button>
      
    </div>
  );
};

export default DoctorDashboard;
