import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FoodContext } from "../contexts/FoodContext";

const EditFood = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // fallback if no state
  const { filteredFoods, updateFood } = useContext(FoodContext);

  // Get the food either from location.state or from context
  const foodFromState = location.state?.food;
  const food =
    foodFromState || filteredFoods.find((f) => f._id === id) || {};

  const [form, setForm] = useState({
    name: food.name || "",
    description: food.description || "",
    category: food.category || "",
    price: food.price || 0,
    image: food.image || "",
  });

  useEffect(() => {
    if (!food._id) {
      alert("Food not found!");
      navigate("/foods");
    }
  }, [food, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateFood(food._id, { ...form, price: Number(form.price) });
    navigate("/");
  };

  return (
    <div className="edit-food-page">
      <h1>✏️ Edit Food</h1>

      <form onSubmit={handleSubmit} className="edit-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit">💾 Save Changes</button>
          <button type="button" onClick={() => navigate(-1)}>
            🔙 Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFood;
