import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

// import "./QDetails.css"; // Uncomment to import CSS if needed

const QDetails = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div>
      <h1 className="q-title">Q details</h1>
      <button
        onClick={() => navigate("/doctor-dashboard")}
        className="back-button"
        aria-label="Back to Doctor Dashboard"
      >
        Back to Doctor Dashboard
      </button>

      <button
        className="main-menu-button" // Separate class for this button if you want different styles
        onClick={() => navigate("/")}
        aria-label="Back to Main Menu"
      >
        ⬅ Back to Main Menu
      </button>
    </div>
  );
};

export default QDetails;
