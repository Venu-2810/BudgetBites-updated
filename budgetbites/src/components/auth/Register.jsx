import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) return alert("Please fill all fields and select role!");
    try {
      await register(form.email, form.password, form.role);
      alert("✅ Registration successful! Verify your email.");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.message || err.message));
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
        <h2 style={titleStyle}>🍴 Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
          <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="creator">Creator</option>
          </select>
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <p style={footerStyle}>
          Already have an account? <span style={linkStyle} onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
