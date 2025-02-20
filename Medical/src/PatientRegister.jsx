import React, { useState } from "react";
import "./Forms.css"; // Import CSS

const PatientRegister = () => {
  const [patientName, setPatientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [homeTown, setHomeTown] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ patientName, idNumber, homeTown }); // For now, just logging the data
    alert("Patient registered successfully!");
  };

  return (
    <div>
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Home Town"
          value={homeTown}
          onChange={(e) => setHomeTown(e.target.value)}
          required
        />
        <button type="submit">Register Patient</button>
      </form>
    </div>
  );
};

export default PatientRegister;


   