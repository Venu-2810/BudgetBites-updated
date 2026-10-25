import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #ffe5b4, #ffb347)",
    padding: "20px"
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#ff6600",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  };

  const titleStyle = {
    textAlign: "center",
    color: "#ff6600",
    marginBottom: "25px",
    fontSize: "28px"
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px"
  };

  const linkStyle = { color: "#ff6600", cursor: "pointer", fontWeight: "bold" };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🍔 Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <p style={footerStyle}>
          Don't have an account? <span style={linkStyle} onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;