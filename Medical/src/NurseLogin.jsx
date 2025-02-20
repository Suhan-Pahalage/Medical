import React, { useState } from "react";
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

export default NurseLogin;


 