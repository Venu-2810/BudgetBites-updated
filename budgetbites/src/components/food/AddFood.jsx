import React, { useState, useContext } from "react";
import { FoodContext } from "../../contexts/FoodContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AddFood = () => {
  const navigate = useNavigate();
  const { addFood } = useContext(FoodContext);
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", description: "", category: "", price: 0, image: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "creator") return alert("❌ You must be logged in as a creator to add food.");
    await addFood({ ...form, price: Number(form.price), creator: user._id });
    navigate("/");
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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🍕 Add Food Item</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={inputStyle} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={inputStyle} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} style={inputStyle} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} style={inputStyle} required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} style={inputStyle} required />
          <button type="submit" style={buttonStyle}>Add Food</button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;
