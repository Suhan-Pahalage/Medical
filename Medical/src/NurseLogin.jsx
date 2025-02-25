import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "20px" }}>Nurse Login</h2>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.2)", /* White color with transparency */
          backdropFilter: "blur(10px)", /* Blur effect */
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nurse ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2196f3",
              border: "none",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Login
          </button>
        </form>
      </div>

      <button
        className="back-button"
        onClick={() => navigate("/")}
        style={{
          position: "absolute", // To position the button in a specific place
          top: "20px", // Distance from the top of the page
          right: "20px", // Distance from the right of the page
          padding: "10px 20px",
          backgroundColor: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e53935")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
      >
        Main Menu
      </button>
    </div>
  );
};

export default NurseLogin;
