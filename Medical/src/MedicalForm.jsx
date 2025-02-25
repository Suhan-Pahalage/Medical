import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MedicalForm.css";
import logo from "./med.jpg";
import jsPDF from "jspdf";

const MedicalForm = () => {
  const navigate = useNavigate();

  // State variables
  const [medicine, setMedicine] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dosage, setDosage] = useState({
    Mo: false,
    Af: false,
    Ev: false,
    SOS: false,
  });
  const [days, setDays] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remark, setRemark] = useState("");
  const [medications, setMedications] = useState([]);
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState( () =>{
        // Load doctor name from local storage on initial render
        const savedDoctor = localStorage.getItem("doctor");
        return savedDoctor || "";


  }


  );
  const [patientID, setPatientID] = useState("");
  const [complaint, setComplaint] = useState("");
  const [observation, setObservation] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [history, setHistory] = useState([]);


// Save doctor name to local storage whenever it changes
useEffect(() => {
  localStorage.setItem("doctor", doctor);
}, [doctor]);




  // Auto-fill date with today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // Fetch the patient's prescription history
  const fetchHistory = async () => {
    if (!patientID) {
      alert("⚠️ Please enter a Patient ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/history?patientID=${patientID}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Fetched history data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("⚠️ No history found for this patient.");
        setHistory([]); // Ensure history is an empty array
      } else {
        setHistory(data);
      }
    } catch (error) {
      console.error("❌ Error fetching patient history:", error);
      alert(`Failed to fetch history: ${error.message}`);
      setHistory([]); // Ensure history is an empty array
    }
  };

  // Fetch medicine suggestions from backend (Debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (medicine.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/search-medicine?q=${medicine}`
        );
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

    const dosageString =
      Object.keys(dosage)
        .filter((key) => dosage[key])
        .join("-") || "None";

    const newMedicine = {
      medicine,
      dosage: dosageString,
      days,
      quantity,
      remark,
    };
    setMedications([...medications, newMedicine]);

    // Reset fields
    setMedicine("");
    setDosage({ Mo: false, Af: false, Ev: false, SOS: false });
    setDays("");
    setQuantity("");
    setRemark("");
    setSuggestions([]);
  };

  // Remove medicine from the list
  const removeMedicine = (index) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  // Save prescription data to backend
  const savePrescription = async () => {
    const prescriptionData = {
      patientID,
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
        alert(
          "No medications added. Please add at least one medicine before downloading."
        );
        return;
      }

      const doc = new jsPDF();
      doc.setFont("times", "bold");
      doc.text("Medical Prescription", 80, 10);
      doc.line(10, 15, 200, 15); // Add a line below the title
      doc.setFontSize(12);
      doc.text(`Patient ID: ${patientID || "N/A"}`, 10, 40);
      doc.text(`Complaint: ${complaint || "N/A"}`, 10, 50);
      doc.text(`Date: ${date || "N/A"}`, 10, 20);
      doc.text(`Doctor: ${doctor || "N/A"}`, 10, 30);

      doc.text(`Observation: ${observation || "N/A"}`, 10, 60);
      doc.text(`Diagnosis: ${diagnosis || "N/A"}`, 10, 70);

      let yPos = 80;
      doc.text("Medicines:", 10, yPos);
      yPos += 10;

      medications.forEach((med, index) => {
        const medText = `${index + 1}. ${med.medicine || "Unknown"} - ${
          med.dosage || "N/A"
        } - ${med.days || "N/A"} days, ${med.remark || ""}`;
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label>Patient ID:</label>
        <input
          type="number"
          value={patientID}
          onChange={(e) => setPatientID(parseInt(e.target.value) || "")}
          placeholder="Enter Patient ID"
        />
        <button type="button" onClick={fetchHistory}>
          Watch History
        </button>
        {history.length > 0 && (
          <div className="history-section">
            <h3>Last 3 Days' History</h3>
            {history.map((entry, index) => (
              <div key={index} className="history-entry">
                <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
                <p>Doctor: {entry.doctor}</p>
                <p>Complaint: {entry.complaint}</p>
                <p>Observation: {entry.observation}</p>
                <p>Diagnosis: {entry.diagnosis}</p>
                <h4>Medicines:</h4>
                <ul>
                  {(entry.medicines || []).map((med, medIndex) => (
                    <li key={medIndex}>
                      {med.medicine} - {med.dosage} - {med.days} days - {med.quantity}{" "}
                      {med.remark && `(${med.remark})`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <label>Doctor:</label>
        <input
          type="text"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="Doctor's Name"
        />
        <label>Complaint:</label>
        <input
          type="text"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Patient's Complaint"
        />
        <label>Observation:</label>
        <input
          type="text"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Observations"
        />
        <label>Diagnosis:</label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Diagnosis"
        />
        <div className="medicine-section">
          <h2 className="medicine-title">Medicine</h2>
          <label>Medicine Name:</label>
          <input
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Enter Medicine"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setMedicine(item);
                    setSuggestions([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          <label>Dosage:</label>
          <div className="medicine-options">
            {Object.keys(dosage).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={dosage[key]}
                  onChange={handleDosageChange}
                />
                {key}
              </label>
            ))}
          </div>
          <label>No. of Days:</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <label>Quantity:</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="tbs/ml/etc"
          />
          <label>Remark:</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Before Meal, etc."
          />
        </div>
        <ul>
          {medications.map((med, index) => (
            <li key={index}>
              {med.medicine} - {med.dosage} - {med.days} days - {med.quantity}{" "}
              {med.remark && `(${med.remark})`}
              <button onClick={() => removeMedicine(index)}>❌</button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addMedicine}>
          Add Medicine
        </button>
      </form>

      <button onClick={generatePDF}>Download Prescription</button>

      {/* Back to Main Menu Button */}
      <button onClick={() => navigate("/")} className="back-button1">
         Main Menu
      </button>

      {/* Back to Doctor Dashboard Button */}
      <button
onClick={() => navigate("/doctor-dashboard")}
className="back-buttondoc"
>
Back 
</button>

    </div>


  );
   
};

export default MedicalForm;