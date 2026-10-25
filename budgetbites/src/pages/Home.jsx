import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FoodContext } from "../contexts/FoodContext";
import { AuthContext } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { filteredFoods, deleteFood } = useContext(FoodContext);
  const { user, logout } = useContext(AuthContext);

  // Only show foods added by logged-in creator
  const myFoods = filteredFoods.filter(
    (food) =>
      user?.role === "creator" &&
      (food.creator?._id === user._id || food.creator === user._id)
  );

  const handleEdit = (food) =>
    navigate(`/edit-food/${food._id}`, { state: { food } });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      await deleteFood(id);
    }
  };

  return (
    <div className="Home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🍔 BudgetBites</div>
        <ul>
          <li><Link to="/">Home</Link></li>

          {/* Only show Explore Foods if user is logged in */}
          {user && (
            <li>
              <Link to="/foods">Explore Foods</Link>
            </li>
          )}

          {!user && (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {user?.role === "creator" && (
            <li><Link to="/add-food">Add Food</Link></li>
          )}

          {user?.role === "creator" && (
            <li><Link to="/creator-orders">🧾 Incoming Orders</Link></li>
          )}

          {user && user?.role !== "creator" && (
            <li><Link to="/my-orders">📦 My Orders</Link></li>
          )}

          {user && (
            <li><button onClick={logout}>Logout</button></li>
          )}
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to <span className="highlight">BudgetBites</span> 🍔</h1>
        <p>Discover delicious meals at prices that make you smile!</p>

        {user ? (
          <button onClick={() => navigate("/foods")}>Explore Foods</button>
        ) : (
          <button
            onClick={() => {
              alert("⚠️ You must login first to explore foods.");
              navigate("/login");
            }}
          >
            Explore Foods
          </button>
        )}
      </section>

      {/* Creator foods */}
      {user?.role === "creator" && (
        <section className="my-foods">
          <h2>🍱 My Added Foods</h2>
          <div className="food-list">
            {myFoods.length ? (
              myFoods.map((food) => (
                <div key={food._id} className="food-card">
                  <img src={food.image} alt={food.name} />
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p><strong>Category:</strong> {food.category}</p>
                  <p><strong>Price:</strong> Rs. {food.price}</p>
                  <div className="actions">
                    <button onClick={() => handleEdit(food)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(food._id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No foods added yet.</p>
            )}
          </div>
        </section>
      )}

      <footer>© 2025 BudgetBites | Eat Smart, Spend Less 🍕</footer>
    </div>
  );
};

export default Home;