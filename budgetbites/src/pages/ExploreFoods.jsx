import React, { useContext } from "react";
import { FoodContext } from "../contexts/FoodContext";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ExploreFoods = () => {
  const { filteredFoods } = useContext(FoodContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="explore-foods">
      <h1>🍴 Explore Foods</h1>
      {filteredFoods.map((food) => (
        <div key={food._id} className="food-card">
          <img src={food.image} alt={food.name} />
          <h3>{food.name}</h3>
          <p>{food.description}</p>
          <p>Category: {food.category}</p>
          <p>Price: Rs. {food.price}</p>

          {/* Show buttons only if creator added this food */}
          {user?.role === "creator" &&
            (food.creator?._id === user._id || food.creator === user._id) && (
              <div className="actions">
                <button onClick={() => navigate(`/edit-food/${food._id}`, { state: { food } })}>✏️ Edit</button>
                <button onClick={() => deleteFood(food._id)}>🗑️ Delete</button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default ExploreFoods;
