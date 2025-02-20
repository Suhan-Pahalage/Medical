/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms.css"; // Import CSS

const NurseLogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy authentication (Replace with backend API)
    if (id === "nurse123" && password === "password") {
      navigate("/patient-register");
    } else {
      alert("Invalid ID or Password");
    }
  };

  return (
    <div>
      <h2>Nurse Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Nurse ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button className="back-button" onClick={() => navigate("/")}>⬅ Back to Main Menu</button>
    </div>
  );
};

//export default NurseLogin;
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./MedicalForm.css";
import logo from "./med.jpg";
import jsPDF from "jspdf";

const MedicalForm = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  const [medicine, setMedicine] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dosage, setDosage] = useState({ Mo: false, Af: false, Ev: false, SOS: false });
  const [days, setDays] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remark, setRemark] = useState("");
  const [medications, setMedications] = useState([]);
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [complaint, setComplaint] = useState("");
  const [observation, setObservation] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  // Fetch medicine suggestions from backend (Debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (medicine.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/search-medicine?q=${medicine}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching medicine suggestions:", error);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [medicine]);

  const handleDosageChange = (event) => {
    setDosage({ ...dosage, [event.target.name]: event.target.checked });
  };

  const addMedicine = () => {
    if (!medicine || !days || !quantity) {
      alert("Please fill in all medicine details before adding.");
      return;
    }

    const dosageString = Object.keys(dosage)
      .filter((key) => dosage[key])
      .join("-") || "None";

    const newMedicine = { medicine, dosage: dosageString, days, quantity, remark };
    setMedications([...medications, newMedicine]);

    // Reset fields
    setMedicine("");
    setDosage({ Mo: false, Af: false, Ev: false, SOS: false });
    setDays("");
    setQuantity("");
    setRemark("");
    setSuggestions([]);
  };

  // Save prescription data to backend
  const savePrescription = async () => {
    const prescriptionData = {
      date,
      doctor,
      complaint,
      observation,
      diagnosis,
      medications,
    };

    try {
      const response = await fetch("http://localhost:3000/save-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      const result = await response.json();
      console.log("✅ Server Response:", result);

      if (!response.ok) {
        alert(`❌ Error: ${result.error}`);
        throw new Error(result.error);
      }

      alert("✅ Prescription saved successfully!");
    } catch (error) {
      console.error("❌ Error saving prescription:", error);
      alert("Failed to save prescription. Please try again.");
    }
  };

  // Generate PDF after saving prescription
  const generatePDF = async () => {
    try {
      await savePrescription();

      if (!medications || medications.length === 0) {
        alert("No medications added. Please add at least one medicine before downloading.");
        return;
      }

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.text("Medical Prescription", 80, 10);
      doc.setFontSize(12);
      doc.text(`Date: ${date || "N/A"}`, 10, 20);
      doc.text(`Doctor: ${doctor || "N/A"}`, 10, 30);
      doc.text(`Complaint: ${complaint || "N/A"}`, 10, 40);
      doc.text(`Observation: ${observation || "N/A"}`, 10, 50);
      doc.text(`Diagnosis: ${diagnosis || "N/A"}`, 10, 60);

      let yPos = 70;
      doc.text("Medicines:", 10, yPos);
      yPos += 10;

      medications.forEach((med, index) => {
        const medText = `${index + 1}. ${med.medicine || "Unknown"} - ${med.dosage || "N/A"} - ${med.days || "N/A"} days, ${med.remark || ""}`;
        doc.text(medText, 10, yPos);
        yPos += 10;
      });

      doc.save("prescription.pdf");
      alert("✅ PDF Downloaded Successfully!");
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="medical-form">
      <div className="form-header">
        <img src={logo} alt="Medical Logo" className="logo" />
        <h2>Prescription</h2>
      </div>

      <form>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Doctor:</label>
        <input type="text" value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Doctor's Name" />

        <label>Complaint:</label>
        <input type="text" value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Patient's Complaint" />

        <label>Observation:</label>
        <input type="text" value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Observations" />

        <label>Diagnosis:</label>
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />

        <label>Medicine:</label>
        <input type="text" value={medicine} onChange={(e) => setMedicine(e.target.value)} placeholder="Enter Medicine" />

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => { setMedicine(item); setSuggestions([]); }}>
                {item}
              </li>
            ))}
          </ul>
        )}

        <label>Dosage:</label>
        <div className="medicine-options">
          {Object.keys(dosage).map((key) => (
            <label key={key}>
              <input type="checkbox" name={key} checked={dosage[key]} onChange={handleDosageChange} /> {key}
            </label>
          ))}
        </div>

        <label>No. of Days:</label>
        <input type="number" value={days} onChange={(e) => setDays(e.target.value)} />

        <label>Quantity:</label>
        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="tbs/ml/etc" />

        <label>Remark:</label>
        <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Before Meal, etc." />

        <button type="button" onClick={addMedicine}>Add Medicine</button>
      </form>

      <button onClick={generatePDF}>Download Prescription</button>

      {/* Back to Main Menu Button */}
      <button onClick={() => navigate("/main-menu")} className="back-button">
        Back to Main Menu
      </button>
    </div>
  );
};

export default MedicalForm;
