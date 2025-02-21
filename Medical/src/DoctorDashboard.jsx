import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <button onClick={() => navigate("/patient-details")}>Patient Details</button>
      <button onClick={() => navigate("/q-details")}>Q-Details</button>
      <button onClick={() => navigate("/medical-form")}>Prescription</button>
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Back to Main Menu
      </button>

    </div>
  );
};

export default DoctorDashboard;
