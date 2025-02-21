import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './PatientDetails.css';


const PatientDetails = () => {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Define navigate here


  const handleSearch = async () => {
    if (!patientId) {
      setError("Please enter a Patient ID.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/get-patient/${patientId}`);
      setPatientData(response.data);
      setError(""); // Clear previous errors
    } catch (err) {
      setError("Patient not found or database error.");
      setPatientData(null);
    }
  };

  return (
    <div>
      <h2>Search Patient Details</h2>
      <input
        type="text"
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {patientData && (
        <div className="patient-details">
          <h3>Patient Information</h3>
          <p><strong>Full Name:</strong> {patientData.full_name}</p>
          <p><strong>Date of Birth:</strong> {patientData.date_of_birth}</p>
          <p><strong>Gender:</strong> {patientData.gender}</p>
          <p><strong>Phone:</strong> {patientData.phone}</p>
          <p><strong>Email:</strong> {patientData.email}</p>
          <p><strong>Blood Type:</strong> {patientData.blood_type}</p>
          <p><strong>Allergies:</strong> {patientData.allergies || "None"}</p>
          <p><strong>Existing Conditions:</strong> {patientData.existing_conditions || "None"}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>Emergency Contact:</strong> {patientData.emergency_contact_phone}</p>
        </div>
      )}

<button onClick={() => navigate("/doctor-dashboard")} className="back-button">
        Back to Doctor Dashboard
      </button>
    </div>
  );
};

export default PatientDetails;

