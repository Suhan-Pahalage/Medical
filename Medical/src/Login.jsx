import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure CSS styling

const Login = () => {
  const navigate = useNavigate();

  // Function to close the app
  const handleExit = () => {
    alert("Please close the tab manually."); // This works for standalone apps or browser tabs
  };

  return (
    <div className="login-container">
      <h1>Welcome to the Medical System</h1>
      <p>Select your role:</p>

      <div className="button-container">
        <button className="login-button doctor" onClick={() => navigate("/doctor-login")}>
          Doctor Login
        </button>
        <button className="login-button nurse" onClick={() => navigate("/nurse-login")}>
          Nurse Login
        </button>
      </div>

      {/* Exit Button at Bottom Left */}
      <button className="exit-button" onClick={handleExit}>
        Exit
      </button>
    </div>
  );
};

export default Login;
