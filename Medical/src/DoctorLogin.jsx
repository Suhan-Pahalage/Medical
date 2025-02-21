import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms.css"; // Import CSS

const DoctorLogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy authentication (Replace with backend API)
    if (id === "doctor123" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid ID or Password");
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Doctor ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h3>Welcome, Doctor!</h3>
          <button onClick={() => navigate("/patient-details")}>Patient Details</button>
          <button onClick={() => navigate("/q-details")}>Q-Details</button>
          <button onClick={() => navigate("/medical-form")}>Prescription</button>
        </div>
      )}

      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Back to Main Menu
      </button>
    </div>
  );
};

export default DoctorLogin;
