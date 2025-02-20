/*import React, { useState } from "react";
import "./Forms.css"; // Import CSS

const PatientRegister = () => {
  const [patientName, setPatientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [age, setAge] = useState(""); // New State for Age
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ patientName, idNumber, age,address }); // For now, just logging the data
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
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />






        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setHomeTown(e.target.value)}
          required
        />
        <button type="submit">Register Patient</button>
      </form>

      {/* Back to Main Menu Button *///}
      //<button onClick={() => navigate("/")} className="back-button">
        //Back to Main Menu
      //</button>

    //</div>
 // );
//};

//export default PatientRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms.css"; // Import CSS

const PatientRegister = () => {
  const [patientName, setPatientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [age, setAge] = useState(""); 
  const [gender, setGender] = useState(""); // ✅ Gender with Dropdown
  const [address, setAddress] = useState("");

  const navigate = useNavigate(); // ✅ Hook to navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ patientName, idNumber, age, gender, address });
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
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        
        {/* ✅ Gender Dropdown */}
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        
        <button type="submit">Register Patient</button>
      </form>

      {/* Back to Main Menu Button */}
      <button onClick={() => navigate("/")} className="back-button">
        Back to Main Menu
      </button>
    </div>
  );
};

export default PatientRegister;



   