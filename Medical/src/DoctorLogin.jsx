import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forms.css"; // Import CSS for styling

const DoctorLogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    
      // Simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dummy authentication (Replace with backend API)
      if (id === "doctor123" && password === "password") {
        navigate("/doctor-dashboard"); // Navigate to the doctor dashboard
      } else {
        alert("Invalid ID or Password");
      }
     
  };

  return (
    <div className="login-wrapper"> {/* Wrapper to center everything */}
      <div className="login-containerdoctor"> {/* Main login box */}
      <h2 style={{ color: "white" }}>Doctor Login</h2> {/* Inline style for white color */}

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className="login-form"> 
          <div className="input-group">
            <input
              type="text"
              placeholder="Doctor ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              aria-label="Doctor ID"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </div>

          <button className="login-buttondoc" type="submit" 
           onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
           onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          
          
          >
           Login  
          </button>
        </form>

        
      </div>
      <button
          className="navigate-login-buttondoctor"
          onClick={() => navigate("/")}
        >
          Back
        </button>
         
    </div>
  );
};

export default DoctorLogin;
