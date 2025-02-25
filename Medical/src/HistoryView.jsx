import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./HistoryView.css"; // Import CSS for styling

const HistoryView = () => {
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const patientID = queryParams.get("patientID");

    if (patientID) {
      // Fetch history data from the server using patientID
      const fetchHistory = async () => {
        try {
          const response = await fetch(`/history?patientID=${patientID}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();

          // Transform the flat response into the nested structure
          const groupedData = result.reduce((acc, row) => {
            const existingEntry = acc.find(
              (entry) => entry.prescription_id === row.prescription_id
            );

            if (existingEntry) {
              existingEntry.medicines.push({
                medicine: row.medicine,
                dosage: row.dosage,
                days: row.days,
                quantity: row.quantity,
                remark: row.remark,
              });
            } else {
              acc.push({
                prescription_id: row.prescription_id,
                date: row.date,
                doctor: row.doctor,
                complaint: row.complaint,
                observation: row.observation,
                diagnosis: row.diagnosis,
                medicines: [
                  {
                    medicine: row.medicine,
                    dosage: row.dosage,
                    days: row.days,
                    quantity: row.quantity,
                    remark: row.remark,
                  },
                ],
              });
            }
            return acc;
          }, []);

          console.log("Transformed data:", groupedData); // Debugging
          setHistory(groupedData);
        } catch (err) {
          setError(err.message || "Failed to fetch history due to network error");
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    } else {
      setError("Patient ID is required");
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading patient history...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="history-container">
      <h2>Patient History</h2>
      {history.length > 0 ? (
        history.map((entry, index) => (
          <div key={index} className="history-entry">
            <h3>Prescription ID: {entry.prescription_id}</h3>
            <h4>Date: {new Date(entry.date).toLocaleDateString()}</h4>
            <p>
              <strong>Doctor:</strong> {entry.doctor}
            </p>
            <p>
              <strong>Complaint:</strong> {entry.complaint}
            </p>
            <p>
              <strong>Observation:</strong> {entry.observation}
            </p>
            <p>
              <strong>Diagnosis:</strong> {entry.diagnosis}
            </p>

            <div>
              <h5>Medicines:</h5>
              <ul>
                {(entry.medicines || []).map((med, medIndex) => (
                  <li key={medIndex}>
                    <strong>{med.medicine}</strong>
                    <br />
                    <span>Dosage: {med.dosage}</span>
                    <br />
                    <span>Days: {med.days}</span>
                    <br />
                    <span>Quantity: {med.quantity}</span>
                    <br />
                    {med.remark && (
                      <span>
                        <strong>Remark:</strong> {med.remark}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="no-history">No history found for this patient.</p>
      )}
    </div>
  );
};

export default HistoryView;