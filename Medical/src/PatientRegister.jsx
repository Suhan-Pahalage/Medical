
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Patientregister.css';

const PatientRegister = () => {
  const [patientName, setPatientName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [existingConditions, setExistingConditions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const patientData = {
      patient_id: idNumber,  // Use idNumber as patient_id (Primary Key)
      patientName,
      dob,
      email,
      age,
      gender,
      bloodType,
      allergies,
      existingConditions,
      emergencyContact,
      address
    };
  
    try {
      const response = await fetch('http://localhost:3000/register-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
  
      const result = await response.json();
  
      if (response.status === 201) {
        alert(result.message);  // ✅ Success message
      } else {
        alert(result.error);  // ❌ Show backend error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error registering patient.');
    }
    

  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "300px", padding: "20px" }}>
      <h2 style={{ color: "#FFFFFF", marginBottom: "20px" }}>Patient Registration</h2>
      <form onSubmit={handleSubmit} style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
        <input type="number" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
        <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
        
        {/* Gender Dropdown */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Blood Type Dropdown */}
        <select
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <input type="text" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        <input type="text" placeholder="Existing Conditions" value={existingConditions} onChange={(e) => setExistingConditions(e.target.value)} />
        <input type="text" placeholder="Emergency Contact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Register Patient
        </button>
      </form>
      <button
  onClick={() => navigate("/")}
  style={{
    position: "absolute",  // To position the button relative to the page
    top: "20px",           // Distance from the top
    right: "20px",         // Distance from the right
    marginTop: "20px",     // Optional: ensures some margin at the top
    padding: "10px",
    backgroundColor: "#2196f3", // Red background
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Main Menu
</button>

<button
  onClick={() => navigate("/nurse-login")}
  style={{
    position: "absolute",  // Position the button
    top: "20px",           // Distance from the top of the page
    right: "150px", 
    marginTop : "20px"   ,     // Distance from the right
    padding: "10px 20px",
    backgroundColor: "#2196f3", // Red background
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Back
</button>


    </div>
  );
};

export default PatientRegister;
